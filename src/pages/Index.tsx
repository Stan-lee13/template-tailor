import { useEffect, useState } from "react";
import SEO from "../components/SEO";
import "./RetentionHome.css";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Clock3,
  Menu,
  Minus,
  Plus,
  ScanLine,
  Sparkles,
  X,
} from "lucide-react";

type ChapterKey = "question" | "interval" | "index" | "gallery" | "proof";

const intervalData = [
  {
    label: "01 / AFTER THE ORDER",
    title: "The quiet week",
    body: "The package arrives. The excitement is real. But the brand goes silent while the customer decides what the product means in their life.",
    note: "Signal: education gap",
    image: "/images/interval-quiet-week-1600.webp",
    srcSet: "/images/interval-quiet-week-640.webp 640w, /images/interval-quiet-week-1024.webp 1024w, /images/interval-quiet-week-1600.webp 1600w",
    alt: "Open first-order delivery parcel beside a quiet customer interval map",
  },
  {
    label: "02 / THE DECISION MOMENT",
    title: "The useful nudge",
    body: "A timely answer, a replenishment cue, or a reason to use the product again turns a one-time transaction into a lived routine.",
    note: "Intervention: relevance",
    image: "/images/interval-decision-moment-1600.webp",
    srcSet: "/images/interval-decision-moment-640.webp 640w, /images/interval-decision-moment-1024.webp 1024w, /images/interval-decision-moment-1600.webp 1600w",
    alt: "Customer decision moment shown through a product, signal points, and a timely intervention path",
  },
  {
    label: "03 / THE RETURN",
    title: "The habit forms",
    body: "The second purchase is not a lucky conversion. It is the visible result of small, well-timed signals working together.",
    note: "Outcome: repeat behavior",
    image: "/images/interval-return-1600.webp",
    srcSet: "/images/interval-return-640.webp 640w, /images/interval-return-1024.webp 1024w, /images/interval-return-1600.webp 1600w",
    alt: "Return path connecting a first order to a second order and replenishment cue",
  },
];

const questions = [
  ["What do you actually fix?", "The space between a first purchase and the next one: the signals, messages, offers, product education, and operating habits that make return behavior more likely."],
  ["What does the first conversation produce?", "A sharper view of the interval. We leave you with three likely leakage points, a 30-day priority map, and a shared definition of the signal worth moving."],
  ["Which brands are the right fit?", "Growth-stage consumer brands with a reason to come back: fashion, beauty, wellness, food, beverage, subscriptions, and replenishment products."],
];

function ReturnArtifact({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`return-artifact ${compact ? "is-compact" : ""}`} aria-label="The Return Index spatial artifact">
      <div className="artifact-grid" />
      <div className="artifact-paper paper-back"><span>RETURN</span><b>01</b></div>
      <div className="artifact-paper paper-front"><span>THE RETURN INDEX</span><strong>first order<br /><i>→</i> return</strong><em>signal / interval / action</em></div>
      <div className="artifact-loop" />
      <div className="artifact-bead" />
      <div className="artifact-caption"><ScanLine size={12} /> live behavior map</div>
      <div className="artifact-constellation" aria-hidden="true"><span className="constellation-node node-order"><i />first order</span><span className="constellation-node node-signal"><i />signal</span><span className="constellation-node node-action"><i />action</span><span className="constellation-node node-return"><i />return</span><div className="constellation-path path-one" /><div className="constellation-path path-two" /><div className="constellation-path path-three" /></div>
    </div>
  );
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [motionOn, setMotionOn] = useState(true);
  const [introVisible, setIntroVisible] = useState(true);
  const [activeInterval, setActiveInterval] = useState(1);
  const [openQuestion, setOpenQuestion] = useState(0);
  const [activeChapter, setActiveChapter] = useState<ChapterKey>("question");

  useEffect(() => {
    const storedMotion = window.localStorage.getItem("retentionfirm-motion");
    setMotionOn(storedMotion ? storedMotion === "on" : !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setIntroVisible(true);
    document.documentElement.dataset.motion = storedMotion === "off" ? "off" : "on";
  }, []);

  useEffect(() => {
    window.localStorage.setItem("retentionfirm-motion", motionOn ? "on" : "off");
    document.documentElement.dataset.motion = motionOn ? "on" : "off";
  }, [motionOn]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIntroVisible(false);
    }, motionOn ? 4500 : 120);
    return () => window.clearTimeout(timer);
  }, [motionOn]);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!motionOn || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [motionOn]);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-field-card]"));
    const onPointerMove = (event: PointerEvent) => {
      const card = event.currentTarget as HTMLElement;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty("--field-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
      card.style.setProperty("--field-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
    };
    cards.forEach((card) => card.addEventListener("pointermove", onPointerMove));
    return () => cards.forEach((card) => card.removeEventListener("pointermove", onPointerMove));
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) setActiveChapter(entry.target.getAttribute("data-chapter") as ChapterKey);
    }), { threshold: 0.45 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: motionOn ? "smooth" : "auto" });
    setMenuOpen(false);
  };

  return (
    <div className={`return-index-site ${motionOn ? "motion-on" : "motion-off"}`}>
      {introVisible && (
        <div className="intro-screen" role="status" aria-label="Loading RetentionFirm">
          <div className="intro-mark"><span>R</span><i /></div>
          <div className="intro-meta"><span>RETENTIONFIRM</span><span>RETURN INDEX / 01</span></div>
          <p>Before the next order,<br />there is a moment worth designing.</p>
          <button onClick={() => setIntroVisible(false)}>Skip intro <ArrowRight size={14} /></button>
        </div>
      )}

      <header className="return-nav return-nav-hero">
        <button className="wordmark" onClick={() => scrollTo("top")} aria-label="RetentionFirm home"><span className="wordmark-symbol">R</span><span>RetentionFirm<sup>®</sup></span></button>
        <div className="nav-index"><span>INDEX</span><strong>0{Object.keys({ question: 1, interval: 2, index: 3, gallery: 4, proof: 5 }).indexOf(activeChapter) + 1}</strong><span>/ 09</span></div>
        <div className="nav-actions">
          <button className="nav-motion" onClick={() => setMotionOn((value) => !value)} aria-pressed={motionOn}><i className={motionOn ? "is-live" : ""} /> {motionOn ? "Live" : "Calm"}</button>
          <button className="menu-trigger" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </header>

      {menuOpen && (
        <div className="index-drawer">
          <div className="drawer-meta"><span>RETENTIONFIRM / RETURN INDEX</span><span>Navigate the interval</span></div>
          <div className="drawer-list">
            {[['01', 'The question', 'question'], ['02', 'The customer interval', 'interval'], ['03', 'The Return Index', 'index'], ['04', 'Signal Room', 'signal-room'], ['05', 'Proof in context', 'proof'], ['05', 'The people behind it', 'people'], ['06', 'Start here', 'contact']].map(([number, label, id]) => (
              <button key={id} onClick={() => scrollTo(id)}><span>{number}</span><strong>{label}</strong><ArrowUpRight size={18} /></button>
            ))}
          </div>
          <div className="drawer-image"><img src="/images/return-index-detail.jpg" alt="Layered paper Return Index artifact" /></div>
        </div>
      )}

      <main id="top">
        <section className="ri-hero" data-reveal="hero" data-chapter="question">
          <div className="hero-rail"><span>RETURN INDEX / 01</span><span>SCROLL TO ENTER</span></div>
          <div className="hero-copy" data-reveal="copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> Customer behavior studio</p>
            <h1><span className="type-ledger">The second purchase is where the business <em>tells the truth.</em></span></h1>
            <p className="hero-deck">RetentionFirm finds the interval between a first order and a customer’s return—then makes that interval work harder.</p><div className="hero-signal-line"><span><i /> LIVE SIGNAL</span><strong>+38.4%</strong><small>return behavior under observation</small></div>
            <div className="hero-actions"><button className="ink-button" onClick={() => scrollTo("contact")}>Receive your Return Index <ArrowUpRight size={17} /></button><button className="text-button" onClick={() => scrollTo("interval")}><span className="mini-play"><ArrowDownRight size={14} /></span> Walk the interval</button></div>
            <div className="hero-proof"><span>Built for brands customers choose again.</span><span>Fashion · beauty · food · subscriptions</span></div>
          </div>
          <div className="hero-image-frame hero-office-frame" data-reveal="visual"><img src="/images/hero-office-analytics-1920.webp" srcSet="/images/hero-office-analytics-640.webp 640w, /images/hero-office-analytics-1024.webp 1024w, /images/hero-office-analytics-1600.webp 1600w, /images/hero-office-analytics-1920.webp 1920w" sizes="100vw" alt="Dark office with an open laptop showing upward-moving sales analytics" fetchPriority="high" loading="eager" decoding="async" /><div className="hero-office-overlay" aria-hidden="true" /><div className="image-stamp">FIELD NOTE<br /><strong>01 / 08</strong></div><div className="image-caption">The quiet system behind the next order.</div><div className="office-caption"><span>RETENTIONFIRM / LIVE VIEW</span><strong>SALES SIGNALS MOVING UP</strong></div></div>
          <div className="return-beam" aria-hidden="true"><span /><i /><b /></div>
          <div className="hero-scroll"><span>SCROLL TO ENTER</span><i /></div>
        </section>

        <div className="hero-to-question" data-reveal="transition" aria-hidden="true"><div className="transition-index"><span>01</span><i /> <strong>THE RETURN STARTS HERE</strong></div><div className="transition-signal"><span /><span /><span /></div></div>

        <section className="paper-chapter question-chapter" data-reveal="section" data-chapter="question" id="question">
          <div className="chapter-topline question-topline"><span>01 / THE QUESTION</span><span>THE FIRST ORDER IS ONLY THE BEGINNING</span></div>
          <div className="split-statement question-intro"><div className="question-title-block"><p className="chapter-kicker">The part no dashboard shows you</p><h2>Where does the <em>return</em> go quiet?</h2></div><div className="statement-note question-note"><p>Most brands know how to win attention. Fewer know what makes a customer choose the same product again.</p><ArrowDownRight size={23} /></div></div>
          <div className="question-grid"><figure className="editorial-image"><img src="/images/retention-question-signal-1600.webp" srcSet="/images/retention-question-signal-640.webp 640w, /images/retention-question-signal-1024.webp 1024w, /images/retention-question-signal-1600.webp 1600w" sizes="(max-width: 720px) 100vw, 55vw" alt="Retention signal map showing the path from a first order to a second order" loading="lazy" decoding="async" /><figcaption><span>FIG. 01</span> The path from first order to return, made visible.</figcaption></figure><div className="question-copy"><p>Retention is not a campaign problem. It is a sequence problem. The work lives in the quiet days after delivery: when the customer is deciding whether the product belongs in their life.</p><div className="principle-list"><div><span>01</span><strong>Acquire attention.</strong><small>Turn it into a first order.</small></div><div><span>02</span><strong>Earn the return.</strong><small>Turn a buyer into a customer.</small></div><div><span>03</span><strong>Compound value.</strong><small>Turn retention into an advantage.</small></div></div></div></div>
        </section>

        <section className="signal-marquee" aria-label="Retention system sequence"><div className="marquee-track"><span>FIRST ORDER</span><i>→</i><span>SIGNAL</span><i>→</i><span>INTERVENTION</span><i>→</i><span>RETURN</span><i>→</i><span>FIRST ORDER</span><i>→</i><span>SIGNAL</span><i>→</i><span>INTERVENTION</span><i>→</i><span>RETURN</span><i>→</i><span>FIRST ORDER</span><i>→</i><span>SIGNAL</span><i>→</i><span>INTERVENTION</span><i>→</i><span>RETURN</span><i>→</i><span>FIRST ORDER</span><i>→</i><span>SIGNAL</span><i>→</i><span>INTERVENTION</span><i>→</i><span>RETURN</span><i>→</i></div></section>

        <section className="interval-chapter" id="interval" data-reveal="section" data-chapter="interval">
          <div className="chapter-topline light"><span>02 / THE CUSTOMER INTERVAL</span><span>THE SPACE BETWEEN TWO ORDERS</span></div>
          <div className="interval-intro"><p className="chapter-kicker">A sequence, not a funnel</p><h2>The week after the order is where loyalty is <em>won.</em></h2></div>
          <div className="interval-layout"><div className="interval-tabs" role="tablist" aria-label="Customer interval moments">{intervalData.map((item, index) => <button key={item.label} className={activeInterval === index ? "is-active" : ""} onClick={() => setActiveInterval(index)} role="tab" aria-selected={activeInterval === index}><span>{item.label}</span><strong>{item.title}</strong><ArrowRight size={15} /></button>)}</div><div className="interval-card" key={activeInterval}><div className="interval-card-image"><img src={intervalData[activeInterval].image} srcSet={intervalData[activeInterval].srcSet} sizes="(max-width: 720px) 100vw, 45vw" alt={intervalData[activeInterval].alt} loading="lazy" decoding="async" /><span>{intervalData[activeInterval].note}</span></div><div className="interval-card-copy"><span className="live-label"><i /> moment {String(activeInterval + 1).padStart(2, "0")}</span><h3>{intervalData[activeInterval].title}</h3><p>{intervalData[activeInterval].body}</p><div className="interval-arrow"><ArrowDownRight size={25} /><span>Move the signal forward</span></div></div></div></div>
        </section>

        <section className="index-chapter" id="index" data-reveal="section" data-chapter="index">
          <div className="chapter-topline"><span>03 / THE RETURN INDEX</span><span>AN OPERATING OBJECT FOR THE NEXT ORDER</span></div>
          <div className="index-heading"><div><p className="chapter-kicker">Not a dashboard. A point of view.</p><h2>Make the invisible interval <em>legible.</em></h2></div><p>We turn behavior, timing, message, offer, and product context into one working map—something your team can actually use.</p></div>
          <div className="index-stage"><ReturnArtifact /><div className="stage-note note-one"><span>01</span><strong>Signal</strong><small>What changed?</small></div><div className="stage-note note-two"><span>02</span><strong>Action</strong><small>What should happen?</small></div><div className="stage-note note-three"><span>03</span><strong>Return</strong><small>What compounds?</small></div><div className="stage-footer"><span>RETURN INDEX / LIVE OBJECT</span><span><Sparkles size={13} /> built around your customer</span></div></div>
        </section>

        <section className="signal-room-chapter" id="signal-room" data-reveal="section" data-chapter="gallery">
          <div className="chapter-topline"><span>04 / SIGNAL ROOM</span><span>VISUAL WORLDS FOR THE RETURN</span></div>
          <div className="gallery-heading"><div><p className="chapter-kicker">Browse the working library</p><h2>Every return starts with a different <em>signal.</em></h2></div><p>Explore the artifacts, moments, and systems we use to make customer behavior visible—then make it useful.</p></div>
          <div className="signal-gallery">
            <article className="gallery-card gallery-card-wide" data-field-card><div className="gallery-media"><img src="/images/return-index-proof.jpg" alt="Retention proof artifact on a dark surface" /><span className="gallery-chip">NEW / PROTOCOL</span></div><div className="gallery-card-meta"><span>01</span><strong>The proof protocol</strong><ArrowUpRight size={16} /></div><p>Baseline, deployment, time window, outcome. A case that shows its working.</p></article>
            <article className="gallery-card" data-field-card><div className="gallery-media"><img src="/images/return-index-detail.jpg" alt="Layered paper and acetate retention artifact" /><span className="gallery-chip">ARTIFACT</span></div><div className="gallery-card-meta"><span>02</span><strong>The quiet week</strong><ArrowUpRight size={16} /></div><p>The moment after delivery when relevance is still up for grabs.</p></article>
            <article className="gallery-card gallery-card-dark" data-field-card><div className="gallery-media"><img src="/images/case-novalabs.jpg" alt="Retention analytics dashboard with cohort signals" /><span className="gallery-chip">DATA / FIELD NOTE</span></div><div className="gallery-card-meta"><span>03</span><strong>The signal room</strong><ArrowUpRight size={16} /></div><p>Cohorts, churn pressure, and the pattern hiding behind the average.</p></article>
            <article className="gallery-card gallery-card-operator" data-field-card><div className="gallery-media"><img src="/images/return-index-operator.jpg" alt="Retention operator studying customer behavior artifacts" /><span className="gallery-chip">PEOPLE / METHOD</span></div><div className="gallery-card-meta"><span>04</span><strong>Look closer</strong><ArrowUpRight size={16} /></div><p>Operator attention is a system input. The work starts before the send.</p></article>
          </div>
          <button className="text-button gallery-cta" onClick={() => scrollTo("contact")}>Build a working library for us <ArrowRight size={16} /></button>
        </section>

        <section className="proof-chapter" id="proof" data-reveal="section" data-chapter="proof">
          <div className="chapter-topline light"><span>05 / PROOF IN CONTEXT</span><span>BASELINE → DEPLOYMENT → OUTCOME</span></div>
          <div className="proof-heading"><p className="chapter-kicker">A case should show its working</p><h2>Evidence you can <em>trace.</em></h2><p>Real retention work is measured against a baseline, a deployment, a time window, and the outcome that actually matters.</p></div>
          <div className="proof-layout"><figure className="proof-image"><img src="/images/case-meridian.jpg" alt="Meridian Apparel email campaign analytics dashboard" /><figcaption><span>CASE PROTOCOL 001</span> DTC apparel / anonymized with permission</figcaption></figure><div className="proof-data"><div className="data-line"><span>BASELINE</span><strong>&lt;18%</strong><small>second-purchase rate</small></div><div className="data-line is-accent"><span>DEPLOYMENT</span><strong>12 flows</strong><small>RFM + lifecycle architecture</small></div><div className="data-line"><span>WITHIN 90 DAYS</span><strong>30%</strong><small>retention contribution</small></div><p className="proof-footnote">Growth-stage apparel brand scaling ~$180K/mo. Impact depends on baseline, product, and execution context.</p><button className="light-button" onClick={() => scrollTo("contact")}>Read the full protocol <ArrowUpRight size={16} /></button></div></div><div className="protocol-grid"><div><span>01 / BASELINE</span><strong>Find the quiet.</strong><small>Where does behavior soften after the first order?</small></div><div className="protocol-grid-line" aria-hidden="true" /><div><span>02 / DEPLOYMENT</span><strong>Move the signal.</strong><small>Build the smallest useful intervention around it.</small></div><div className="protocol-grid-line" aria-hidden="true" /><div><span>03 / OUTCOME</span><strong>See the return.</strong><small>Measure what changed and what compounds next.</small></div></div>
        </section>

        <section className="people-chapter" id="people" data-reveal="section">
          <div className="chapter-topline"><span>06 / THE PEOPLE BEHIND IT</span><span>OPERATOR-LED / OBSERVATION FIRST</span></div>
          <div className="people-layout"><figure className="people-image"><img src="/images/return-index-operator.jpg" alt="Retention strategist working with printed customer behavior artifacts" /><div className="portrait-label">FIELD NOTE / 02<br /><strong>Look closer.</strong></div></figure><div className="people-copy"><p className="chapter-kicker">A human system needs human attention</p><h2>Good retention work starts with someone willing to <em>look again.</em></h2><p>We are not here to add more sends to the calendar. We sit with the behavior, find the moment that changed, and build the smallest useful intervention around it.</p><div className="people-signature">STAN / RETENTION OPERATOR <span>—</span> 01:1</div><div className="people-principles"><span>01 / Start with the customer.</span><span>02 / Make the signal visible.</span><span>03 / Leave the system better.</span></div></div></div>
        </section>

        <section className="fit-chapter" id="fit" data-reveal="section">
          <div className="chapter-topline"><span>07 / WHO THIS IS FOR</span><span>THE NEXT ORDER IS NOT A NICE-TO-HAVE</span></div>
          <div className="fit-heading"><h2>For products people have a reason to <em>return to.</em></h2><button className="ink-button" onClick={() => scrollTo("contact")}>See if we fit <ArrowUpRight size={17} /></button></div>
          <div className="fit-grid"><div className="fit-item"><span>01</span><strong>Repeat-purchase ecommerce</strong><small>Make the second order easier to imagine.</small></div><div className="fit-item"><span>02</span><strong>Subscription and replenishment</strong><small>Turn a scheduled payment into a useful habit.</small></div><div className="fit-item"><span>03</span><strong>Beauty, wellness, and care</strong><small>Build the next ritual around the product.</small></div><div className="fit-item"><span>04</span><strong>Fashion and consumer brands</strong><small>Give the customer a reason to choose again.</small></div><div className="fit-item"><span>05</span><strong>Food and high-frequency retail</strong><small>Keep the loop close, relevant, and alive.</small></div></div>
        </section>

        <section className="questions-chapter" id="questions" data-reveal="section">
          <div className="chapter-topline light"><span>08 / QUESTIONS</span><span>MAKE THE NEXT DECISION EASIER</span></div>
          <div className="questions-layout"><div><p className="chapter-kicker">Before we build anything</p><h2>Clear enough to <em>start.</em></h2></div><div className="questions-list">{questions.map(([question, answer], index) => <div className={`question-item ${openQuestion === index ? "is-open" : ""}`} key={question}><button onClick={() => setOpenQuestion(openQuestion === index ? -1 : index)} aria-expanded={openQuestion === index}><span>{question}</span>{openQuestion === index ? <Minus size={18} /> : <Plus size={18} />}</button>{openQuestion === index && <p>{answer}</p>}</div>)}</div></div>
        </section>

        <section className="contact-chapter" id="contact" data-reveal="section">
          <div className="contact-artifact"><ReturnArtifact compact /></div><div className="contact-copy"><p className="chapter-kicker">09 / START HERE</p><h2>Show us the moment they stopped <em>coming back.</em></h2><p>Bring the signal that worries you. Leave with a sharper view of where retention revenue is slipping and what to do next.</p><a className="ink-button link-button" href="mailto:hello@retentionfirm.com?subject=Return%20Index%20Review">Receive your Return Index <ArrowUpRight size={17} /></a><div className="contact-meta"><span><Clock3 size={14} /> 30 min / operator-led</span><span><BarChart3 size={14} /> 3 likely leakage points</span><span>no-pressure conversation</span></div></div>
        </section>
      </main>

      <footer className="return-footer"><button className="wordmark" onClick={() => scrollTo("top")}><span className="wordmark-symbol">R</span><span>RetentionFirm<sup>®</sup></span></button><p>The work between the first order<br />and the one that changes the business.</p><div className="footer-links"><button onClick={() => scrollTo("index")}>The Return Index</button><button onClick={() => scrollTo("proof")}>Proof</button><button onClick={() => scrollTo("questions")}>Questions</button><a href="mailto:hello@retentionfirm.com">Email us</a></div><small>© 2026 RetentionFirm. Built for the second purchase.</small></footer>
    </div>
  );
}

export default Index;
