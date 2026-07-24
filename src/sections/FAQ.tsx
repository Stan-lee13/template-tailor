import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionContent } from '../hooks/useSectionContent';

gsap.registerPlugin(ScrollTrigger);

type FaqItem = { q: string; a: string };
type FaqContent = { eyebrow: string; headline: string; faqs: FaqItem[] };

function AccordionItem({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="rounded-2xl mb-3 transition-all duration-300" style={{ background: isOpen ? 'rgba(26,32,53,0.6)' : 'transparent', border: isOpen ? '1px solid rgba(0,212,255,0.15)' : '1px solid rgba(255,255,255,0.06)' }}>
      <button onClick={onClick} className="w-full flex items-center justify-between py-5 sm:py-6 px-5 sm:px-6 text-left transition-all duration-300">
        <span className="font-inter pr-4" style={{ fontSize: 'clamp(15px, 2.5vw, 17px)', lineHeight: 1.4, color: '#FFFFFF', fontWeight: isOpen ? 600 : 400 }}>{question}</span>
        <span className="flex-shrink-0 transition-transform duration-400" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <line x1="8" y1="0" x2="8" y2="16" stroke={isOpen ? '#00D4FF' : 'rgba(255,255,255,0.4)'} strokeWidth="2" />
            <line x1="0" y1="8" x2="16" y2="8" stroke={isOpen ? '#00D4FF' : 'rgba(255,255,255,0.4)'} strokeWidth="2" />
          </svg>
        </span>
      </button>
      <div className="overflow-hidden transition-all duration-400" style={{ maxHeight: isOpen ? '400px' : '0', opacity: isOpen ? 1 : 0 }}>
        <p className="font-inter px-5 sm:px-6 pb-5 sm:pb-6" style={{ fontSize: 'clamp(14px, 2vw, 16px)', lineHeight: 1.7, color: 'rgba(255,255,255,0.55)' }}>{answer}</p>
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
    <section ref={sectionRef} id="faq" style={{ background: '#000000', padding: '14vh clamp(20px, 5vw, 80px) 12vh' }}>
      {/* Subtle separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.2), transparent)' }} />

      <div className="max-w-[720px] mx-auto">
        <div className="faq-head text-center mb-10 sm:mb-14" style={{ opacity: 0 }}>
          <span className="block font-inter font-medium uppercase mb-5 sm:mb-6" style={{ fontSize: '13px', color: '#00D4FF', letterSpacing: '0.15em' }}>{c.eyebrow}</span>
          <h2 className="font-outfit font-bold mb-0" style={{ fontSize: 'clamp(28px, 5vw, 60px)', lineHeight: 1.1, color: '#FFFFFF', letterSpacing: '-0.03em' }}>{c.headline}</h2>
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
