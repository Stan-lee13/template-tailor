import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useSectionContent } from '../hooks/useSectionContent';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Service = { number: string; title: string; items: string; accent: string };
type ServicesContent = { eyebrow: string; headline: string; intro: string; services: Service[] };

/**
 * Services — cinematic circular scroll.
 * On desktop the section pins and cards orbit an invisible ring: as you scroll,
 * the active card rotates into center from the right while the previous card
 * rotates out to the left along the same arc.
 * On mobile: static stacked cards with staggered reveal (no scroll trap).
 */
export default function Services() {
  const c = useSectionContent<ServicesContent>('/', 'services', 'services');
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const services = c.services || [];

  useGSAP(() => {
    if (!stageRef.current || services.length === 0) return;
    const mm = gsap.matchMedia();

    // Desktop: arc scroll driven by the section's own progress (no pinning —
    // pinning inside the flex card stack broke layout for every card below it)
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const cards = gsap.utils.toArray<HTMLElement>('.svc-card');
      const spread = 46; // degrees between cards — wide enough that neighbours never overlap
      // Fit the arc to the stage so the incoming card is never clipped
      const radius = () => {
        const stageW = stageRef.current?.clientWidth ?? 800;
        const cardW = cards[0]?.offsetWidth ?? 440;
        const half = Math.sin((spread / 2) * (Math.PI / 180));
        return Math.max(240, Math.min(620, (stageW - cardW) / 2 / half));
      };


      // Steep S-curve so each card holds centre-stage, then swaps quickly.
      const smooth = (f: number) => {
        const a = f * f * (3 - 2 * f);
        return a * a * (3 - 2 * a);
      };

      const apply = (progress: number) => {
        const raw = gsap.utils.clamp(0, 1, progress) * (cards.length - 1);
        const base = Math.min(Math.floor(raw), cards.length - 2 < 0 ? 0 : cards.length - 2);
        const active = cards.length > 1 ? base + smooth(raw - base) : 0;
        setActiveIdx(Math.round(active));
        cards.forEach((el, i) => {
          const angle = (i - active) * spread;
          const rad = (angle * Math.PI) / 180;
          const R = radius();
          const x = Math.sin(rad) * R;
          const y = (1 - Math.cos(rad)) * R * 0.3;
          const dist = Math.abs(i - active);
          // Hard falloff so no two cards' text can ever be legible at once
          const opacity = Math.max(0, 1 - dist * 1.15);
          const scale = 0.82 + Math.max(0, Math.cos(rad)) * 0.18;
          gsap.set(el, {
            x, y, rotate: angle * 0.3, opacity, scale,
            filter: dist > 0.2 ? `blur(${Math.min(5, dist * 5)}px)` : 'blur(0px)',
            pointerEvents: dist < 0.5 ? 'auto' : 'none',
            zIndex: Math.round(100 - dist * 10),
          });
        });
      };

      apply(0);

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 65%',
        end: 'bottom 90%',
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      });

      // Ambient rotating gradient
      gsap.to('.svc-ambient', { rotate: 360, duration: 40, repeat: -1, ease: 'none' });

      return () => { st.kill(); };
    });


    // Mobile / reduced-motion: simple staggered fade
    mm.add('(max-width: 1023px), (prefers-reduced-motion: reduce)', () => {
      gsap.fromTo('.svc-card-mobile', { opacity: 0, y: 40, scale: 0.95 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [services.length] });

  return (
    <section ref={sectionRef} id="services" className="ledger-grain relative overflow-hidden rounded-[22px] border border-border bg-[hsl(var(--ink-raised))] min-h-screen lg:rounded-[28px]" style={{ boxShadow: 'var(--shadow-card)' }}>
      {/* Immersive background effects */}
      <div className="svc-ambient hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-[conic-gradient(from_0deg,#C9A22705,#A8871F05,#C9A22705)] blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1A2A] via-transparent to-[#0B1A2A] pointer-events-none" />

      {/* DESKTOP: pinned circular stage */}
      <div className="hidden lg:block relative py-20 px-12 lg:px-24">
        <div className="max-w-[1400px] mx-auto grid grid-cols-[38%,1fr] gap-16 items-center min-h-[80vh]">
          <div className="relative z-10 min-w-0">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/20 text-[#C9A227] text-xs font-bold uppercase tracking-widest mb-8">
              {c.eyebrow}
            </span>
            <h2 className="text-4xl xl:text-5xl font-black text-white mb-8 tracking-tight leading-[1.05] text-balance">
              Everything You Need to <span className="text-gradient-cyan">Turn Customers Into Revenue</span>
            </h2>
            <p className="text-lg text-white/40 mb-12 leading-relaxed max-w-md">
              Strategic growth through customer loyalty, retention, and lifecycle marketing.
            </p>
            
            <div className="flex items-center gap-3 mb-12">
              {services.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${i === activeIdx ? 'w-12 bg-[#C9A227]' : 'w-3 bg-white/10'}`} />
              ))}
            </div>
            
            <div className="flex items-center gap-4 text-white/20 font-black text-xs uppercase tracking-[0.3em]">
              <div className="w-10 h-px bg-white/10" />
              Scroll to Navigate
              <div className="w-10 h-px bg-white/10" />
            </div>
          </div>

          <div ref={stageRef} className="relative h-[74vh] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {services.map((s, i) => (
                <article key={i} className="svc-card absolute w-[380px] xl:w-[440px] will-change-transform" aria-current={i === activeIdx}>
	                  <div className={`p-10 xl:p-12 rounded-[2.5rem] border transition-all duration-700 ${i === activeIdx ? 'bg-gradient-to-br from-white/10 to-[#080c14] border-white/20 shadow-[0_40px_100px_rgba(0,0,0,0.8)]' : 'bg-white/5 border-white/5'}`}>

                    <span className="text-sm font-black text-[#C9A227] uppercase tracking-widest mb-4 block">
                      {s.number}
                    </span>
                    <h3 className="text-2xl xl:text-3xl font-black text-white mb-6 tracking-tight">
                      {s.title}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {(s.items || '').split(',').map((item) => item.trim()).filter(Boolean).map((item) => (
                        <span key={item} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs font-bold tracking-wider">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE: stacked */}
      <div className="lg:hidden relative py-24 px-6">
        <div className="max-w-[600px] mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/20 text-[#C9A227] text-xs font-bold uppercase tracking-widest mb-6">
            {c.eyebrow}
          </span>
		          <h2 className="text-4xl font-black text-white mb-6 tracking-tighter">
		            Everything You Need to <span className="text-gradient-cyan">Turn Customers Into Revenue</span>
		          </h2>
	          <p className="text-lg text-white/40 mb-12 leading-relaxed">
	            Strategic growth through customer loyalty, retention, and lifecycle marketing.
	          </p>

          <div className="space-y-6">
            {services.map((s, i) => (
              <div key={i} className="svc-card-mobile p-8 rounded-[2rem] bg-white/5 border border-white/10" style={{ opacity: 0 }}>
                <span className="text-xs font-black text-[#C9A227] uppercase tracking-widest mb-4 block">
                  {s.number}
                </span>
                <h3 className="text-2xl font-black text-white mb-6 tracking-tight">
                  {s.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(s.items || '').split(',').map((item) => item.trim()).filter(Boolean).map((item) => (
                    <span key={item} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold tracking-wider">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
