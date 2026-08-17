import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Project = {
  id: string; slug: string; title: string; excerpt: string | null;
  featured_image_url: string | null; published_at: string | null;
};

export default function ProjectsRail() {
  const ref = useRef<HTMLDivElement>(null);

  const { data: projects = [] } = useQuery({
    queryKey: ['projects_rail'],
    queryFn: async () => {
      const { data } = await supabase
        .from('posts')
        .select('id,slug,title,excerpt,featured_image_url,published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(6);
      return (data || []) as Project[];
    },
    staleTime: 60_000,
  });

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      ScrollTrigger.batch('.proj-card', {
        start: 'top 85%',
        onEnter: (batch) => gsap.fromTo(batch, { opacity: 0, scale: 0.9, filter: 'blur(10px)' }, {
          opacity: 1, scale: 1, filter: 'blur(0px)',
          duration: 1.2, stagger: 0.1, ease: 'expo.out',
        }),
      });
    });

    // Mobile specific animations for better engagement
    mm.add('(max-width: 767px)', () => {
      gsap.utils.toArray('.proj-card').forEach((card: any) => {
        gsap.fromTo(card, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 90%' }
        });
      });
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.proj-card', { opacity: 1 });
    });
    return () => mm.revert();
  }, { scope: ref, dependencies: [projects.length] });

  if (projects.length === 0) return null;

  return (
    <section ref={ref} className="relative bg-[#0a0f1a] py-24 lg:py-32 px-6 lg:px-20 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#00D4FF]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1300px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-xs font-bold uppercase tracking-widest mb-6">
              Proof of Concept
            </span>
            <h2 className="text-4xl lg:text-7xl font-black text-white tracking-tighter leading-none">
              Brands Built On <span className="text-gradient-cyan">Loyalty</span>
            </h2>
          </div>
          <Link to="/blog" className="group flex items-center gap-4 text-white font-black text-sm uppercase tracking-widest">
            Explore All Work
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8" style={{ gridAutoRows: 'minmax(280px, auto)' }}>
          {projects.map((p, i) => {
            const spans = ['lg:col-span-4 lg:row-span-2', 'lg:col-span-2 lg:row-span-1', 'lg:col-span-2 lg:row-span-1', 'lg:col-span-3', 'lg:col-span-3', 'lg:col-span-6'];
            const span = spans[i % spans.length];
            return (
              <Link
                key={p.id}
                to={`/blog/${p.slug}`}
                className={`proj-card group relative overflow-hidden rounded-[2.5rem] ${span} border border-white/10 hover:border-[#00D4FF]/40 transition-all duration-700 lg:hover:translate-y-[-10px] mobile-animate-float lg:animate-none`}
                style={{ opacity: 0 }}
              >
                {p.featured_image_url && (
                  <img
                    src={p.featured_image_url}
                    alt={p.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
                
                <div className="relative h-full flex flex-col justify-end p-10 lg:p-12">
                  <h3 className="text-2xl lg:text-3xl font-black text-white mb-4 tracking-tight leading-tight group-hover:text-[#00D4FF] transition-colors duration-500">{p.title}</h3>
                  {p.excerpt && (
                    <p className="text-white/40 font-medium line-clamp-2 leading-relaxed">{p.excerpt}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
