import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ArrowUpRight, Download, ExternalLink, Film } from "lucide-react";
import { videoEmbed } from "@/lib/content";
import type { ReactNode } from "react";
import type { Status } from "@shared/mansalpha";
export function Modal({
  title,
  description,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <Dialog
      open
      onOpenChange={open => {
        if (!open) onClose();
      }}
    >
      <DialogContent className={`ma-modal ${wide ? "ma-modal-wide" : ""}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description || "MansAlpha · urednički radni prostor"}
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
export function Badge({ status }: { status: Status }) {
  return (
    <span className={`status status-${status.replace(" ", "-")}`}>
      <i />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
export function TextLink({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button className="text-link" onClick={onClick}>
      {children}
      <ArrowUpRight size={15} />
    </button>
  );
}
export function MediaPlayer({ url, title }: { url: string; title: string }) {
  const video = videoEmbed(url);
  if (!video.url)
    return (
      <div className="empty-inline">
        <Film size={24} />
        <p>Videozapis još nije povezan. Dodajte provjereni video URL.</p>
      </div>
    );
  return video.type === "file" ? (
    <video
      className="media-player"
      controls
      preload="metadata"
      src={video.url}
      aria-label={title}
    />
  ) : video.type === "embed" ? (
    <iframe
      className="media-player"
      src={video.url}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      loading="lazy"
    />
  ) : (
    <a
      className="button secondary"
      href={video.url}
      target="_blank"
      rel="noreferrer"
    >
      Otvori videozapis
      <ExternalLink size={16} />
    </a>
  );
}
export function AssetLink({
  url,
  title,
  label = "Preuzmi materijal",
}: {
  url: string;
  title: string;
  label?: string;
}) {
  return (
    <a
      className="button secondary"
      href={url}
      target="_blank"
      rel="noreferrer"
      download={title}
    >
      <Download size={16} />
      {label}
    </a>
  );
}
