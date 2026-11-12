import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { mansalphaWorkspaces } from "../drizzle/schema";
import { STATUSES, type Workspace } from "../shared/mansalpha";
import { getDb } from "./db";
import { seedWorkspace } from "./seed";

const MAX_REVISION = 2_147_483_647;
export const MAX_WORKSPACE_BYTES = 24 * 1024 * 1024;
const identifier = z.string().min(1).max(128);
const title = z.string().max(500);
const content = z.string().max(1_000_000);
const status = z.enum(STATUSES);

/** Empty links are allowed; populated links must stay in the approved schemes/namespaces. */
export const safeAssetUrlSchema = z.string().max(4096).refine(value => {
  if (value === "") return true;
  if (/[\s\\\u0000-\u001f\u007f]/u.test(value)) return false;
  try {
    // Reject malformed escapes and encoded controls/backslashes as well.
    const decoded = decodeURIComponent(value);
    if (/[\\\u0000-\u001f\u007f]/u.test(decoded)) return false;
    if (/^https:\/\//i.test(value)) {
      const url = new URL(value);
      return url.protocol === "https:" && !!url.hostname && !url.username && !url.password;
    }
    if (!/^\/(?:manus-storage|media)(?:\/|[?#]|$)/.test(value)) return false;
    // Dot traversal or encoded separators must not escape an approved local namespace.
    const path = value.split(/[?#]/, 1)[0]!;
    const decodedPath = decodeURIComponent(path);
    if (/%(?:2f|5c)/i.test(path) || decodedPath.split("/").some(part => part === "." || part === "..")) return false;
    const url = new URL(value, "https://workspace.invalid");
    return url.origin === "https://workspace.invalid" && /^\/(?:manus-storage|media)(?:\/|$)/.test(url.pathname);
  } catch {
    return false;
  }
}, "Use an HTTPS URL or a /manus-storage or /media path.");

const recordSchema = z.object({
  id: identifier,
  title,
  kind: z.enum(["article", "presentation", "video", "source", "event", "idea"]),
  summary: z.string().max(20_000),
  content,
  topics: z.array(z.string().min(1).max(100)).max(64),
  status,
  assetUrl: safeAssetUrlSchema,
  imageUrl: safeAssetUrlSchema,
  videoUrl: safeAssetUrlSchema,
  format: z.string().max(200),
  sourceNote: z.string().max(20_000),
}).strict();

const templateSchema = z.object({
  id: identifier,
  title,
  type: z.enum(["article", "presentation", "post", "email"]),
  content,
}).strict();

const lectureSchema = z.object({
  title,
  audience: z.string().max(2000),
  date: z.string().max(100),
  location: z.string().max(2000),
  tasks: z.array(z.object({ id: identifier, text: z.string().max(10_000), done: z.boolean() }).strict()).max(1000),
  materialIds: z.array(identifier).max(5000),
  contacts: z.array(z.object({
    id: identifier,
    name: title,
    role: z.string().max(500),
    email: z.union([z.literal(""), z.email().max(320)]),
  }).strict()).max(1000),
  promotions: z.array(z.object({
    id: identifier,
    channel: z.string().max(500),
    text: content,
    status,
  }).strict()).max(1000),
  notes: content,
  agenda: z.array(z.object({
    id: identifier,
    title,
    duration: z.string().max(100),
  }).strict()).max(1000),
}).strict();

/** All shared Workspace fields are required, bounded, and reject unknown ownership fields. */
export const workspaceSchema = z.object({
  records: z.array(recordSchema).max(5000),
  templates: z.array(templateSchema).max(1000),
  lecture: lectureSchema,
}).strict().refine(
  workspace => Buffer.byteLength(JSON.stringify(workspace), "utf8") <= MAX_WORKSPACE_BYTES,
  "Workspace JSON must not exceed 24 MiB.",
);

export const saveWorkspaceInputSchema = z.object({
  workspace: workspaceSchema,
  revision: z.number().int().min(0).max(MAX_REVISION),
}).strict();

export type WorkspaceSaveInput = z.infer<typeof saveWorkspaceInputSchema>;
export type WorkspaceResult = { workspace: Workspace; revision: number; authenticated: boolean };

function assertOwnerId(ownerId: number) {
  if (!Number.isInteger(ownerId) || ownerId < 1 || ownerId > MAX_REVISION) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "A valid authenticated user is required." });
  }
}

async function requireDb() {
  const db = await getDb();
  if (!db) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Workspace database is unavailable." });
  }
  return db;
}

function conflict() {
  return new TRPCError({
    code: "CONFLICT",
    message: "The workspace changed elsewhere. Reload it before saving again.",
  });
}

// Drizzle wraps mysql2 errors in a cause. Only a duplicate key means an insert race.
function isDuplicateKey(error: unknown): boolean {
  let current: unknown = error;
  for (let depth = 0; depth < 6 && current && typeof current === "object"; depth++) {
    const candidate = current as { code?: unknown; errno?: unknown; cause?: unknown };
    if (candidate.code === "ER_DUP_ENTRY" || candidate.errno === 1062) return true;
    current = candidate.cause;
  }
  return false;
}

function defaultWorkspace(): Workspace {
  // Do not share a mutable seed instance and never persist/reset it on process startup.
  return structuredClone(seedWorkspace);
}

export async function getWorkspace(ownerId: number | null): Promise<WorkspaceResult> {
  if (ownerId === null) {
    // Guests never query the private workspace table, including when the DB is unavailable.
    return { workspace: defaultWorkspace(), revision: 0, authenticated: false };
  }
  assertOwnerId(ownerId);
  const db = await requireDb();
  const rows = await db.select().from(mansalphaWorkspaces)
    .where(eq(mansalphaWorkspaces.userId, ownerId)).limit(1);
  const row = rows[0];
  if (!row) return { workspace: defaultWorkspace(), revision: 0, authenticated: true };
  if (row.userId !== ownerId || !Number.isInteger(row.revision) || row.revision < 1) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Stored workspace metadata is invalid." });
  }
  // Invalid JSON/data is a real failure, not a fallback that could overwrite private drafts.
  const parsed = workspaceSchema.safeParse(JSON.parse(row.data));
  if (!parsed.success) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Stored workspace data is invalid.", cause: parsed.error });
  }
  return { workspace: parsed.data, revision: row.revision, authenticated: true };
}

export async function saveWorkspace(ownerId: number, input: WorkspaceSaveInput): Promise<{ workspace: Workspace; revision: number }> {
  assertOwnerId(ownerId);
  const validated = saveWorkspaceInputSchema.parse(input);
  if (validated.revision === MAX_REVISION) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Workspace revision limit reached." });
  }
  const db = await requireDb();
  const revision = validated.revision + 1;
  const data = JSON.stringify(validated.workspace);
  if (validated.revision === 0) {
    try {
      const [result] = await db.insert(mansalphaWorkspaces).values({
        userId: ownerId,
        data,
        revision,
      });
      if (result.affectedRows !== 1) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Workspace insert was not confirmed." });
      }
    } catch (error) {
      if (isDuplicateKey(error)) throw conflict();
      throw error;
    }
  } else {
    // The owner AND expected revision are checked atomically in the database, not in JS.
    const [result] = await db.update(mansalphaWorkspaces).set({ data, revision, updatedAt: new Date() })
      .where(and(
        eq(mansalphaWorkspaces.userId, ownerId),
        eq(mansalphaWorkspaces.revision, validated.revision),
      ));
    if (result.affectedRows === 0) throw conflict();
    if (result.affectedRows !== 1) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Workspace update was not confirmed." });
    }
  }
  // Success is returned only after the real database confirms the write.
  return { workspace: validated.workspace, revision };
}
