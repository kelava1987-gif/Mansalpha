import type { ContentRecord, Workspace } from "@shared/mansalpha";
export function downloadText(
  text: string,
  name: string,
  type = "text/plain;charset=utf-8"
) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function slug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
export function exportRecord(
  record: ContentRecord,
  format: "md" | "txt" = "md"
) {
  downloadText(
    `# ${record.title}\n\n${record.summary}\n\n${record.content}\n\nTeme: ${record.topics.join(", ")}\nStatus: ${record.status}\n${record.sourceNote}`,
    `${slug(record.title) || "mansalpha"}.${format}`
  );
}
export function exportWorkspace(workspace: Workspace) {
  downloadText(
    JSON.stringify(workspace, null, 2),
    "mansalpha-radni-prostor.json",
    "application/json"
  );
}
export function videoEmbed(url: string): {
  type: "file" | "embed" | "link";
  url: string;
} {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return { type: "link", url: "" };
    if (u.hostname === "youtu.be")
      return {
        type: "embed",
        url: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(u.pathname.slice(1))}`,
      };
    if (
      ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(u.hostname)
    ) {
      const id = u.searchParams.get("v") || u.pathname.split("/").pop();
      return {
        type: "embed",
        url: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id || "")}`,
      };
    }
    if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) return { type: "file", url };
    return { type: "link", url };
  } catch {
    return /^\/(manus-storage|media)\//.test(url)
      ? { type: "file", url }
      : { type: "link", url: "" };
  }
}
