import Motion from "@/components/Motion";
import Header, { WHATSAPP } from "@/components/Header";
import { AtelierHero, RepairLab, LivingArchive } from "@/components/Atelier";
import Photo from "@/components/Photo";
import ScrollStory, { EditorialMotion } from "@/components/ScrollStory";

const COUNTRIES = ["Sri Lanka", "Pakistan", "India", "Egypt", "Jordan", "Kenya"];

export default function Home() {
  return (
    <>
      <Motion />
      <EditorialMotion />
      <Header />
      <main id="main">
        <AtelierHero />

        <section className="manifesto" id="about">
          <p className="eyebrow" data-rise>Our point of view</p>
          <p className="manifesto-copy">{"A garment with a flaw is still a garment worth saving. We make failed pieces invisible to inspection—and visible to the world again.".split(" ").map((word, index) => <span className="manifesto-word" key={index}>{word}{" "}</span>)}</p>
          <div className="manifesto-note" data-rise><span>Repair over reject.</span><span>Value over waste.</span><span>Craft at industrial scale.</span></div>
        </section>

        <section className="editorial-story">
          <div className="editorial-image editorial-image--tall" data-rise>
            <Photo id="1741176505800-caaa3a52631a" alt="Garment makers working inside a factory" w={1800} parallax />
            <span className="image-index">01 / Factory floor</span>
          </div>
          <div className="editorial-copy" data-rise>
            <p className="eyebrow">The problem</p>
            <h2>Made with care.<br /><em>Rejected by a millimetre.</em></h2>
            <p>A loose seam, a pinhole, a shade variation—small defects can erase the value of an otherwise finished piece. Compreli puts that value back.</p>
            <a className="arrow-link" href="#process">See how repair works <span>↘</span></a>
          </div>
          <div className="editorial-image editorial-image--small" data-rise>
            <Photo id="1698766902696-e3c98378d400" alt="Needle and red thread in close detail" w={1200} parallax />
            <span className="image-index">02 / The intervention</span>
          </div>
        </section>

        <ScrollStory />
        <RepairLab />
        <LivingArchive />

        <section className="audiences" aria-label="Who we work with">
          <article>
            <Photo id="1636986056375-184676d8ca14" alt="Textile manufacturing machinery" w={1800} parallax />
            <div className="audience-copy"><p className="eyebrow">For manufacturers</p><h2>Recover the pieces.<br /><em>Recover the value.</em></h2><p>Return rejected garments to export quality, close production shortfalls and cut disposal cost.</p></div>
          </article>
          <article>
            <Photo id="1490481651871-ab68de25d43d" alt="Finished clothes arranged on hangers" w={1800} parallax />
            <div className="audience-copy"><p className="eyebrow">For brands</p><h2>Waste less.<br /><em>Stand for more.</em></h2><p>Keep pre-consumer waste from landfill and turn sustainability commitments into measurable action.</p></div>
          </article>
        </section>

        <section className="reach" id="reach">
          <div className="reach-title"><p className="eyebrow">Scale with a human touch</p><h2>One craft.<br /><em>Six countries.</em></h2></div>
          <p className="reach-copy" data-rise>What began with one Sri Lankan manufacturer now serves more than 300 factories across Asia and Africa—including six of the world’s ten largest apparel manufacturers.</p>
          <dl className="numbers" data-gallery><div><dt>60+</dt><dd>defect types</dd></div><div><dt>300+</dt><dd>manufacturers</dd></div><div><dt>6</dt><dd>countries</dd></div><div><dt>2018</dt><dd>founded in Sri Lanka</dd></div></dl>
          <ul className="country-ticker" aria-label="Countries served">{COUNTRIES.map((country) => <li key={country}>{country}</li>)}</ul>
        </section>

        <section className="impact" id="impact">
          <Photo id="1606053929013-311c13f97b5f" alt="Textile remnants being sorted" w={2400} parallax sizes="100vw" />
          <div className="impact-copy"><p className="eyebrow">The reason</p><h2>Waste isn’t waste<br /><em>until we waste it.</em></h2><div className="impact-facts"><p><strong>47%</strong><span>of fibre entering fashion supply chains becomes waste</span></p><p><strong>$1M</strong><span>potential annual saving by repairing only 3% of defects</span></p></div></div>
        </section>

        <section className="people" id="people">
          <p className="eyebrow">The people behind the practice</p>
          <div className="people-grid"><article data-rise><span>01</span><h3>Shehan<br />Olegasegeram</h3><p>25 years across apparel manufacturing, quality control and process improvement.</p></article><article data-rise><span>02</span><h3>Ramesh<br />De Silva</h3><p>30+ years from New York buying rooms to product development and manufacturing.</p></article></div>
        </section>

        <section className="contact" id="contact"><p className="eyebrow">Start a conversation</p><h2>Bring us your<br /><em>rejects.</em></h2><p>Tell us what is failing inspection. We’ll tell you what can be saved.</p><a className="silver-pill" href={WHATSAPP} target="_blank" rel="noreferrer">Message us on WhatsApp <span>↗</span></a></section>
      </main>
      <footer className="footer"><a href="#top" className="footer-word">Compreli</a><div className="footer-line"><span>Repairing fashion’s future.</span><span>Colombo · Sri Lanka</span><span>© 2026 Compreli Consulting</span></div></footer>
    </>
  );
}
