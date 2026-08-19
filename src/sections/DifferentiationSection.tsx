import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionContent } from '../hooks/useSectionContent';
import diffVisual from '../assets/differentiation-editorial.webp';

gsap.registerPlugin(ScrollTrigger);

type Item = { text: string };
type DiffContent = {
  eyebrow: string; headline: string; body: string; image?: string | null;
  dont_focus: Item[]; do_focus: Item[]; closer: string;
};

export default function DifferentiationSection() {
  const c = useSectionContent<DiffContent>('/', 'differentiation', 'differentiation');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.diff-content', { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      gsap.fromTo('.diff-media', { opacity: 0, scale: 0.96, rotate: -1.5 }, {
        opacity: 1, scale: 1, rotate: 0, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      });
      gsap.fromTo('.diff-card', { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.diff-compare', start: 'top 75%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="differentiation" className="relative overflow-hidden bg-[#F3EBDD] px-6 py-20 lg:px-20 lg:py-28">
      <div className="max-w-[1300px] mx-auto">
        <div className="diff-layout">
          <div className="diff-content" style={{ opacity: 0 }}>
            <span className="rf-object-eyebrow">{c.eyebrow}</span>
            <h2 className="diff-title">Why Brands <span>Choose RetentionFirm</span></h2>
            <p className="diff-description">
              Not because we send emails. Because we think beyond them. We see customer retention as a business strategy—not a marketing channel.
            </p>

            <div className="diff-compare">
              <div className="diff-card diff-card--quiet" style={{ opacity: 0 }}>
                <div className="diff-card__head"><span>We Don&apos;t Focus On</span><span aria-hidden="true">×</span></div>
                <div className="diff-card__list">
                  {(c.dont_focus || []).map((item, i) => (
                    <div key={i}><span className="diff-card__mark">×</span><span>{item.text}</span></div>
                  ))}
                </div>
              </div>

              <div className="diff-card diff-card--focus" style={{ opacity: 0 }}>
                <div className="diff-card__head"><span>We Focus On</span><span aria-hidden="true">↗</span></div>
                <div className="diff-card__list">
                  {(c.do_focus || []).map((item, i) => (
                    <div key={i}><span className="diff-card__mark">✓</span><span>{item.text}</span></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="diff-closer"><span aria-hidden="true">↘</span><p>Creating customers who stay. Not just customers who click.</p></div>
          </div>

          <div className="diff-media" style={{ opacity: 0 }}>
            <div className="diff-media__frame">
              <div className="diff-media__top"><span>Precision Marketing</span><span>02 / 03</span></div>
              <img src={diffVisual} alt="Editorial contrast between reactive campaign materials and an organized retention system" className="w-full aspect-[4/5] object-cover" />
              <div className="diff-media__bottom"><span>Strategy over channel</span><span aria-hidden="true">↗</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
