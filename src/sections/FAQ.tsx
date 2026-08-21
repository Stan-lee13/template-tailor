import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionContent } from '../hooks/useSectionContent';

gsap.registerPlugin(ScrollTrigger);

type FaqItem = { q: string; a: string };
type FaqContent = { eyebrow: string; headline: string; faqs: FaqItem[] };

function AccordionItem({ question, answer, isOpen, onClick, index }: { question: string; answer: string; isOpen: boolean; onClick: () => void; index: number }) {
  const answerId = `faq-answer-${index}`;
  return (
    <div className={`faq-item ${isOpen ? 'is-open' : ''}`}>
      <button type="button" onClick={onClick} className="faq-question" aria-expanded={isOpen} aria-controls={answerId}>
        <span className="faq-question__index">{String(index + 1).padStart(2, '0')}</span>
        <span className="faq-question__text">{question}</span>
        <span className="faq-question__icon" aria-hidden="true">+</span>
      </button>
      <div id={answerId} role="region" aria-hidden={!isOpen} className={`faq-answer ${isOpen ? 'is-open' : ''}`}>
        <p>{answer}</p>
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
    <section ref={sectionRef} id="faq" className="relative overflow-hidden bg-[#F3EBDD] px-6 py-20 lg:px-20 lg:py-28">
      <div className="max-w-[1300px] mx-auto">
        <div className="faq-head faq-object__head" style={{ opacity: 0 }}>
          <div><span className="rf-object-eyebrow">{c.eyebrow}</span><h2 className="faq-title">Common Questions</h2></div>
        </div>
        <div className="faq-object">
          <div className="faq-object__bar"><span>RETENTION FIRM / CLARITY</span><span>OPEN ONE TO GO DEEPER</span></div>
          <div className="faq-list">
            {(c.faqs || []).map((faq, i) => <AccordionItem key={i} index={i} question={faq.q} answer={faq.a} isOpen={openIndex === i} onClick={() => setOpenIndex(openIndex === i ? null : i)} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
