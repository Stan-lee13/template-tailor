import { useEffect, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Navigation from '../sections/Navigation';
import Hero from '../sections/Hero';
import ProblemSection from '../sections/ProblemSection';
import SocialProofTicker from '../components/SocialProofTicker';
import SectionDivider from '../components/SectionDivider';
import ScrollProgress from '../components/ScrollProgress';
import StickyCTA from '../components/StickyCTA';
import SEO from '../components/SEO';
import Footer from '../sections/Footer';
import { SITE } from '../config/site';
import { track } from '../lib/analytics';

// Below-the-fold sections — code-split for faster first paint
const SolutionSection = lazy(() => import('../sections/SolutionSection'));
const Services = lazy(() => import('../sections/Services'));
const Results = lazy(() => import('../sections/Results'));
const DifferentiationSection = lazy(() => import('../sections/DifferentiationSection'));
const Process = lazy(() => import('../sections/Process'));
const FAQ = lazy(() => import('../sections/FAQ'));
const FinalCTA = lazy(() => import('../sections/FinalCTA'));
const ProjectsRail = lazy(() => import('../sections/ProjectsRail'));

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const Index = () => {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    let lenis: Lenis | null = null;

    // Lenis only on desktop/pointer devices — mobile uses native scrolling
    if (!reduced && !isTouch) {
      lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.9,
      } as ConstructorParameters<typeof Lenis>[0]);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis!.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    // Scroll depth tracking — idle-callback throttled
    const fired = new Set<number>();
    let scheduled = false;
    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      const run = () => {
        scheduled = false;
        const pct = ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100;
        [25, 50, 75, 100].forEach((m) => {
          if (pct >= m && !fired.has(m)) { fired.add(m); track('scroll_depth', { percent: m }); }
        });
      };
      const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback;
      if (ric) ric(run); else setTimeout(run, 200);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => { lenis?.destroy(); window.removeEventListener('scroll', onScroll); };
  }, []);

  const homeJsonLd = [
    { '@context': 'https://schema.org', '@type': 'Organization', name: SITE.name, alternateName: SITE.nameSpaced, url: SITE.url, logo: `${SITE.url}/favicon-512.png`, sameAs: [SITE.social.linkedin, SITE.social.twitter] },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.url },
    { '@context': 'https://schema.org', '@type': 'ProfessionalService', name: SITE.name, description: SITE.description, url: SITE.url, serviceType: 'Retention Marketing' },
  ];

  return (
    <div className="relative">
      <SEO path="/" jsonLd={homeJsonLd} />
      <ScrollProgress />
      <StickyCTA />
      <Navigation />
      <main>
        <Hero />
        <SocialProofTicker />
        <SectionDivider variant="angle" fromColor="#0a0f1a" toColor="#0a0f1a" />
        <ProblemSection />
        <Suspense fallback={<div style={{ minHeight: '50vh' }} />}>
          <SectionDivider variant="wave" fromColor="#0a0f1a" toColor="#0a0f1a" />
          <SolutionSection />
          <SectionDivider variant="asymmetric" fromColor="#0a0f1a" toColor="#0a0f1a" />
          <Services />
          <SectionDivider variant="diagonal" fromColor="#0a0f1a" toColor="#0a0f1a" />
          <Results />
          <ProjectsRail />
          <SectionDivider variant="curve" fromColor="#0a0f1a" toColor="#0a0f1a" />
          <DifferentiationSection />
          <SectionDivider variant="wave" fromColor="#0a0f1a" toColor="#0a0f1a" />
          <Process />
          <SectionDivider variant="angle" fromColor="#0a0f1a" toColor="#0a0f1a" flip />
          <FAQ />
          <SectionDivider variant="curve" fromColor="#0a0f1a" toColor="#0a0f1a" />
          <FinalCTA />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
