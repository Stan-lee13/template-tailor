import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Navigation from '../sections/Navigation';
import Hero from '../sections/Hero';
import ProblemSection from '../sections/ProblemSection';
import SolutionSection from '../sections/SolutionSection';
import Services from '../sections/Services';
import Results from '../sections/Results';
import DifferentiationSection from '../sections/DifferentiationSection';
import Process from '../sections/Process';
import Pricing from '../sections/Pricing';
import FAQ from '../sections/FAQ';
import FinalCTA from '../sections/FinalCTA';
import Footer from '../sections/Footer';
import SectionDivider from '../components/SectionDivider';
import SocialProofTicker from '../components/SocialProofTicker';
import ScrollProgress from '../components/ScrollProgress';

gsap.registerPlugin(ScrollTrigger);

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isHovering = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e: MouseEvent) => { posRef.current.targetX = e.clientX; posRef.current.targetY = e.clientY; };
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        isHovering.current = true;
        cursor.style.width = '40px'; cursor.style.height = '40px'; cursor.style.borderColor = '#F97316'; cursor.style.background = 'transparent';
      }
    };
    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        isHovering.current = false;
        cursor.style.width = '8px'; cursor.style.height = '8px'; cursor.style.borderColor = 'transparent'; cursor.style.background = '#F97316';
      }
    };

    let raf: number;
    const animate = () => {
      const pos = posRef.current;
      pos.x += (pos.targetX - pos.x) * 0.15;
      pos.y += (pos.targetY - pos.y) * 0.15;
      cursor.style.transform = `translate(${pos.x - (isHovering.current ? 20 : 4)}px, ${pos.y - (isHovering.current ? 20 : 4)}px)`;
      raf = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    raf = requestAnimationFrame(animate);

    return () => { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseover', onMouseOver); document.removeEventListener('mouseout', onMouseOut); cancelAnimationFrame(raf); };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
      style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F97316', border: '1px solid transparent', mixBlendMode: 'difference', transition: 'width 0.15s ease-out, height 0.15s ease-out, border-color 0.15s ease-out, background 0.15s ease-out' }}
    />
  );
}

const Index = () => {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, duration: 1.2 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    if (!window.matchMedia('(pointer: coarse)').matches) {
      document.documentElement.style.cursor = 'none';
      const style = document.createElement('style');
      style.textContent = 'a, button, [role="button"], input, textarea, select { cursor: none !important; }';
      document.head.appendChild(style);
    }

    return () => { lenis.destroy(); };
  }, []);

  return (
    <div className="relative">
      <CustomCursor />
      <Navigation />
      <main>
        <Hero />
        
        {/* Hero → Problem: angled divider */}
        <SectionDivider variant="angle" fromColor="#0A0A0A" toColor="#0A0A0A" />
        
        <ProblemSection />
        
        {/* Problem → Solution: curved wave */}
        <SectionDivider variant="wave" fromColor="#0A0A0A" toColor="#EBE8E0" />
        
        <SolutionSection />
        
        {/* Solution → Services: asymmetric */}
        <SectionDivider variant="asymmetric" fromColor="#EBE8E0" toColor="#EBE8E0" />
        
        <Services />
        
        {/* Services → Results: diagonal */}
        <SectionDivider variant="diagonal" fromColor="#EBE8E0" toColor="#EBE8E0" />
        
        <Results />
        
        {/* Results → Differentiation: curve */}
        <SectionDivider variant="curve" fromColor="#EBE8E0" toColor="#0A0A0A" />
        
        <DifferentiationSection />
        
        {/* Differentiation → Process: wave */}
        <SectionDivider variant="wave" fromColor="#0A0A0A" toColor="#0A0A0A" />
        
        <Process />
        
        {/* Process → Pricing: angle flip */}
        <SectionDivider variant="angle" fromColor="#0A0A0A" toColor="#EBE8E0" flip />
        
        <Pricing />
        
        {/* Pricing → FAQ: asymmetric */}
        <SectionDivider variant="asymmetric" fromColor="#EBE8E0" toColor="#EBE8E0" />
        
        <FAQ />
        
        {/* FAQ → CTA: curve */}
        <SectionDivider variant="curve" fromColor="#EBE8E0" toColor="#0A0A0A" />
        
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
