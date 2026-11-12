import type { ContentRecord, Workspace } from "../../../shared/mansalpha";

/** Reading the public version must never replace an existing private edited record. */
export function editablePublicRecord(
  record: ContentRecord,
  workspace: Workspace | null,
  createId: () => string = () => crypto.randomUUID()
): ContentRecord {
  const existing = workspace?.records.find(item => item.id === record.id);
  return existing
    ? structuredClone(existing)
    : { ...structuredClone(record), id: createId(), status: "u izradi" };
}
export function homepageQuery(query: string) {
  const params = new URLSearchParams(query);
  return {
    search: params.get("q") || "",
    topic: params.get("tema") || "",
    detailId: params.get("citaj") || "",
  };
}
export function withoutDetailQuery(path: string, query: string) {
  const params = new URLSearchParams(query);
  params.delete("citaj");
  const rest = params.toString();
  return rest ? `${path}?${rest}` : path;
}
