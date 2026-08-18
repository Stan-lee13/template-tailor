import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionContent } from '../hooks/useSectionContent';
import { ThreeDCard, ThreeDCardItem } from '../components/ui/three-d-card';
const problemVisual = '/images/problem-retention-journey-1440.webp';
const problemVisualSrcSet = '/images/problem-retention-journey-640.webp 640w, /images/problem-retention-journey-1024.webp 1024w, /images/problem-retention-journey-1440.webp 1440w';

gsap.registerPlugin(ScrollTrigger);

type ProblemContent = {
  eyebrow: string; headline_1: string; headline_2: string; intro: string;
  pain_points: { text: string }[]; closer: string;
};

export default function ProblemSection() {
  const c = useSectionContent<ProblemContent>('/', 'problem', 'problem');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.problem-headline', { opacity: 0, y: 60 }, {
        opacity: 1, y: 0, duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });
      gsap.fromTo('.problem-visual', { opacity: 0, scale: 0.9, y: 40 }, {
        opacity: 1, scale: 1, y: 0, duration: 1.4, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
      });
      gsap.fromTo('.problem-cycle-lead', { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.problem-grid', start: 'top 70%' },
      });
      gsap.fromTo('.problem-item', { opacity: 0, x: -30 }, {
        opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.problem-grid', start: 'top 70%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [c.pain_points?.length]);

  return (
    <section ref={sectionRef} id="problem" className="relative overflow-hidden bg-white pt-12 pb-20 lg:pt-16 lg:pb-28 px-6 lg:px-20">
      {/* Dynamic background glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#C56A4A]/8 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1300px] mx-auto">
        <div className="problem-frame rounded-[2rem] bg-[#050505] p-4 sm:p-6 lg:p-10 shadow-[0_28px_90px_rgba(0,0,0,0.24)]" style={{ opacity: 1 }}>
          <div className="problem-headline text-center mb-12 lg:mb-16" style={{ opacity: 0 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#C56A4A]/12 border border-[#C56A4A]/30 text-[#D9896C] text-[10px] font-semibold uppercase tracking-[0.2em] mb-5">
              {c.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-semibold leading-[1.05] text-white mb-4 tracking-[-0.04em]">
              Why RetentionFirm Exists
            </h2>
            <p className="text-base lg:text-lg font-normal text-white/65 max-w-xl mx-auto leading-[1.65]">
              Every brand spends thousands acquiring new customers. Very few invest in keeping them.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="problem-visual relative group lg:mt-12 lg:min-h-[780px]" style={{ opacity: 0 }}>
            <div className="absolute -inset-4 bg-gradient-to-r from-[#C56A4A]/25 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-sm">
              <img src={problemVisual} srcSet={problemVisualSrcSet} sizes="(min-width: 1024px) 42vw, 100vw" alt="A retention journey showing a first purchase, post-purchase message, loyalty follow-up, and returning order" className="w-full h-[520px] sm:h-[640px] lg:h-[780px] object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000" />
            </div>
          </div>

          <div className="problem-grid grid gap-6">
            <div className="problem-cycle-lead flex items-center gap-3 mb-1" style={{ opacity: 0 }}>
              <span className="h-px w-10 shrink-0 bg-[#C56A4A]" aria-hidden="true" />
              <p className="max-w-md text-sm lg:text-lg font-medium leading-relaxed tracking-tight text-white/85">Most businesses are stuck on an expensive cycle:</p>
            </div>
            {[
              "Run ads",
              "Get few customers",
              "Make sales",
              "The end. Repeat."
            ].map((text, i) => (
              <ThreeDCard key={i} className="w-full">
                <ThreeDCardItem translateZ={20} className="problem-item group flex min-h-[112px] sm:min-h-[120px] lg:min-h-[112px] items-center gap-5 p-6 sm:p-7 lg:p-6 rounded-[1.25rem] bg-white border border-white/80 shadow-[0_14px_32px_rgba(0,0,0,0.16)] hover:border-[#C56A4A]/55 transition-colors duration-500" style={{ opacity: 0 }}>
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#D8A63D]/20 flex items-center justify-center text-[#9A6B08] group-hover:bg-[#D8A63D] group-hover:text-[#050505] transition-all duration-500">
                    <span className="text-lg font-semibold">{i + 1}</span>
                  </div>
                  <p className="text-base lg:text-lg font-medium leading-relaxed text-[#1d2f43]/90 group-hover:text-[#0a0f1a] transition-colors">
                    {text}
                  </p>
                </ThreeDCardItem>
              </ThreeDCard>
            ))}
            
            <div className="mt-8">
              <p className="max-w-xl text-[#D9896C] font-semibold text-base lg:text-lg leading-[1.65] tracking-tight">
                RetentionFirm exists to help brands build businesses customers return to naturally. Not through guesswork. Through proven retention systems designed around how people actually buy.
              </p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
