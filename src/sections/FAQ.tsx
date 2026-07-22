import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionContent } from '../hooks/useSectionContent';

gsap.registerPlugin(ScrollTrigger);

type FaqItem = { q: string; a: string };
type FaqContent = { eyebrow: string; headline: string; faqs: FaqItem[] };

function AccordionItem({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div style={{ borderBottom: '1px solid #D6D3CC' }}>
      <button onClick={onClick} className="w-full flex items-center justify-between py-5 sm:py-6 text-left transition-colors duration-200">
        <span className="font-inter pr-4" style={{ fontSize: 'clamp(15px, 2.5vw, 17px)', lineHeight: 1.4, color: '#0A0A0A' }}>{question}</span>
        <span className="flex-shrink-0 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <line x1="8" y1="0" x2="8" y2="16" stroke={isOpen ? '#F97316' : '#0A0A0A'} strokeWidth="2" />
            <line x1="0" y1="8" x2="16" y2="8" stroke={isOpen ? '#F97316' : '#0A0A0A'} strokeWidth="2" />
          </svg>
        </span>
      </button>
      <div className="overflow-hidden transition-all duration-400" style={{ maxHeight: isOpen ? '400px' : '0', opacity: isOpen ? 1 : 0 }}>
        <p className="font-inter pb-5 sm:pb-6" style={{ fontSize: 'clamp(14px, 2vw, 16px)', lineHeight: 1.6, color: '#2D2D2D' }}>{answer}</p>
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
      gsap.fromTo('.faq-item', { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="faq" style={{ background: '#f1ece4', padding: '10vh clamp(20px, 5vw, 80px) 12vh' }}>
      <div className="max-w-[720px] mx-auto">
        <span className="block text-center font-inter font-medium uppercase mb-4" style={{ fontSize: '12px', color: '#8A8A8A', letterSpacing: '0.04em' }}>{c.eyebrow}</span>
        <h2 className="text-center font-outfit font-medium mb-10 sm:mb-16" style={{ fontSize: 'clamp(28px, 5vw, 60px)', lineHeight: 0.95, color: '#0A0A0A', letterSpacing: '-0.02em' }}>{c.headline}</h2>
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
