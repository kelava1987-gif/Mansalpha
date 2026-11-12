import {
  Download,
  ShieldCheck,
  LockKeyhole,
  BookOpen,
  Image,
} from "lucide-react";
import type { Workspace } from "@shared/mansalpha";
import { exportWorkspace } from "@/lib/content";
export default function Settings({ workspace }: { workspace: Workspace }) {
  return (
    <div className="settings-grid">
      <section className="white-panel">
        <span className="setting-icon">
          <LockKeyhole size={24} />
        </span>
        <h2>Vaš radni prostor</h2>
        <p>
          Uređivanje i trajno spremanje vezani su uz vaš Manus račun. Svaki
          prijavljeni korisnik ima zaseban radni prostor; neprijavljeni
          posjetitelji vide samo početne edukativne materijale.
        </p>
        <h3>Sigurnosna kopija</h3>
        <p>
          Izvezite tekstove, predloške i plan predavanja u čitljiv JSON zapis.
          Povezani dokumenti preuzimaju se zasebno iz knjižnice.
        </p>
        <button
          className="button primary"
          onClick={() => exportWorkspace(workspace)}
        >
          <Download size={16} />
          Izvezi radni prostor
        </button>
      </section>
      <section className="white-panel">
        <span className="setting-icon">
          <ShieldCheck size={24} />
        </span>
        <h2>Urednička načela</h2>
        <h3>Čovjek prije etikete</h3>
        <p>
          Poštujemo privatnost i ne uključujemo osjetljive privatne narative.
          Osobni podaci unose se samo uz odgovarajuće ovlaštenje.
        </p>
        <h3>Dokazi prije zaključka</h3>
        <p>
          Ne izmišljamo autore, datume ni izvore. Autorske teze, hipoteze i
          materijale koji trebaju provjeru označavamo jasno. Status „spremno”
          znači spremnost materijala u knjižnici, ne znanstvenu validaciju.
        </p>
        <h3>Edukacija, ne dijagnoza</h3>
        <p>
          Sadržaji nisu medicinski savjet ni zamjena za psihologa, psihijatra
          ili liječnika. U neposrednoj opasnosti obratite se hitnoj službi ili
          nazovite 112.
        </p>
      </section>
      <section className="white-panel">
        <span className="setting-icon">
          <BookOpen size={24} />
        </span>
        <h2>O knjižnici MansAlpha</h2>
        <p>
          Knjižnica čuva dostavljene PDF-ove i dostupne edukativne tekstove
          prethodnog projekta pod novim identitetom. Izvorni materijali ostaju
          odvojeni od novih nacrta i uredničkih predložaka.
        </p>
        <p>
          Materijali koji nisu bili dostupni za prijenos označeni su u
          pripadajućem zapisu. Specijalizirani forenzički materijali koji mogu
          sadržavati operativne upute ne objavljuju se automatski.
        </p>
      </section>
      <section className="white-panel">
        <span className="setting-icon">
          <Image size={24} />
        </span>
        <h2>Fotografije i video</h2>
        <p>
          Naslovni fotografski vizuali stvoreni su umjetnom inteligencijom i
          imaju ilustrativnu ulogu i ne prikazuju kliničke slučajeve.
          Fotografija autora zasebno je dostavljena i odobrena za njegov profil;
          njezini osobni metapodaci uklonjeni su. Naslovnice dokumenata potječu
          iz dostavljenih materijala.
        </p>
        <p>
          Videozapisi se prikazuju samo kad postoji dostupan, provjeren medijski
          zapis. Vanjske videopoveznice mogu imati vlastite uvjete korištenja i
          privatnosti.
        </p>
      </section>
    </div>
  );
}
