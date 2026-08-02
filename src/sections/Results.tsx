import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useSectionContent } from '../hooks/useSectionContent';
import SplitHeadline from '../components/motion/SplitHeadline';
import TiltCard from '../components/motion/TiltCard';
import CountUp from '../components/motion/CountUp';
import resultsVisual from '../assets/sections/results-visual.jpg';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Outcome = { text: string; icon: string; color: string };
type ResultsContent = { eyebrow: string; headline: string; image?: string | null; outcomes: Outcome[]; closer: string };

const METRICS = [
  { value: 2.4, suffix: 'x', label: 'Repeat purchase rate', decimals: 1 },
  { value: 38, suffix: '%', label: 'Lift in customer LTV', decimals: 0 },
  { value: 41, suffix: '%', label: 'Reduction in churn', decimals: 0 },
];

/** Layout rhythm: full-bleed editorial band with an off-axis headline. */
export default function Results() {
  const c = useSectionContent<ResultsContent>('/', 'results', 'results');
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.res-fade', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      });
      gsap.fromTo('.res-band', { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0 }, {
        clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.5, ease: 'expo.out',
        scrollTrigger: { trigger: '.res-band', start: 'top 88%' },
      });
      gsap.fromTo('.res-band-img', { yPercent: -12, scale: 1.2 }, {
        yPercent: 10, scale: 1.05, ease: 'none',
        scrollTrigger: { trigger: '.res-band', start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
      gsap.fromTo('.res-card', { opacity: 0, y: 70, rotateX: -12 }, {
        opacity: 1, y: 0, rotateX: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out',
        scrollTrigger: { trigger: '.results-grid', start: 'top 85%' },
      });
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.res-fade, .res-card, .res-band', { opacity: 1, y: 0, rotateX: 0, clipPath: 'none' });
    });
    return () => mm.revert();
  }, { scope: sectionRef });

  const outcomes = c.outcomes || [];

  return (
    <section ref={sectionRef} id="results" className="relative overflow-hidden bg-[#0a0f1a] py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-20">
        {/* Off-axis headline: label left, headline pushed right */}
        <div className="mb-14 grid grid-cols-1 gap-8 lg:mb-20 lg:grid-cols-[240px,1fr] lg:items-end">
          <span className="res-fade inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.32em] text-[#00D4FF]" style={{ opacity: 0 }}>
            <span className="h-px w-8 bg-[#00D4FF]/50" />
            {c.eyebrow}
          </span>
          <SplitHeadline
            text="We Help Brands Grow Sustainably"
            highlightFrom={3}
            className="text-4xl font-bold leading-[0.92] tracking-tighter text-white lg:text-[5.5rem]"
          />
        </div>

        {/* Editorial band: image + live metric strip */}
        <div className="res-band relative mb-16 overflow-hidden rounded-[2.5rem] border border-white/10 lg:mb-24" style={{ opacity: 0 }}>
          <div className="relative h-[320px] overflow-hidden lg:h-[460px]">
            <img src={resultsVisual} alt="Retention cohort analysis wall" loading="lazy" className="res-band-img absolute inset-0 h-full w-full object-cover will-change-transform" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/45 to-transparent" />
          </div>
          <div className="relative -mt-24 grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-3">
            {METRICS.map((m) => (
              <div key={m.label} className="bg-[#0b1220]/90 px-8 py-10 backdrop-blur">
                <div className="mb-3 text-5xl font-black tracking-tighter text-white lg:text-6xl">
                  <CountUp to={m.value} suffix={m.suffix} decimals={m.decimals} className="text-gradient-cyan" />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/40">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Asymmetric bento of outcomes with pointer-reactive depth */}
        <div className="results-grid grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6 lg:gap-8">
          {outcomes.map((item, i) => {
            const span = i === 0 ? 'lg:col-span-4' : i === 1 ? 'lg:col-span-2' : i === 2 ? 'lg:col-span-2' : 'lg:col-span-2';
            return (
              <TiltCard key={i} className={`res-card ${span}`} style={{ opacity: 0 }} max={6} lift={16}>
                <div className="group relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 transition-colors duration-700 hover:border-[#00D4FF]/40 lg:p-10">
                  <div className="pointer-events-none absolute right-6 top-6 text-6xl opacity-[0.07] transition-opacity duration-700 group-hover:opacity-20">
                    {item.icon}
                  </div>
                  <div className="relative z-10 flex h-full flex-col justify-between gap-10">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00D4FF]/10 text-2xl transition-transform duration-500 group-hover:scale-110">
                      {item.icon}
                    </div>
                    <p className="text-xl font-bold leading-snug text-white transition-colors duration-500 group-hover:text-[#00D4FF] lg:text-2xl">
                      {item.text}
                    </p>
                  </div>
                  <div className="pointer-events-none absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-[#00D4FF]/20 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
                </div>
              </TiltCard>
            );
          })}
        </div>

        <div className="res-fade mt-16 flex items-center gap-6 lg:mt-24" style={{ opacity: 0 }}>
          <div className="h-px flex-1 bg-white/10" />
          <p className="text-2xl font-bold tracking-tight text-white/90 lg:text-3xl">
            <span className="text-gradient-cyan">{c.closer}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
