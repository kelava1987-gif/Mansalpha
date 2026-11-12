import React from "react";
import { ShieldCheck } from "lucide-react";
import { HOMEPAGE_VIDEOS } from "@shared/homepage";
import HomepageVideo from "../homepage/HomepageVideo";

export default function CuratedVideoShelf() {
  return (
    <section className="mp-curated-videos" aria-labelledby="mp-curated-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">MANSALPHA / VIDEO ODABIR</span>
          <h2 id="mp-curated-title">Perspektive koje vrijedi poslušati.</h2>
          <p>
            Filozofija, psihologija i pitanja svijesti — u istom prostoru
            znanja.
          </p>
        </div>
      </div>
      <div className="mh-video-grid">
        {HOMEPAGE_VIDEOS.map((video, index) => (
          <HomepageVideo key={video.id} video={video} index={index} />
        ))}
      </div>
      <p className="mh-video-privacy">
        <ShieldCheck size={14} />
        YouTube se učitava tek na vaš odabir. Autorske teorije nisu potvrda
        njihovih znanstvenih tvrdnji.
      </p>
      <div className="section-heading">
        <div>
          <h2>Videozapisi iz vaše knjižnice</h2>
          <p>Postojeći zapisi i povezani izvori ostaju sačuvani.</p>
        </div>
      </div>
    </section>
  );
}
