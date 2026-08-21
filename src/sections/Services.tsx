import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity, ArrowUpRight, BrainCircuit, ChevronLeft, ChevronRight, Gauge, Layers3, Repeat2, type LucideIcon } from 'lucide-react';
import { useSectionContent } from '../hooks/useSectionContent';
import SectionCTA from '../components/SectionCTA';

gsap.registerPlugin(ScrollTrigger);

type Service = {
  number: string;
  title: string;
  items: string;
  accent: string;
  iconKey?: string;
  subtitle?: string;
  description?: string;
};
type ServicesContent = { eyebrow: string; headline: string; intro: string; services: Service[] };

const serviceIcons: Record<string, LucideIcon> = {
  infrastructure: Layers3,
  lifecycle: Repeat2,
  revenue: Gauge,
  personalization: BrainCircuit,
  loyalty: Activity,
};

const fallbackDetails = [
  { iconKey: 'infrastructure', subtitle: 'Build the base', description: 'Create the connected retention infrastructure that keeps every customer signal usable.' },
  { iconKey: 'lifecycle', subtitle: 'Stay relevant', description: 'Turn key moments across the customer journey into timely, coordinated experiences.' },
  { iconKey: 'revenue', subtitle: 'Grow each order', description: 'Find the practical opportunities that increase value from the customers you already earned.' },
  { iconKey: 'personalization', subtitle: 'Make it matter', description: 'Use behavior and context to make every message feel more useful and more human.' },
  { iconKey: 'loyalty', subtitle: 'Keep the loop alive', description: 'Build the reasons, rituals, and referral loops that bring customers back naturally.' },
];

export default function Services() {
  const c = useSectionContent<ServicesContent>('/', 'services', 'services');
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const services = c.services || [];

  useEffect(() => {
    if (!services.length || !trackRef.current || !viewportRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.services-head', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      gsap.fromTo('.service-object', { opacity: 0, y: 30, scale: 0.98 }, {
        opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      });

      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const track = trackRef.current;
        const viewport = viewportRef.current;
        if (!track || !viewport) return;
        const getDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            id: 'services-horizontal',
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${Math.max(window.innerHeight * 1.35, getDistance() * 1.15)}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setActiveIdx(Math.min(services.length - 1, Math.round(self.progress * (services.length - 1)))),
          },
        });
        return () => tween.kill();
      });

      mm.add('(max-width: 1023px), (prefers-reduced-motion: reduce)', () => {
        gsap.fromTo('.service-scroll-card', { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.65, stagger: 0.07, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        });
      });
      return () => mm.revert();
    }, sectionRef);
    return () => ctx.revert();
  }, [services.length]);

  if (services.length === 0) return null;

  const getDetail = (service: Service, index: number) => ({ ...fallbackDetails[index % fallbackDetails.length], ...service });
  const scrollToCard = (index: number) => {
    const next = Math.max(0, Math.min(services.length - 1, index));
    setActiveIdx(next);
    const trigger = ScrollTrigger.getById('services-horizontal');
    if (trigger) {
      const progress = services.length > 1 ? next / (services.length - 1) : 0;
      window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: 'smooth' });
    } else {
      cardRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  return (
    <section ref={sectionRef} id="services" className="relative overflow-hidden bg-[#F3EBDD] px-6 py-20 lg:px-20 lg:py-28">
      <div className="max-w-[1300px] mx-auto">
        <div className="services-head services-object__head" style={{ opacity: 0 }}>
          <div>
            <span className="rf-object-eyebrow">{c.eyebrow}</span>
            <h2 className="services-title">Everything You Need to <span>Turn Customers Into Revenue</span></h2>
            <p className="services-intro">Strategic growth through customer loyalty, retention, and lifecycle marketing.</p>
          </div>
        </div>

        <div className="service-object service-scroll-object" style={{ opacity: 0 }}>
          <div className="service-object__bar"><span>RETENTION FIRM / CAPABILITIES</span><span>SCROLL TO EXPLORE</span></div>
          <div ref={viewportRef} className="service-scroll-viewport">
            <div ref={trackRef} className="service-scroll-track">
              {services.map((service, i) => {
                const detail = getDetail(service, i);
                const Icon = serviceIcons[detail.iconKey || ''] || Activity;
                return (
                  <article key={service.number || i} ref={(el) => { cardRefs.current[i] = el; }} className={`service-scroll-card ${i === activeIdx ? 'is-active' : ''}`}>
                    <div className="service-scroll-card__top">
                      <span className="service-scroll-card__number">{service.number}</span>
                      <Icon aria-hidden="true" className="service-scroll-card__icon" strokeWidth={1.6} />
                    </div>
                    <div className="service-scroll-card__copy">
                      <span className="service-scroll-card__subtitle">{detail.subtitle}</span>
                      <h3>{service.title}</h3>
                      <p>{detail.description}</p>
                    </div>
                    <div className="service-scroll-card__items">
                      {(service.items || '').split(',').map((item) => item.trim()).filter(Boolean).map((item) => <span key={item}>{item}</span>)}
                    </div>
                    <div className="service-scroll-card__footer"><span>{i === activeIdx ? 'Active system' : 'Explore system'}</span><ArrowUpRight aria-hidden="true" size={17} /></div>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="service-scroll-controls">
            <div className="service-scroll-progress" aria-label={`Service ${activeIdx + 1} of ${services.length}`}>
              {services.map((service, i) => <button key={service.number || i} type="button" className={i === activeIdx ? 'is-active' : ''} aria-label={`Go to ${service.title}`} aria-current={i === activeIdx ? 'true' : undefined} onClick={() => scrollToCard(i)} />)}
            </div>
            <div className="service-scroll-buttons">
              <button type="button" aria-label="Previous service" disabled={activeIdx === 0} onClick={() => scrollToCard(activeIdx - 1)}><ChevronLeft size={17} /></button>
              <button type="button" aria-label="Next service" disabled={activeIdx === services.length - 1} onClick={() => scrollToCard(activeIdx + 1)}><ChevronRight size={17} /></button>
            </div>
          </div>
        </div>
        <SectionCTA location="services" />
      </div>
    </section>
  );
}
