import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SQL } from "drizzle-orm";
import { MySqlDialect } from "drizzle-orm/mysql-core";
import { mansalphaWorkspaces } from "../drizzle/schema";
import type { Workspace } from "../shared/mansalpha";
import type { TrpcContext } from "./_core/context";

const { mockGetDb } = vi.hoisted(() => ({ mockGetDb: vi.fn() }));
// Every database operation in this file is a mock. Never connect to the managed DB.
vi.mock("./db", () => ({ getDb: mockGetDb }));

import { appRouter } from "./routers";
import { seedWorkspace } from "./seed";
import { safeAssetUrlSchema, saveWorkspaceInputSchema, workspaceSchema } from "./workspace";

function fixture(): Workspace {
  return {
    records: [{
      id: "record-1", title: "Private draft", kind: "article", summary: "Summary", content: "Draft content",
      topics: ["Psihologija"], status: "u izradi", assetUrl: "/manus-storage/docs/article.docx",
      imageUrl: "/media/image.jpg", videoUrl: "https://www.youtube.com/watch?v=test", format: "DOCX", sourceNote: "Source note",
    }],
    templates: [{ id: "template-1", title: "Email template", type: "email", content: "Hello" }],
    lecture: {
      title: "Lecture", audience: "20–30", date: "2026-12-01", location: "Room 1",
      tasks: [{ id: "task-1", text: "Prepare", done: false }], materialIds: ["record-1"],
      contacts: [{ id: "contact-1", name: "A Person", role: "Speaker", email: "speaker@example.com" }],
      promotions: [{ id: "promotion-1", channel: "Email", text: "Invitation", status: "ideja" }],
      notes: "Private notes", agenda: [{ id: "agenda-1", title: "Intro", duration: "10 min" }],
    },
  };
}

function context(ownerId: number | null): TrpcContext {
  return {
    user: ownerId === null ? null : {
      id: ownerId, openId: `real-auth-user-${ownerId}`, name: "User", email: "user@example.com",
      loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function fakeDb() {
  const limit = vi.fn().mockResolvedValue([]);
  const selectWhere = vi.fn((_condition: SQL) => ({ limit }));
  const from = vi.fn(() => ({ where: selectWhere }));
  const select = vi.fn(() => ({ from }));
  const updateWhere = vi.fn(async (_condition: SQL) => [{ affectedRows: 1 }]);
  const set = vi.fn(() => ({ where: updateWhere }));
  const update = vi.fn(() => ({ set }));
  const values = vi.fn().mockResolvedValue([{ affectedRows: 1 }]);
  const insert = vi.fn(() => ({ values }));
  return { select, from, selectWhere, limit, update, set, updateWhere, insert, values };
}

const dialect = new MySqlDialect();
let db: ReturnType<typeof fakeDb>;
beforeEach(() => {
  mockGetDb.mockReset();
  db = fakeDb();
  mockGetDb.mockResolvedValue(db);
});

describe("workspace full schema and safe links", () => {
  it("accepts every shared field, empty links and empty contact email", () => {
    const workspace = fixture();
    workspace.records[0]!.assetUrl = "";
    workspace.lecture.contacts[0]!.email = "";
    expect(workspaceSchema.parse(workspace)).toEqual(workspace);
  });

  it.each([
    "https://example.com/article?q=1#section", "HTTPS://example.com/image.jpg", "/manus-storage/report.docx",
    "/media/image.png", "/media/image%20name.png", "", "/media", "/manus-storage/object?download=1",
  ])("allows approved asset URL %s", url => {
    expect(safeAssetUrlSchema.safeParse(url).success).toBe(true);
  });

  it.each([
    "javascript:alert(1)", "data:text/html,test", "file:///etc/passwd", "http://example.com/image",
    "//evil.example/image", "https:evil.example", "https://user:password@example.com/image",
    "/mediaevil/image", "/other/image", "/media/../private", "/media/%2e%2e/private",
    "/media/%2f%2fevil.example", "/media\\evil", " https://example.com", "https://example.com/\nimage",
    "https://example.com/%00image", "/media/invalid%ZZ",
  ])("rejects unsafe asset URL %s", url => {
    expect(safeAssetUrlSchema.safeParse(url).success).toBe(false);
  });

  it("checks safety on asset, image and video fields", () => {
    for (const key of ["assetUrl", "imageUrl", "videoUrl"] as const) {
      const workspace = fixture();
      workspace.records[0]![key] = "javascript:alert(1)";
      expect(workspaceSchema.safeParse(workspace).success).toBe(false);
    }
  });

  it("rejects missing fields, invalid enums, types, email, and unknown nested fields", () => {
    const complete = fixture();
    const invalid = [
      { ...complete, records: [{ ...complete.records[0], kind: "unknown" }] },
      { ...complete, records: [{ ...complete.records[0], status: "unknown" }] },
      { ...complete, templates: [{ ...complete.templates[0], type: "video" }] },
      { ...complete, lecture: { ...complete.lecture, tasks: [{ id: "t", text: "Test", done: "yes" }] } },
      { ...complete, lecture: { ...complete.lecture, contacts: [{ id: "c", name: "N", role: "R", email: "not-an-email" }] } },
      { ...complete, lecture: { ...complete.lecture, agenda: [{ id: "a", title: "Title", duration: "10", ownerId: 2 }] } },
      { records: complete.records, lecture: complete.lecture },
      { ...complete, ownerId: 2 },
    ];
    for (const workspace of invalid) expect(workspaceSchema.safeParse(workspace).success).toBe(false);
  });

  it("allows generous one-million-character content but enforces bounds", () => {
    const workspace = fixture();
    workspace.records[0]!.content = "a".repeat(1_000_000);
    expect(workspaceSchema.safeParse(workspace).success).toBe(true);
    workspace.records[0]!.content += "a";
    expect(workspaceSchema.safeParse(workspace).success).toBe(false);
    workspace.records[0]!.content = "";
    workspace.records[0]!.title = "a".repeat(501);
    expect(workspaceSchema.safeParse(workspace).success).toBe(false);
  });

  it("rejects oversized total JSON and oversized collections", () => {
    const workspace = fixture();
    const record = { ...workspace.records[0]!, content: "a".repeat(1_000_000) };
    workspace.records = Array.from({ length: 26 }, (_, index) => ({ ...record, id: `record-${index}` }));
    expect(workspaceSchema.safeParse(workspace).success).toBe(false);
    workspace.records = [];
    workspace.lecture.tasks = Array.from({ length: 1001 }, (_, index) => ({ id: `t-${index}`, text: "", done: false }));
    expect(workspaceSchema.safeParse(workspace).success).toBe(false);
  });

  it("requires a nonnegative integer revision and refuses owner/user selectors", () => {
    for (const revision of [-1, 0.5, NaN, Infinity, "1", 2_147_483_648]) {
      expect(saveWorkspaceInputSchema.safeParse({ workspace: fixture(), revision }).success).toBe(false);
    }
    expect(saveWorkspaceInputSchema.safeParse({ workspace: fixture(), revision: 0 }).success).toBe(true);
    for (const selector of ["ownerId", "userId", "id"]) {
      expect(saveWorkspaceInputSchema.safeParse({ workspace: fixture(), revision: 0, [selector]: 99 }).success).toBe(false);
    }
  });

  it("stores multi-megabyte JSON in LONGTEXT with a unique owner and default revision", () => {
    expect(mansalphaWorkspaces.data.getSQLType()).toBe("longtext");
    expect(mansalphaWorkspaces.userId.isUnique).toBe(true);
    expect(mansalphaWorkspaces.revision.default).toBe(1);
    expect(mansalphaWorkspaces.updatedAt.notNull).toBe(true);
    expect(mansalphaWorkspaces.updatedAt.hasDefault).toBe(true);
  });
});

describe("workspace get authentication and ownership", () => {
  it("serves only an independent seed to guests and never touches the database", async () => {
    mockGetDb.mockRejectedValue(new Error("DB unavailable"));
    const first = await appRouter.createCaller(context(null)).workspace.get();
    expect(first).toEqual({ workspace: seedWorkspace, revision: 0, authenticated: false });
    first.workspace.lecture.title = "Changed by guest";
    const second = await appRouter.createCaller(context(null)).workspace.get();
    expect(second.workspace.lecture.title).toBe(seedWorkspace.lecture.title);
    expect(mockGetDb).not.toHaveBeenCalled();
  });

  it("returns seed revision zero to a real authenticated user without a saved row", async () => {
    const result = await appRouter.createCaller(context(17)).workspace.get();
    expect(result).toEqual({ workspace: seedWorkspace, revision: 0, authenticated: true });
    const query = dialect.sqlToQuery(db.selectWhere.mock.calls[0]![0]);
    expect(query.sql).toMatch(/`mansalphaWorkspaces`.`userId` = \?/);
    expect(query.params).toEqual([17]);
  });

  it("reads only the authenticated owner's saved workspace", async () => {
    const workspace = fixture();
    db.limit.mockResolvedValue([{ id: 22, userId: 17, data: JSON.stringify(workspace), revision: 4, updatedAt: new Date() }]);
    const result = await appRouter.createCaller(context(17)).workspace.get();
    expect(result).toEqual({ workspace, revision: 4, authenticated: true });
    expect(dialect.sqlToQuery(db.selectWhere.mock.calls[0]![0]).params).toEqual([17]);
  });

  it("defensively refuses a database row owned by anyone else", async () => {
    db.limit.mockResolvedValue([{ userId: 99, data: JSON.stringify(fixture()), revision: 4 }]);
    await expect(appRouter.createCaller(context(17)).workspace.get()).rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
  });

  it("rejects stored invalid JSON, invalid fields, or invalid revisions rather than falling back", async () => {
    for (const row of [
      { userId: 17, data: "invalid-json", revision: 1 },
      { userId: 17, data: "{}", revision: 1 },
      { userId: 17, data: JSON.stringify(fixture()), revision: 0 },
    ]) {
      db.limit.mockResolvedValue([row]);
      await expect(appRouter.createCaller(context(17)).workspace.get()).rejects.toThrow();
    }
  });

  it("propagates an authenticated database read failure and unavailable connection", async () => {
    db.limit.mockRejectedValue(new Error("read connection failed"));
    await expect(appRouter.createCaller(context(17)).workspace.get()).rejects.toThrow("read connection failed");
    mockGetDb.mockResolvedValue(null);
    await expect(appRouter.createCaller(context(17)).workspace.get()).rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
  });
});

describe("workspace save optimistic concurrency and ownership", () => {
  it("rejects a guest save with real protectedProcedure auth", async () => {
    await expect(appRouter.createCaller(context(null)).workspace.save({ workspace: fixture(), revision: 0 }))
      .rejects.toMatchObject({ code: "UNAUTHORIZED" });
    expect(mockGetDb).not.toHaveBeenCalled();
  });

  it("rejects client owner selectors before any database query", async () => {
    await expect(appRouter.createCaller(context(17)).workspace.save({ workspace: fixture(), revision: 0, userId: 99 } as never))
      .rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(mockGetDb).not.toHaveBeenCalled();
  });

  it("inserts revision one with ownership derived exclusively from authenticated context", async () => {
    const workspace = fixture();
    const saved = await appRouter.createCaller(context(17)).workspace.save({ workspace, revision: 0 });
    expect(saved).toEqual({ workspace, revision: 1 });
    expect(db.values).toHaveBeenCalledWith({ userId: 17, data: JSON.stringify(workspace), revision: 1 });
    expect(db.update).not.toHaveBeenCalled();
  });

  it("checks owner AND expected revision in atomic SQL and returns confirmed revision", async () => {
    const workspace = fixture();
    const result = await appRouter.createCaller(context(17)).workspace.save({ workspace, revision: 5 });
    expect(result).toEqual({ workspace, revision: 6 });
    expect(db.set).toHaveBeenCalledWith({ data: JSON.stringify(workspace), revision: 6, updatedAt: expect.any(Date) });
    const query = dialect.sqlToQuery(db.updateWhere.mock.calls[0]![0]);
    expect(query.sql).toMatch(/`mansalphaWorkspaces`.`userId` = \?.*and.*`mansalphaWorkspaces`.`revision` = \?/);
    expect(query.params).toEqual([17, 5]);
    expect(db.select).not.toHaveBeenCalled();
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("never updates a different user's workspace or retries a stale update as insert", async () => {
    db.updateWhere.mockResolvedValue([{ affectedRows: 0 }]);
    await expect(appRouter.createCaller(context(23)).workspace.save({ workspace: fixture(), revision: 5 }))
      .rejects.toMatchObject({ code: "CONFLICT" });
    expect(dialect.sqlToQuery(db.updateWhere.mock.calls[0]![0]).params).toEqual([23, 5]);
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("allows only one of two competing existing-revision updates", async () => {
    db.updateWhere.mockResolvedValueOnce([{ affectedRows: 1 }]).mockResolvedValueOnce([{ affectedRows: 0 }]);
    const caller = appRouter.createCaller(context(17));
    const results = await Promise.allSettled([
      caller.workspace.save({ workspace: fixture(), revision: 5 }),
      caller.workspace.save({ workspace: fixture(), revision: 5 }),
    ]);
    expect(results[0]).toMatchObject({ status: "fulfilled", value: { revision: 6 } });
    expect(results[1]).toMatchObject({ status: "rejected", reason: { code: "CONFLICT" } });
  });

  it("handles a wrapped mysql first-insert race as conflict without overwriting", async () => {
    db.values.mockResolvedValueOnce([{ affectedRows: 1 }]).mockRejectedValueOnce({ cause: { code: "ER_DUP_ENTRY", errno: 1062 } });
    const caller = appRouter.createCaller(context(17));
    const results = await Promise.allSettled([
      caller.workspace.save({ workspace: fixture(), revision: 0 }),
      caller.workspace.save({ workspace: fixture(), revision: 0 }),
    ]);
    expect(results[0]).toMatchObject({ status: "fulfilled", value: { revision: 1 } });
    expect(results[1]).toMatchObject({ status: "rejected", reason: { code: "CONFLICT" } });
    expect(db.update).not.toHaveBeenCalled();
  });

  it("propagates real insert/update failures with no fabricated saved success", async () => {
    db.values.mockRejectedValue(new Error("insert connection failed"));
    await expect(appRouter.createCaller(context(17)).workspace.save({ workspace: fixture(), revision: 0 }))
      .rejects.toThrow("insert connection failed");
    db.updateWhere.mockRejectedValue(new Error("update connection failed"));
    await expect(appRouter.createCaller(context(17)).workspace.save({ workspace: fixture(), revision: 3 }))
      .rejects.toThrow("update connection failed");
    mockGetDb.mockResolvedValue(null);
    await expect(appRouter.createCaller(context(17)).workspace.save({ workspace: fixture(), revision: 0 }))
      .rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
  });

  it("never reports success for an unconfirmed insert or invalid multirow update", async () => {
    db.values.mockResolvedValue([{ affectedRows: 0 }]);
    await expect(appRouter.createCaller(context(17)).workspace.save({ workspace: fixture(), revision: 0 }))
      .rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
    db.updateWhere.mockResolvedValue([{ affectedRows: 2 }]);
    await expect(appRouter.createCaller(context(17)).workspace.save({ workspace: fixture(), revision: 1 }))
      .rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
  });

  it("rejects integer revision overflow before touching the database", async () => {
    await expect(appRouter.createCaller(context(17)).workspace.save({ workspace: fixture(), revision: 2_147_483_647 }))
      .rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(mockGetDb).not.toHaveBeenCalled();
  });
});
