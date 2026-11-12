import { Download, Pencil, ShieldCheck } from "lucide-react";
import { Streamdown } from "streamdown";
import type { ContentRecord } from "@shared/mansalpha";
import { KIND_LABELS } from "@shared/mansalpha";
import { exportRecord } from "@/lib/content";
import { Modal, Badge, MediaPlayer, AssetLink } from "./MansalphaUI";
export default function ContentDetail({
  record,
  onClose,
  onEdit,
}: {
  record: ContentRecord;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <Modal
      title={record.title}
      description={`${KIND_LABELS[record.kind]} · ${record.format || "Edukativni sadržaj"}`}
      onClose={onClose}
      wide
    >
      <div className="detail-meta">
        <Badge status={record.status} />
        {record.topics.map(t => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>
      <p className="detail-summary">{record.summary}</p>
      {record.sourceNote && (
        <div className="source-note source-note-top">
          <ShieldCheck size={18} />
          <p>{record.sourceNote}</p>
        </div>
      )}
      {record.videoUrl && (
        <MediaPlayer url={record.videoUrl} title={record.title} />
      )}
      <div className="detail-actions">
        <button
          className="button secondary"
          onClick={() => exportRecord(record, "md")}
        >
          <Download size={16} />
          Markdown
        </button>
        <button
          className="button secondary"
          onClick={() => exportRecord(record, "txt")}
        >
          <Download size={16} />
          TXT
        </button>
        {record.assetUrl && (
          <AssetLink
            url={record.assetUrl}
            title={record.title}
            label={`Otvori ${record.format || "materijal"}`}
          />
        )}
        <button className="button secondary" onClick={onEdit}>
          <Pencil size={15} />
          Uredi
        </button>
      </div>
      <div className="article-text">
        {record.content ? (
          <Streamdown>{record.content}</Streamdown>
        ) : (
          <p>
            Tekst još nije dodan. Dostupni povezani materijal možete otvoriti
            iznad.
          </p>
        )}
      </div>
      <p className="medical-note">
        Edukativni i autorski materijal. Nije dijagnoza ni individualni
        zdravstveni savjet i ne zamjenjuje kvalificiranog stručnjaka.
      </p>
    </Modal>
  );
}
