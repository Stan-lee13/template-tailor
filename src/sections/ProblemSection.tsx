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
    <section ref={sectionRef} id="problem" className="relative overflow-hidden bg-gradient-to-br from-white via-[#f4f7fb] to-[#dfe8f3] py-24 lg:py-32 px-6 lg:px-20">
      {/* Dynamic background glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00D4FF]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1300px] mx-auto">
        <div className="problem-headline text-center mb-16 lg:mb-24" style={{ opacity: 0 }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#008bb0]/25 text-[#087a9d] text-xs font-bold uppercase tracking-widest mb-6">
            {c.eyebrow}
          </span>
          <h2 className="text-4xl lg:text-7xl font-bold text-[#0a0f1a] mb-6 tracking-tighter">
            Why Retention<span className="text-[#00A8D6]">Firm</span> Exists
          </h2>
          <p className="text-lg lg:text-xl text-[#23384d]/70 max-w-2xl mx-auto leading-relaxed">
            Every brand spends thousands acquiring new customers. Very few invest in keeping them.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="problem-visual relative group lg:mt-12 lg:min-h-[780px]" style={{ opacity: 0 }}>
            <div className="absolute -inset-4 bg-gradient-to-r from-[#00D4FF]/25 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative rounded-3xl overflow-hidden border border-[#0a0f1a]/10 bg-white/60 shadow-[0_24px_70px_rgba(25,48,72,0.14)] backdrop-blur-sm">
              <img src={problemVisual} srcSet={problemVisualSrcSet} sizes="(min-width: 1024px) 42vw, 100vw" alt="A retention journey showing a first purchase, post-purchase message, loyalty follow-up, and returning order" className="w-full h-[520px] sm:h-[640px] lg:h-[780px] object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000" />
            </div>
          </div>

          <div className="problem-grid grid gap-6">
            <div className="problem-cycle-lead flex items-center gap-3 mb-1" style={{ opacity: 0 }}>
              <span className="h-px w-10 shrink-0 bg-[#00D4FF]" aria-hidden="true" />
              <p className="max-w-md text-base lg:text-xl font-semibold tracking-tight text-[#0a0f1a]/85">Most businesses are stuck on an expensive cycle:</p>
            </div>
            {[
              "Run ads",
              "Get few customers",
              "Make sales",
              "The end. Repeat."
            ].map((text, i) => (
              <ThreeDCard key={i} className="w-full">
                <ThreeDCardItem translateZ={20} className="problem-item group flex items-center gap-6 p-6 lg:p-8 rounded-2xl bg-white/75 border border-[#0a0f1a]/10 shadow-[0_16px_40px_rgba(25,48,72,0.08)] hover:border-[#00A8D6]/45 transition-colors duration-500" style={{ opacity: 0 }}>
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600 group-hover:bg-red-500 group-hover:text-white transition-all duration-500">
                    <span className="text-xl font-bold">{i + 1}</span>
                  </div>
                  <p className="text-lg lg:text-xl text-[#1d2f43]/90 group-hover:text-[#0a0f1a] transition-colors">
                    {text}
                  </p>
                </ThreeDCardItem>
              </ThreeDCard>
            ))}
            
            <div className="mt-8">
              <p className="text-[#087a9d] font-bold text-lg lg:text-xl tracking-tight">
                RetentionFirm exists to help brands build businesses customers return to naturally. Not through guesswork. Through proven retention systems designed around how people actually buy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
