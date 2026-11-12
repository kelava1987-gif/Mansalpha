import { seedWorkspace } from "./seed";
import type { ContentRecord } from "../shared/mansalpha";

/** Public-facing educational catalog only. Never query user drafts, contacts or lecture notes. */
export function getEditorialRecords(): ContentRecord[] {
  return structuredClone(
    seedWorkspace.records.filter(
      record =>
        !["restricted-forensic-presentation", "tea-ai-siguran-okvir"].includes(
          record.id
        ) &&
        !["event", "idea"].includes(record.kind) &&
        record.content.trim()
    )
  );
}
