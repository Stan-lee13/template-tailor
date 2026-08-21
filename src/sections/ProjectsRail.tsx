import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import SignedImage from '../components/SignedImage';


gsap.registerPlugin(ScrollTrigger);

type Project = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: string | null;
};

function fmt(d: string | null) {
  return d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Latest insight';
}

export default function ProjectsRail() {
  const ref = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);

  const { data: projects = [], isLoading } = useQuery({
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

  useEffect(() => {
    setSelectedIndex((current) => Math.min(current, Math.max(projects.length - 1, 0)));
  }, [projects.length]);

  useEffect(() => {
    if (!isLoading) {
      setLoadingTimedOut(false);
      return;
    }
    const timeout = window.setTimeout(() => setLoadingTimedOut(true), 6500);
    return () => window.clearTimeout(timeout);
  }, [isLoading]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.projects-head', { opacity: 0, y: 32 }, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power4.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      });
      gsap.fromTo('.project-rail', { opacity: 0, y: 24 }, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.project-rail', start: 'top 78%' },
      });
      gsap.fromTo('.project-thumb', { opacity: 0, y: 18 }, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.project-thumbnails', start: 'top 85%' },
      });
    }, ref);
    return () => ctx.revert();
  }, [projects.length]);

  const selected = projects[selectedIndex];
  const moveSelection = (direction: number) => {
    if (!projects.length) return;
    setSelectedIndex((current) => (current + direction + projects.length) % projects.length);
  };

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#050505] px-6 py-20 lg:px-20 lg:py-28">
      <div className="max-w-[1300px] mx-auto">
        <div className="projects-head projects-object__head" style={{ opacity: 0 }}>
          <div>
            <span className="rf-object-eyebrow">Retention Insights</span>
            <h2 className="projects-title">Ideas That Keep Customers <span>Coming Back</span></h2>
          </div>
          <Link to="/blog" className="projects-all-link">Explore the Blog <span aria-hidden="true">↗</span></Link>
        </div>

        <div className="project-rail" style={{ opacity: 0 }}>
          <div className="project-rail__bar"><span>RETENTION FIRM / LATEST INSIGHTS</span><span>ARTICLES / {String(projects.length).padStart(2, '0')}</span></div>
          {isLoading && !loadingTimedOut ? (
            <div className="project-rail__empty" role="status">Loading latest posts…</div>
          ) : selected ? (
            <>
              <div className="project-lead">
                <Link to={`/blog/${selected.slug}`} className="project-lead__media" aria-label={`Read ${selected.title}`}>
                  {selected.featured_image_url ? (
                    <SignedImage path={selected.featured_image_url} alt="" className="project-lead__image" />
                  ) : (
                    <div className="project-lead__placeholder" aria-hidden="true"><span>RF / {String(selectedIndex + 1).padStart(2, '0')}</span></div>
                  )}
                  <span className="project-lead__media-index">{String(selectedIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
                </Link>
                <div className="project-lead__copy">
                  <div className="project-lead__meta"><span>{fmt(selected.published_at)}</span><span>Blog post</span></div>
                  <Link to={`/blog/${selected.slug}`} className="project-lead__title-link"><h3>{selected.title}</h3><span aria-hidden="true">↗</span></Link>
                  {selected.excerpt && <p>{selected.excerpt}</p>}
                  <div className="project-lead__footer"><span>Read the article</span><span aria-hidden="true">Scroll to explore</span></div>
                </div>
              </div>

              <div className="project-thumbnails-wrap">
                <div className="project-thumbnails__controls">
                  <span>Browse the insights</span>
                  <div>
                    <button type="button" onClick={() => moveSelection(-1)} aria-label="Previous blog post">←</button>
                    <button type="button" onClick={() => moveSelection(1)} aria-label="Next blog post">→</button>
                  </div>
                </div>
                <div className="project-thumbnails" role="tablist" aria-label="Blog posts">
                  {projects.map((project, index) => (
                    <button
                      key={project.id}
                      type="button"
                      role="tab"
                      aria-selected={selectedIndex === index}
                      aria-label={`Show ${project.title}`}
                      className={`project-thumb ${selectedIndex === index ? 'is-active' : ''}`}
                      onClick={() => setSelectedIndex(index)}
                    >
                      <span className="project-thumb__image">
                        {project.featured_image_url ? <SignedImage path={project.featured_image_url} alt="" loading="lazy" /> : <span aria-hidden="true">RF</span>}
                      </span>
                      <span className="project-thumb__text"><strong>{String(index + 1).padStart(2, '0')}</strong><span>{project.title}</span></span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="project-rail__empty">No blog posts available yet.</div>
          )}
        </div>
      </div>
    </section>
  );
}
