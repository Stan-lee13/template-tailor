import { useState } from "react";
import SEO from "../components/SEO";
import "./RetentionHome.css";
import {
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Circle,
  Menu,
  ArrowUpRight,
  Play,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

const leakData = {
  second: {
    label: "Second purchase gap",
    eyebrow: "Leak 01",
    title: "The moment after the first order is where loyalty is won.",
    body: "We map the post-purchase window, product education, replenishment rhythm, and offer logic that move a customer toward purchase two.",
    metric: "Repeat purchase velocity",
    action: "Build the return moment",
  },
  lifecycle: {
    label: "Lifecycle blind spot",
    eyebrow: "Leak 02",
    title: "Your customers are sending signals your campaigns are not reading.",
    body: "We connect behavior, product context, and timing into a lifecycle system that speaks to customers when the next action is most likely.",
    metric: "Revenue per customer",
    action: "Connect the signals",
  },
  churn: {
    label: "Churn pressure",
    eyebrow: "Leak 03",
    title: "Churn is rarely a surprise. It is usually a sequence.",
    body: "We identify the moments that predict disengagement, then design intervention loops that create a reason to stay, return, and recommend.",
    metric: "Retention rate",
    action: "Interrupt the sequence",
  },
};

type LeakKey = keyof typeof leakData;

function ReturnLoop({ active }: { active: LeakKey }) {
  const activeIndex = Object.keys(leakData).indexOf(active);
  return (
    <div className="return-loop" aria-label="Interactive customer return loop diagram" role="img">
      <div className="loop-glow" />
      <svg viewBox="0 0 520 520" className="loop-svg" aria-hidden="true">
        <defs>
          <linearGradient id="loopGradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#e5b52e" />
            <stop offset="55%" stopColor="#79c69a" />
            <stop offset="100%" stopColor="#4d7dff" />
          </linearGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <circle cx="260" cy="260" r="194" className="loop-track" />
        <circle cx="260" cy="260" r="140" className="loop-track loop-track-inner" />
        <path d="M 260 66 A 194 194 0 1 1 128 118" className="loop-path" />
        <path d="M 128 118 A 194 194 0 0 1 105 342" className="loop-path loop-path-muted" />
        <path d="M 105 342 A 194 194 0 0 1 380 396" className="loop-path loop-path-soft" />
        <path d="M 380 396 A 194 194 0 0 1 260 66" className="loop-path" />
        <circle cx="260" cy="66" r="9" className={`loop-node ${activeIndex === 0 ? "is-active" : ""}`} />
        <circle cx="128" cy="118" r="9" className={`loop-node ${activeIndex === 1 ? "is-active" : ""}`} />
        <circle cx="105" cy="342" r="9" className={`loop-node ${activeIndex === 2 ? "is-active" : ""}`} />
        <circle cx="380" cy="396" r="9" className="loop-node is-success" />
        <circle cx="260" cy="260" r="4" className="loop-core" filter="url(#softGlow)" />
      </svg>
      <div className="loop-center">
        <span className="tiny-label">THE RETENTION ENGINE</span>
        <strong>Customer<br />return loop</strong>
        <span className="loop-center-line" />
        <span className="loop-center-caption">Signal → intervention → repeat</span>
      </div>
      <div className="loop-tag loop-tag-top"><Circle size={8} fill="currentColor" /> First order</div>
      <div className="loop-tag loop-tag-left"><Circle size={8} fill="currentColor" /> Lifecycle signal</div>
      <div className="loop-tag loop-tag-bottom"><Circle size={8} fill="currentColor" /> Second purchase</div>
      <div className="loop-tag loop-tag-right"><Circle size={8} fill="currentColor" /> Loyalty</div>
    </div>
  );
}

function SectionLabel({ index, children }: { index: string; children: string }) {
  return <div className="section-label"><span>{index}</span><i />{children}</div>;
}

function Index() {
  const [activeLeak, setActiveLeak] = useState<LeakKey>("second");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [motionOn, setMotionOn] = useState(true);
  const leak = leakData[activeLeak];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: motionOn ? "smooth" : "auto" });
    setMobileOpen(false);
  };

  return (
    <div className={`site-shell ${motionOn ? "motion-on" : "motion-off"}`}>
      <SEO
        title="Find the leak. Engineer the return."
        description="Retention systems for repeat-purchase brands that want more second purchases, higher customer lifetime value, and less dependence on paid acquisition."
        path="/"
      />
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-nav">
        <div className="nav-inner">
          <button className="brand-lockup" onClick={() => scrollTo("top")} aria-label="RetentionFirm home">
            <span className="brand-mark"><span /><span /><span /></span>
            <span className="brand-name">Retention<span>Firm</span><sup>®</sup></span>
          </button>
          <nav className={mobileOpen ? "nav-links is-open" : "nav-links"} aria-label="Primary navigation">
            <button onClick={() => scrollTo("engine")}>The engine</button>
            <button onClick={() => scrollTo("proof")}>Proof</button>
            <button onClick={() => scrollTo("fit")}>Who we help</button>
            <button onClick={() => scrollTo("faq")}>FAQ</button>
            <button onClick={() => scrollTo("contact")} className="nav-cta">Get the leak review <ArrowUpRight size={14} /></button>
          </nav>
          <div className="nav-actions">
            <button className="motion-toggle" onClick={() => setMotionOn(!motionOn)} aria-pressed={motionOn} title="Toggle motion">
              <span className={motionOn ? "toggle-dot is-on" : "toggle-dot"} /> Motion {motionOn ? "on" : "off"}
            </button>
            <button className="menu-button" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        <section className="hero-section" id="top">
          <div className="hero-noise" />
          <div className="hero-orb orb-one" />
          <div className="hero-orb orb-two" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow-pill"><span className="status-dot" /> Retention systems for repeat-purchase brands</div>
              <h1>Find the leak.<br /><em>Engineer the return.</em></h1>
              <p className="hero-lead">RetentionFirm turns first orders into repeat revenue with lifecycle systems built around how your customers actually buy.</p>
              <div className="hero-actions">
                <button className="button button-primary" onClick={() => scrollTo("contact")}>Get the retention leak review <ArrowRight size={17} /></button>
                <button className="button button-quiet" onClick={() => scrollTo("engine")}><span className="play-icon"><Play size={11} fill="currentColor" /></span> See the return engine</button>
              </div>
              <div className="hero-microcopy"><ShieldCheck size={15} /> Operator-led. Data-aware. Built for compounding growth.</div>
            </div>
            <div className="hero-visual-wrap">
              <ReturnLoop active={activeLeak} />
              <div className="hero-visual-caption"><span>LIVE SYSTEM MAP</span><span>v.01 / RETURN ENGINE</span></div>
            </div>
          </div>
          <div className="hero-bottom container"><span>Scroll to explore</span><span className="scroll-line" /><span>01 / 08</span></div>
        </section>

        <section className="proof-rail" aria-label="RetentionFirm proof points">
          <div className="container proof-rail-inner">
            <span className="proof-kicker">Trusted infrastructure</span>
            <span className="proof-item">Shopify <i>×</i> Klaviyo</span>
            <span className="proof-item">Attentive <i>×</i> Postscript</span>
            <span className="proof-item">RFM segmentation</span>
            <span className="proof-item">Customer lifetime value</span>
            <span className="proof-kicker proof-kicker-right">Built for the second purchase <ArrowDownRight size={15} /></span>
          </div>
        </section>

        <section className="section leak-section" id="leak">
          <div className="container">
            <div className="section-intro split-intro">
              <div><SectionLabel index="01" children="THE LEAK" /></div>
              <div><h2>Most brands know how to win the first order.<br /><span>Fewer know what makes it happen again.</span></h2><p>Retention is not a campaign problem. It is a sequence problem. We find the point where your customer journey loses momentum, then build the system that earns the next action.</p></div>
            </div>
            <div className="leak-statement-grid">
              <div className="leak-statement"><span className="giant-number">01</span><strong>Acquire attention.</strong><span>Turn it into a first order.</span></div>
              <div className="leak-arrow"><ArrowRight /></div>
              <div className="leak-statement"><span className="giant-number accent">02</span><strong>Earn the return.</strong><span>Turn a buyer into a customer.</span></div>
              <div className="leak-statement leak-statement-active"><span className="giant-number green">03</span><strong>Compound value.</strong><span>Turn retention into a growth advantage.</span></div>
            </div>
          </div>
        </section>

        <section className="section diagnostic-section" id="diagnostic">
          <div className="container diagnostic-grid">
            <div className="diagnostic-copy"><SectionLabel index="02" children="DIAGNOSTIC ACCESS" /><h2>Where is your customer journey leaking?</h2><p>Select the signal that feels most familiar. We will show you the system response we would investigate first.</p>
              <div className="diagnostic-tabs" role="tablist" aria-label="Retention leak symptoms">
                {(Object.keys(leakData) as LeakKey[]).map((key) => <button key={key} onClick={() => setActiveLeak(key)} className={activeLeak === key ? "diagnostic-tab is-active" : "diagnostic-tab"} role="tab" aria-selected={activeLeak === key}><span>{leakData[key].eyebrow}</span>{leakData[key].label}<ArrowRight size={15} /></button>)}
              </div>
            </div>
            <div className="diagnostic-result" key={activeLeak}><div className="result-top"><span className="tiny-label">{leak.eyebrow}</span><span className="signal-status"><span className="status-dot" /> Signal identified</span></div><h3>{leak.title}</h3><p>{leak.body}</p><div className="result-bottom"><div><span className="tiny-label">METRIC TO MOVE</span><strong>{leak.metric}</strong></div><div><span className="tiny-label">SYSTEM RESPONSE</span><strong>{leak.action}</strong></div></div><button className="text-link" onClick={() => scrollTo("contact")}>Get your own leak map <ArrowRight size={16} /></button></div>
          </div>
        </section>

        <section className="section engine-section" id="engine">
          <div className="container">
            <div className="section-head-row"><div><SectionLabel index="03" children="THE ENGINE" /><h2>Three moves.<br /><span>One compounding system.</span></h2></div><p className="section-aside">Loyalty is not one campaign. It is the operating rhythm between signal, relevance, and the next reason to return.</p></div>
            <div className="engine-cards">
              <article className="engine-card engine-card-dark"><span className="card-index">01 / DIAGNOSE</span><div className="engine-card-icon"><BarChart3 size={22} /></div><h3>Find where revenue slips.</h3><p>Audit your cohorts, customer journey, lifecycle data, and offer architecture to see what the dashboard is not saying.</p><div className="card-footer"><span>Leak analysis</span><ArrowUpRight size={17} /></div></article>
              <article className="engine-card engine-card-gold"><span className="card-index">02 / BUILD</span><div className="engine-card-icon"><Zap size={22} /></div><h3>Engineer the return moment.</h3><p>Build the flows, segments, messages, and integrations that make the next purchase feel timely rather than forced.</p><div className="card-footer"><span>Lifecycle architecture</span><ArrowUpRight size={17} /></div></article>
              <article className="engine-card engine-card-blue"><span className="card-index">03 / COMPOUND</span><div className="engine-card-icon"><Sparkles size={22} /></div><h3>Scale what keeps working.</h3><p>Test, learn, and refine the retention engine around the metrics that compound: repeat purchase, LTV, and churn.</p><div className="card-footer"><span>Optimization rhythm</span><ArrowUpRight size={17} /></div></article>
            </div>
          </div>
        </section>

        <section className="section proof-section" id="proof">
          <div className="container">
            <div className="section-head-row"><div><SectionLabel index="04" children="PROOF IN CONTEXT" /><h2>Evidence over<br /><span>empty counters.</span></h2></div><p className="section-aside">Real work is measured against a baseline, a deployment, a time window, and the outcome that actually matters.</p></div>
            <div className="case-card"><div className="case-card-top"><span className="case-label">CASE PROTOCOL 001</span><span className="case-verified"><ShieldCheck size={14} /> Anonymized with permission</span></div><div className="case-card-main"><div className="case-title"><span>DTC apparel</span><h3>From a stalled second purchase to a retention contribution worth building around.</h3><button className="text-link">Read the protocol <ArrowRight size={16} /></button></div><div className="case-data"><div className="case-data-block"><span>BASELINE</span><strong>&lt;18%</strong><p>Second-purchase rate</p></div><div className="case-data-block"><span>DEPLOYMENT</span><strong>12 flows</strong><p>RFM + lifecycle architecture</p></div><div className="case-data-block case-data-highlight"><span>WITHIN 90 DAYS</span><strong>30%</strong><p>Retention contribution</p></div></div></div><div className="case-card-footer"><span>Growth-stage brand scaling ~$180K/mo</span><span>Impact depends on baseline, product, and execution context.</span></div></div>
            <div className="proof-stat-row"><div><strong>30–60</strong><span>days to early signal</span></div><div><strong>90</strong><span>days to read LTV impact</span></div><div><strong>1</strong><span>operator-led system</span></div><div><strong>0</strong><span>empty promises</span></div></div>
          </div>
        </section>

        <section className="section fit-section" id="fit">
          <div className="container fit-grid"><div><SectionLabel index="05" children="WHO WE HELP" /><h2>Retention works best when customers have <span>a reason to come back.</span></h2><p>We are built for growth-stage brands where the next purchase is not a nice-to-have. It is the difference between expensive growth and compounding growth.</p><button className="button button-primary" onClick={() => scrollTo("contact")}>Check your fit <ArrowRight size={17} /></button></div><div className="fit-list">{["Repeat-purchase ecommerce", "Subscription and replenishment", "Beauty, wellness, and personal care", "Fashion and consumer brands", "Food, beverage, and high-frequency retail"].map((item, i) => <div className="fit-row" key={item}><span>0{i + 1}</span><strong>{item}</strong><ArrowUpRight size={18} /></div>)}</div></div>
        </section>

        <section className="section services-section" id="services">
          <div className="container"><div className="section-head-row"><div><SectionLabel index="06" children="SYSTEM MODULES" /><h2>Everything needed to<br /><span>earn the next order.</span></h2></div><p className="section-aside">Not random marketing. A connected retention infrastructure built around your product, your people, and your customer signals.</p></div><div className="services-grid">{["Retention infrastructure", "Lifecycle systems", "Revenue optimization", "Personalization", "Loyalty loops"].map((service, i) => <div className="service-tile" key={service}><span className="service-index">0{i + 1}</span><h3>{service}</h3><p>{["Email + SMS systems, CRM, analytics", "Welcome, post-purchase, win-back", "AOV boosters, upsells, subscriptions", "Behavior targeting and dynamic messaging", "Referrals, loyalty, and repeat loops"][i]}</p><ArrowUpRight size={18} /></div>)}</div></div>
        </section>

        <section className="section faq-section" id="faq"><div className="container faq-grid"><div><SectionLabel index="07" children="QUESTIONS" /><h2>Make the next<br /><span>decision easier.</span></h2><p>Good retention work starts with a clear baseline and a shared definition of success.</p></div><div className="faq-list">{["How quickly can we see a signal?", "What does the first engagement include?", "Which platforms do you work with?", "How do you measure success?", "Can you work alongside our existing team?"].map((question, i) => <div className={openFaq === i ? "faq-item is-open" : "faq-item"} key={question}><button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}><span>{question}</span><ChevronDown size={18} /></button>{openFaq === i && <p>{["Most clients see early movement in repeat-purchase behavior and engagement within 30–60 days. Full LTV impact typically becomes clearer around 90 days.", "We start with a focused growth audit: revenue leak analysis, customer journey mapping, competitor context, and a 30-day action plan.", "Shopify, WooCommerce, Klaviyo, Attentive, Postscript, Recharge, and custom stacks where the data is accessible.", "We care about repeat-purchase rate, LTV, churn, cohort retention, and revenue from retention channels—not vanity metrics alone.", "Yes. We work as a focused retention extension of marketing, product, and data teams."][i]}</p>}</div>)}</div></div></section>

        <section className="contact-section" id="contact"><div className="container contact-card"><div className="contact-orbit" /><div className="contact-copy"><SectionLabel index="08" children="START HERE" /><h2>Find the leak.<br /><span>Build the return.</span></h2><p>Bring us the signal that worries you. Leave with a sharper view of where retention revenue is slipping and what to do next.</p></div><div className="contact-action"><div className="contact-action-top"><span className="tiny-label">THE RETENTION LEAK REVIEW</span><span className="contact-duration">30 MIN / OPERATOR-LED</span></div><div className="contact-deliverables"><span><Check size={15} /> 3 likely leakage points</span><span><Check size={15} /> 30-day priority map</span><span><Check size={15} /> No-pressure conversation</span></div><a className="button button-primary" href="mailto:hello@retentionfirm.com?subject=Retention%20Leak%20Review">Request your leak review <ArrowRight size={17} /></a><small>hello@retentionfirm.com</small></div></div></section>
      </main>

      <footer className="site-footer"><div className="container footer-grid"><div><button className="brand-lockup footer-brand" onClick={() => scrollTo("top")}><span className="brand-mark"><span /><span /><span /></span><span className="brand-name">Retention<span>Firm</span><sup>®</sup></span></button><p>The retention engine for brands customers choose again.</p></div><div className="footer-links"><div><span className="tiny-label">EXPLORE</span><button onClick={() => scrollTo("engine")}>The engine</button><button onClick={() => scrollTo("proof")}>Proof</button><button onClick={() => scrollTo("faq")}>FAQ</button></div><div><span className="tiny-label">CONNECT</span><a href="mailto:hello@retentionfirm.com">Email us</a><a href="#contact">Book an audit</a><a href="#top">Back to top</a></div></div></div><div className="container footer-bottom"><span>© 2026 RetentionFirm. All rights reserved.</span><span>Built for the second purchase.</span></div></footer>
    </div>
  );
}

export default Index;
