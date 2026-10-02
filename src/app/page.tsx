import Scene from "@/components/Scene";
import SmoothScroll from "@/components/SmoothScroll";

const WHATSAPP = "https://wa.me/94714363636";

const countries = ["Sri Lanka", "Pakistan", "India", "Egypt", "Jordan", "Kenya"];

export default function Home() {
  return (
    <>
      <Scene />
      <SmoothScroll />

      <header className="topbar">
        <a href="#top" className="wordmark">compreli</a>
        <nav aria-label="Main">
          <a href="#repairs">Repairs</a>
          <a href="#reach">Where we work</a>
          <a href="#team">Team</a>
          <a href="https://www.wearnrepair.com/" target="_blank" rel="noreferrer">Wear N Repair</a>
          <a href={WHATSAPP} className="nav-cta" target="_blank" rel="noreferrer">Talk to us</a>
        </nav>
      </header>

      <main id="top">
        {/* Stage 0 — torn fabric */}
        <section data-stage className="stage stage--left hero">
          <h1 className="hero-title">
            <span className="line"><span>Sustainability</span></span>
            <span className="line"><span>starts with</span></span>
            <span className="line"><span>a simple fix.</span></span>
          </h1>
          <p className="hero-sub">
            We repair defective garments so they ship at full export quality, instead of
            ending up as waste.
          </p>
          <p className="scroll-hint">Scroll to watch the tear get mended</p>
        </section>

        {/* Stage 1 — darned fabric */}
        <section data-stage id="repairs" className="stage stage--right">
          <h2>A hole isn&rsquo;t the end of a garment.</h2>
          <p className="lede">
            Our technicians fix more than 60 types of defect. The repair can&rsquo;t be seen,
            and it lasts as long as the garment does.
          </p>
          <ul className="defects">
            <li>Holes</li>
            <li>Tears</li>
            <li>Stains</li>
            <li>Shading</li>
            <li>Misaligned seams</li>
            <li className="more">and dozens more</li>
          </ul>
        </section>

        {/* Stage 2 — shirt */}
        <section data-stage className="stage stage--left">
          <h2>Rejected garments, back on the export line.</h2>
          <div className="pair">
            <div>
              <h3>For manufacturers</h3>
              <p>
                Ship rejected pieces at full value. Cut waste disposal costs and close
                production shortfalls without re-cutting.
              </p>
            </div>
            <div>
              <h3>For brands</h3>
              <p>
                Divert pre-consumer waste from landfill and meet your environmental
                commitments with a nominated repair partner.
              </p>
            </div>
          </div>
        </section>

        {/* Stage 3 — globe */}
        <section data-stage id="reach" className="stage stage--right">
          <h2>Started in one factory. Now in six countries.</h2>
          <p className="lede">
            We began in 2018 with a single manufacturer in Sri Lanka. Today we work with
            more than 300 apparel manufacturers across Asia and Africa, including six of
            the world&rsquo;s ten largest.
          </p>
          <ul className="countries">
            {countries.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>

        {/* Stage 4 — loop */}
        <section data-stage className="stage stage--left">
          <h2>Waste isn&rsquo;t waste until we waste it.</h2>
          <dl className="ledger">
            <div>
              <dt>47%</dt>
              <dd>of the fibre that enters fashion supply chains becomes waste.</dd>
            </div>
            <div>
              <dt>100 billion</dt>
              <dd>garments are consumed around the world every year.</dd>
            </div>
            <div>
              <dt>USD 1M</dt>
              <dd>saved each year by repairing just 3% of defective garments.</dd>
            </div>
          </dl>
        </section>

        {/* Stage 5 — contact */}
        <section data-stage id="team" className="stage stage--center closing">
          <h2 className="closing-title">Bring us your rejects.</h2>
          <p className="lede">
            Tell us what&rsquo;s failing inspection. We&rsquo;ll tell you what we can save.
          </p>
          <a className="cta" href={WHATSAPP} target="_blank" rel="noreferrer">
            Message us on WhatsApp
          </a>
          <p className="phone">+94 71 436 3636</p>

          <div className="team">
            <div>
              <h3>Shehan Olegasegeram</h3>
              <p>25 years in apparel manufacturing, quality control and process improvement.</p>
            </div>
            <div>
              <h3>Ramesh De Silva</h3>
              <p>30+ years in fashion, from New York buyer to product development and manufacturing.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>Compreli Consulting (Pvt) Ltd</span>
        <nav aria-label="Social">
          <a href="https://www.linkedin.com/company/compreli-consulting-private-limited/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://www.facebook.com/Compreli" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://compreli-media.blogspot.com/" target="_blank" rel="noreferrer">Media</a>
        </nav>
      </footer>
    </>
  );
}
