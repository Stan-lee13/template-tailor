import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionContent } from '../hooks/useSectionContent';

gsap.registerPlugin(ScrollTrigger);

type Service = { number: string; title: string; items: string; accent: string };
type ServicesContent = { eyebrow: string; headline: string; intro: string; services: Service[] };

export default function Services() {
  const c = useSectionContent<ServicesContent>('/', 'services', 'services');
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const services = c.services || [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.services-head', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      gsap.fromTo('.service-object', { opacity: 0, y: 30, scale: 0.98 }, {
        opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  if (services.length === 0) return null;
  const activeService = services[activeIdx] || services[0];

  return (
    <section ref={sectionRef} id="services" className="relative overflow-hidden bg-[#F3EBDD] px-6 py-20 lg:px-20 lg:py-28">
      <div className="max-w-[1300px] mx-auto">
        <div className="services-head services-object__head" style={{ opacity: 0 }}>
          <div>
            <span className="rf-object-eyebrow">{c.eyebrow}</span>
            <h2 className="services-title">Everything You Need to <span>Turn Customers Into Revenue</span></h2>
            <p className="services-intro">Strategic growth through customer loyalty, retention, and lifecycle marketing.</p>
          </div>
          <div className="services-object__stamp"><span>Service navigator</span><strong>01 — {String(services.length).padStart(2, '0')}</strong></div>
        </div>

        <div className="service-object" style={{ opacity: 0 }}>
          <div className="service-object__bar"><span>RETENTION FIRM / CAPABILITIES</span><span>{activeService.number} / {String(services.length).padStart(2, '0')}</span></div>
          <div className="service-object__body">
            <nav className="service-nav" aria-label="Services">
              <span className="service-nav__label">Scroll to Navigate</span>
              <div className="service-nav__list">
                {services.map((service, i) => (
                  <button key={service.number || i} type="button" className={`service-nav__item ${i === activeIdx ? 'is-active' : ''}`} onClick={() => setActiveIdx(i)} aria-current={i === activeIdx ? 'true' : undefined}>
                    <span className="service-nav__number">{service.number}</span>
                    <span className="service-nav__title">{service.title}</span>
                    <span className="service-nav__arrow" aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
            </nav>

            <article className="service-panel" key={activeService.number}>
              <div className="service-panel__index" style={{ background: activeIdx % 3 === 0 ? 'var(--rf-terracotta)' : activeIdx % 3 === 1 ? 'var(--rf-ochre)' : 'var(--rf-milk)' }}>{activeService.number}</div>
              <div className="service-panel__copy"><span>Retention system</span><h3>{activeService.title}</h3></div>
              <div className="service-panel__items">
                {(activeService.items || '').split(',').map((item) => item.trim()).filter(Boolean).map((item) => <span key={item}>{item}</span>)}
              </div>
              <div className="service-panel__footer"><span aria-hidden="true">↘</span><span>{activeService.number} / {String(services.length).padStart(2, '0')}</span></div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
