import React, { useState } from "react";
import { Play, ShieldCheck, ExternalLink } from "lucide-react";
import type { HomepageVideo as VideoData } from "../../../../shared/homepage";
export default function HomepageVideo({
  video,
  index,
}: {
  video: VideoData;
  index: number;
}) {
  const [playing, setPlaying] = useState(false);
  const allowed =
    video.checkedContent && video.isSafe && video.embeddable !== false;
  return (
    <article className="mh-video-card">
      <div className="mh-video-frame">
        {allowed ? (
          playing ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <button
              className="mh-video-preview"
              onClick={() => setPlaying(true)}
              aria-label={`Reproduciraj: ${video.title}`}
            >
              <img
                src={
                  video.imageUrl ||
                  `https://i.ytimg.com/vi/${encodeURIComponent(video.id)}/hqdefault.jpg`
                }
                alt=""
                loading="lazy"
                width="480"
                height="360"
              />
              <span className="mh-video-shade" />
              <span className="mh-video-number">
                {String(index + 1).padStart(2, "0")} / VIDEO
              </span>
              <span className="mh-play-button">
                <Play size={25} fill="currentColor" />
              </span>
              <span className="mh-video-play-caption">
                Pogledaj unutar MansAlpha
              </span>
            </button>
          )
        ) : (
          <div className="mh-video-restricted">
            <ShieldCheck size={27} />
            <strong>Privatnost prije prikaza.</strong>
            <p>{video.note || "Sadržaj nije potvrđen za prikaz."}</p>
          </div>
        )}
      </div>
      <div className="mh-video-copy">
        <span className="mh-eyebrow">EDUKATIVNI VIDEO</span>
        <h3>{video.title}</h3>
        <p>
          {allowed
            ? video.description
            : "Dostavljena poveznica ostaje isključena dok sadržaj nije moguće sigurno provjeriti."}
        </p>
        {allowed && (
          <a
            href={video.url}
            target="_blank"
            rel="noreferrer"
            className="mh-small-link"
          >
            Ako reproduktor nije dostupan, otvori YouTube
            <ExternalLink size={13} />
          </a>
        )}
      </div>
    </article>
  );
}
