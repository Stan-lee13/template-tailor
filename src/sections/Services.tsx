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

    // Desktop: circular orbit scroll
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const cards = gsap.utils.toArray<HTMLElement>('.svc-card');
      const setters = cards.map((el) => ({
        x: gsap.quickSetter(el, 'x', 'px'),
        y: gsap.quickSetter(el, 'y', 'px'),
        r: gsap.quickSetter(el, 'rotate', 'deg'),
        o: gsap.quickSetter(el, 'opacity'),
        s: gsap.quickSetter(el, 'scale'),
        z: gsap.quickSetter(el, 'zIndex'),
      }));
      const radius = () => Math.min(window.innerWidth * 0.42, 620);
      const spread = 26; // degrees between cards

      const apply = (progress: number) => {
        const active = progress * (cards.length - 1);
        setActiveIdx(Math.round(active));
        cards.forEach((_, i) => {
          const angle = (i - active) * spread;
          const rad = (angle * Math.PI) / 180;
          const R = radius();
          const x = Math.sin(rad) * R;
          const y = (1 - Math.cos(rad)) * R * 0.28;
          const opacity = Math.max(0, Math.cos(rad) * 0.9 + 0.1);
          const scale = 0.75 + Math.cos(rad) * 0.25;
          const s = setters[i];
          s.x(x); s.y(y); s.r(angle * 0.6); s.o(opacity); s.s(scale);
          s.z(Math.round(100 - Math.abs(angle)));
        });
      };
      apply(0);

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${cards.length * 90}%`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        onUpdate: (self) => apply(self.progress),
      });

      // Ambient rotating gradient
      gsap.to('.svc-ambient', { rotate: 360, duration: 60, repeat: -1, ease: 'none' });

      return () => { st.kill(); };
    });

    // Mobile / reduced-motion: simple staggered fade
    mm.add('(max-width: 1023px), (prefers-reduced-motion: reduce)', () => {
      gsap.fromTo('.svc-card-mobile', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [services.length] });

  return (
    <section ref={sectionRef} id="services" className="relative overflow-hidden" style={{ background: '#f1ece4' }}>
      {/* Ambient rotating gradient (desktop only) */}
      <div className="svc-ambient hidden lg:block absolute" style={{ top: '50%', left: '50%', width: '140vw', height: '140vw', marginLeft: '-70vw', marginTop: '-70vw', background: 'conic-gradient(from 0deg, rgba(249,115,22,0.05), rgba(44,145,225,0.06), rgba(16,185,129,0.05), rgba(249,115,22,0.05))', filter: 'blur(60px)', pointerEvents: 'none' }} />

      {/* DESKTOP: pinned circular stage */}
      <div className="hidden lg:block relative" style={{ minHeight: '100vh', padding: '10vh 5vw' }}>
        <div className="max-w-[1400px] mx-auto grid grid-cols-[38%,1fr] gap-10 items-center min-h-[80vh]">
          <div>
            <span className="block font-inter font-medium uppercase mb-4" style={{ fontSize: '12px', color: '#555', letterSpacing: '0.04em' }}>{c.eyebrow}</span>
            <h2 className="font-outfit font-medium mb-5" style={{ fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 0.95, color: '#0A0A0A', letterSpacing: '-0.02em' }}>{c.headline}</h2>
            <p className="font-inter mb-6" style={{ fontSize: '17px', lineHeight: 1.65, color: '#2D2D2D', maxWidth: '400px' }}>{c.intro}</p>
            <div className="h-[3px] w-16 rounded-full mb-8" style={{ background: 'linear-gradient(90deg, #F97316, #2C91E1)' }} />
            <div className="flex items-center gap-2">
              {services.map((_, i) => (
                <div key={i} className="h-1 rounded-full transition-all duration-300" style={{ width: i === activeIdx ? 32 : 8, background: i === activeIdx ? '#F97316' : 'rgba(10,10,10,0.15)' }} />
              ))}
            </div>
            <p className="font-inter text-xs uppercase tracking-wider mt-6" style={{ color: '#888' }}>Scroll to navigate</p>
          </div>

          <div ref={stageRef} className="relative" style={{ height: '70vh' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              {services.map((s, i) => (
                <article key={i} className="svc-card absolute" style={{ width: 'min(440px, 32vw)', willChange: 'transform, opacity' }} aria-current={i === activeIdx}>
                  <div className="p-8 rounded-3xl" style={{ background: '#FFFFFF', border: `1px solid ${s.accent}30`, boxShadow: `0 30px 80px ${s.accent}20, 0 0 0 1px rgba(0,0,0,0.02)` }}>
                    <span className="font-outfit font-medium" style={{ fontSize: '13px', color: s.accent }}>{s.number}</span>
                    <h3 className="font-outfit font-medium mt-3 mb-5" style={{ fontSize: '26px', color: '#0A0A0A', letterSpacing: '-0.01em', lineHeight: 1.15 }}>{s.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {(s.items || '').split(',').map((item) => item.trim()).filter(Boolean).map((item) => (
                        <span key={item} className="font-inter px-3 py-1.5 rounded-full" style={{ fontSize: '13px', background: s.accent + '10', color: '#2D2D2D', border: `1px solid ${s.accent}20` }}>{item}</span>
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
      <div className="lg:hidden relative" style={{ padding: '10vh 20px 12vh' }}>
        <div className="max-w-[720px] mx-auto">
          <span className="block font-inter font-medium uppercase mb-4" style={{ fontSize: '12px', color: '#555', letterSpacing: '0.04em' }}>{c.eyebrow}</span>
          <h2 className="font-outfit font-medium mb-4" style={{ fontSize: 'clamp(28px, 6vw, 40px)', lineHeight: 0.98, color: '#0A0A0A', letterSpacing: '-0.02em' }}>{c.headline}</h2>
          <p className="font-inter mb-8" style={{ fontSize: '15px', lineHeight: 1.65, color: '#2D2D2D' }}>{c.intro}</p>

          <div className="flex flex-col gap-3">
            {services.map((s, i) => (
              <div key={i} className="svc-card-mobile p-5 rounded-2xl" style={{ opacity: 0, background: '#FFFFFF', border: '1px solid #D6D3CC' }}>
                <div className="flex items-start gap-4">
                  <span className="font-outfit font-medium flex-shrink-0" style={{ fontSize: '13px', color: s.accent, opacity: 0.85 }}>{s.number}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-outfit font-medium mb-3" style={{ fontSize: '18px', color: '#0A0A0A', letterSpacing: '-0.01em' }}>{s.title}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {(s.items || '').split(',').map((item) => item.trim()).filter(Boolean).map((item) => (
                        <span key={item} className="font-inter px-2.5 py-1 rounded-full" style={{ fontSize: '12px', background: s.accent + '10', color: '#2D2D2D', border: `1px solid ${s.accent}20` }}>{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
