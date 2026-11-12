import { describe, it, expect } from "vitest";
import {
  editablePublicRecord,
  homepageQuery,
  withoutDetailQuery,
} from "../client/src/lib/homepageState";
import { seedWorkspace } from "./seed";

describe("Homepage editing and URL safeguards", () => {
  it("opens the saved user version instead of overwriting it with public seed content", () => {
    const publicRecord = seedWorkspace.records[0];
    const saved = {
      ...publicRecord,
      title: "User edited title",
      content: "User edited content",
    };
    const workspace = { ...seedWorkspace, records: [saved] };
    const editable = editablePublicRecord(
      publicRecord,
      workspace,
      () => "new-id"
    );
    expect(editable.id).toBe(saved.id);
    expect(editable.content).toBe(saved.content);
    expect(editable.title).toBe(saved.title);
    editable.content = "changed";
    expect(saved.content).toBe("User edited content");
  });
  it("creates a new draft copy if the public record is not already in the workspace", () => {
    const record = seedWorkspace.records[0];
    const copy = editablePublicRecord(
      record,
      { ...seedWorkspace, records: [] },
      () => "copy-id"
    );
    expect(copy.id).toBe("copy-id");
    expect(copy.status).toBe("u izradi");
    expect(copy.content).toBe(record.content);
    expect(record.id).not.toBe("copy-id");
  });
  it("reads search and topic state from a restored browser URL", () => {
    expect(homepageQuery("q=AI&tema=Psihologija")).toEqual({
      search: "AI",
      topic: "Psihologija",
      detailId: "",
    });
    expect(homepageQuery("")).toEqual({ search: "", topic: "", detailId: "" });
  });
  it("removes a closed detail from the URL while retaining existing filters", () => {
    expect(
      withoutDetailQuery("/clanci", "citaj=abc&q=AI&tema=Psihologija")
    ).toBe("/clanci?q=AI&tema=Psihologija");
    expect(withoutDetailQuery("/", "citaj=abc")).toBe("/");
  });
});
