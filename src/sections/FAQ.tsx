import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionContent } from '../hooks/useSectionContent';

gsap.registerPlugin(ScrollTrigger);

type FaqItem = { q: string; a: string };
type FaqContent = { eyebrow: string; headline: string; faqs: FaqItem[] };

function AccordionItem({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div className={`rounded-[2rem] mb-4 transition-all duration-500 overflow-hidden ${isOpen ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/10'} border`}>
      <button onClick={onClick} className="w-full flex items-center justify-between p-8 text-left transition-all duration-300 group">
        <span className={`text-lg lg:text-xl font-bold tracking-tight pr-8 transition-colors duration-300 ${isOpen ? 'text-[#00D4FF]' : 'text-white/80 group-hover:text-white'}`}>{question}</span>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-[#00D4FF] border-[#00D4FF] rotate-45' : 'group-hover:border-white/30'}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isOpen ? 'black' : 'white'} strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </div>
      </button>
      <div className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="px-8 pb-8 text-lg text-white/50 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const c = useSectionContent<FaqContent>('/', 'faq', 'faq');
  const sectionRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.faq-head', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } });
      gsap.fromTo('.faq-item', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="faq" style={{ background: '#0a0f1a', padding: '14vh clamp(20px, 5vw, 80px) 12vh' }}>
      {/* Subtle separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.2), transparent)' }} />

      <div className="max-w-[720px] mx-auto">
        <div className="faq-head text-center mb-10 sm:mb-14" style={{ opacity: 0 }}>
          <span className="block font-inter font-medium uppercase mb-5 sm:mb-6" style={{ fontSize: '13px', color: '#00D4FF', letterSpacing: '0.15em' }}>{c.eyebrow}</span>
          <h2 className="font-outfit font-bold mb-0" style={{ fontSize: 'clamp(28px, 5vw, 60px)', lineHeight: 1.1, color: '#FFFFFF', letterSpacing: '-0.03em' }}>Common Questions</h2>
        </div>
        <div>
          {(c.faqs || []).map((faq, i) => (
            <div key={i} className="faq-item" style={{ opacity: 0 }}>
              <AccordionItem question={faq.q} answer={faq.a} isOpen={openIndex === i} onClick={() => setOpenIndex(openIndex === i ? null : i)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
