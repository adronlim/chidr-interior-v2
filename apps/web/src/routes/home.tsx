import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useHero } from '@/hooks/use-hero';
import { useProjects } from '@/hooks/use-projects';
import { useCompany } from '@/hooks/use-company';
import { testimonials } from '@/lib/dummy-data';
import ProjectCard from '@/components/project-card';
import SectionTitle from '@/components/section-title';

export default function Home() {
  const { data: hero } = useHero();
  const { data: projects = [] } = useProjects();
  const { data: company } = useCompany();

  const featured = projects.filter((project) => project?.featured)?.slice(0, 6);

  return (
    <>
      {/* HERO */}
      <section className="container-page pt-12 lg:pt-20 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-6">
            <div className="eyebrow mb-6">CH iDesign &amp; Renovation · Penang</div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tighter leading-[0.95]">
              {hero?.heading ?? 'Spaces that quietly endure.'}
            </h1>
            <p className="mt-8 max-w-md text-lg text-ash leading-relaxed">{hero?.subheading}</p>
            <Link to={hero?.ctaHref ?? '/projects'} className="btn mt-10">
              {hero?.ctaLabel ?? 'View projects'} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="lg:col-span-6">
            <div className="aspect-[4/5] bg-line overflow-hidden">
              {hero?.image && (
                <img
                  src={hero?.image?.url}
                  alt={hero?.image?.alt ?? ''}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="hairline" />

      {/* FEATURED WORK */}
      <section className="container-page py-20 lg:py-section">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <SectionTitle eyebrow="Selected work">Recent projects.</SectionTitle>
          <Link to="/projects" className="btn-ghost">
            All projects <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {featured?.map((project) => (
            <ProjectCard key={project?._id} project={project} />
          ))}
        </div>
      </section>

      <div className="hairline" />

      {/* SERVICES */}
      <section className="container-page py-20 lg:py-section">
        <SectionTitle eyebrow="What we do">Three services, done with care.</SectionTitle>
        <div className="mt-12 grid gap-12 lg:grid-cols-3">
          {company?.services?.map((service) => (
            <div key={service?.title}>
              <div className="font-display text-3xl tracking-tighter mb-3">{service.title}</div>
              <p className="text-ash leading-relaxed">{service?.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="hairline" />

      {/* TESTIMONIAL */}
      {testimonials?.[0] && (
        <section className="container-page py-20 lg:py-section text-center max-w-3xl mx-auto">
          <p className="font-display text-3xl lg:text-4xl tracking-tighter leading-snug">
            &ldquo;{testimonials?.[0]?.quote}&rdquo;
          </p>
          <p className="eyebrow mt-8">
            — {testimonials?.[0]?.author}, {testimonials?.[0]?.role}
          </p>
        </section>
      )}

      <div className="hairline" />

      {/* CTA */}
      <section className="container-page py-20 lg:py-section text-center">
        <SectionTitle align="center" eyebrow="Start a project">
          Have a space in mind?
        </SectionTitle>
        <Link to="/contact" className="btn mt-8">
          Let's talk <ArrowRight size={16} />
        </Link>
      </section>
    </>
  );
}
