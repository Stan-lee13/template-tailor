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
        onEnter: (batch) => gsap.fromTo(batch, { opacity: 0, y: 40, clipPath: 'inset(20% 20% 20% 20% round 24px)' }, {
          opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 24px)',
          duration: 0.9, stagger: { each: 0.08, from: 'random' }, ease: 'power3.out',
        }),
      });
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.proj-card', { opacity: 1 });
    });
    return () => mm.revert();
  }, { scope: ref, dependencies: [projects.length] });

  if (projects.length === 0) return null;

  return (
    <section ref={ref} className="relative" style={{ background: '#f1ece4', padding: '12vh clamp(20px, 5vw, 80px)' }}>
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-end justify-between gap-6 mb-10 sm:mb-14 flex-wrap">
          <div>
            <span className="block font-inter font-medium uppercase mb-4" style={{ fontSize: '12px', color: '#555', letterSpacing: '0.04em' }}>
              <span style={{ color: '#2C91E1' }}>●</span>&nbsp;&nbsp;Recent Work
            </span>
            <h2 className="font-outfit font-medium" style={{ fontSize: 'clamp(28px, 5vw, 56px)', lineHeight: 0.95, color: '#0A0A0A', letterSpacing: '-0.02em' }}>
              Case Studies & Insights
            </h2>
          </div>
          <Link to="/blog" className="font-inter font-medium text-sm story-link" style={{ color: '#0A0A0A' }}>View all →</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5" style={{ gridAutoRows: 'minmax(220px, auto)' }}>
          {projects.map((p, i) => {
            // Bento layout: alternate spans to create asymmetric grid
            const spans = ['lg:col-span-4 lg:row-span-2', 'lg:col-span-2 lg:row-span-1', 'lg:col-span-2 lg:row-span-1', 'lg:col-span-3', 'lg:col-span-3', 'lg:col-span-6'];
            const span = spans[i % spans.length];
            return (
              <Link
                key={p.id}
                to={`/blog/${p.slug}`}
                className={`proj-card group relative overflow-hidden rounded-3xl ${span}`}
                style={{ opacity: 0, background: '#0A0A0A', border: '1px solid #D6D3CC', minHeight: 240 }}
              >
                {p.featured_image_url && (
                  <img
                    src={p.featured_image_url}
                    alt={p.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                )}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(4,33,63,0.15) 0%, rgba(4,33,63,0.85) 100%)' }} />
                <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
                  <h3 className="font-outfit font-medium mb-2" style={{ fontSize: 'clamp(18px, 2.5vw, 26px)', lineHeight: 1.15, color: '#f1ece4', letterSpacing: '-0.01em' }}>{p.title}</h3>
                  {p.excerpt && (
                    <p className="font-inter line-clamp-2" style={{ fontSize: '14px', color: 'rgba(241,236,228,0.72)', lineHeight: 1.55 }}>{p.excerpt}</p>
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
