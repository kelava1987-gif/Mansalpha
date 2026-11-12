export const TOPICS = [
  "Umjetna inteligencija",
  "Mentalno zdravlje",
  "Psihologija",
  "Filozofija",
  "Kreativnost",
  "Sigurnost",
] as const;
export const STATUSES = ["ideja", "u izradi", "spremno", "objavljeno"] as const;
export type Status = (typeof STATUSES)[number];
export type Kind =
  | "article"
  | "presentation"
  | "video"
  | "source"
  | "event"
  | "idea";
export const KIND_LABELS: Record<Kind, string> = {
  article: "Članak",
  presentation: "Prezentacija",
  video: "Videozapis",
  source: "Izvor",
  event: "Događaj",
  idea: "Ideja",
};
export interface ContentRecord {
  id: string;
  title: string;
  kind: Kind;
  summary: string;
  content: string;
  topics: string[];
  status: Status;
  assetUrl: string;
  imageUrl: string;
  videoUrl: string;
  format: string;
  sourceNote: string;
}
export interface ContentTemplate {
  id: string;
  title: string;
  type: "article" | "presentation" | "post" | "email";
  content: string;
}
export interface Lecture {
  title: string;
  audience: string;
  date: string;
  location: string;
  tasks: { id: string; text: string; done: boolean }[];
  materialIds: string[];
  contacts: { id: string; name: string; role: string; email: string }[];
  promotions: { id: string; channel: string; text: string; status: Status }[];
  notes: string;
  agenda: { id: string; title: string; duration: string }[];
}
export interface Workspace {
  records: ContentRecord[];
  templates: ContentTemplate[];
  lecture: Lecture;
}
export const emptyRecord = (kind: Kind = "article"): ContentRecord => ({
  id: crypto.randomUUID(),
  title: "",
  kind,
  summary: "",
  content: "",
  topics: [],
  status: "ideja",
  assetUrl: "",
  imageUrl: "",
  videoUrl: "",
  format: "",
  sourceNote: "",
});
