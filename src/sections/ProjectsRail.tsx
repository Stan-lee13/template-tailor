import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.projects-head', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power4.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      });
      gsap.fromTo('.project-card', { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.project-grid', start: 'top 78%' },
      });
    }, ref);
    return () => ctx.revert();
  }, [projects.length]);

  if (projects.length === 0) return null;

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#050505] px-6 py-20 lg:px-20 lg:py-28">
      <div className="max-w-[1300px] mx-auto">
        <div className="projects-head projects-object__head" style={{ opacity: 0 }}>
          <div>
            <span className="rf-object-eyebrow">Proof of Concept</span>
            <h2 className="projects-title">Brands Built On <span>Loyalty</span></h2>
          </div>
          <Link to="/blog" className="projects-all-link">Explore All Work <span aria-hidden="true">↗</span></Link>
        </div>

        <div className="projects-object">
          <div className="projects-object__bar"><span>RETENTION FIRM / SELECTED WORK</span><span>PROOF / {String(projects.length).padStart(2, '0')}</span></div>
          <div className="project-grid">
            {projects.map((project, i) => (
              <Link key={project.id} to={`/blog/${project.slug}`} className={`project-card ${i === 0 ? 'project-card--lead' : ''}`} style={{ opacity: 0 }} aria-label={project.title}>
                {project.featured_image_url && <img src={project.featured_image_url} alt={project.title} loading="lazy" />}
                <div className="project-card__shade" />
                <div className="project-card__content">
                  <div className="project-card__top"><span>{String(i + 1).padStart(2, '0')}</span><span aria-hidden="true">↗</span></div>
                  <div><h3>{project.title}</h3>{project.excerpt && <p>{project.excerpt}</p>}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
