import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useHero } from '@/hooks/use-hero';
import { useProjects } from '@/hooks/use-projects';
import { useCompany } from '@/hooks/use-company';
import { useTeam } from '@/hooks/use-team';
import { testimonials } from '@/lib/dummy-data';
import { process, stats } from '@/lib/site-content';
import ProjectCard from '@/components/project-card';
import SectionTitle from '@/components/section-title';
import StatCounter from '@/components/stat-counter';
import TestimonialCarousel from '@/components/testimonial-carousel';
import Reveal from '@/components/reveal';

const MARQUEE_WORDS = ['Interior Design', 'Renovation', 'Space Planning', 'Joinery', 'Styling'];

export default function Home() {
  const { data: hero } = useHero();
  const { data: projects = [] } = useProjects();
  const { data: company } = useCompany();
  const { data: team = [] } = useTeam();

  const featured = projects.filter((project) => project?.featured)?.slice(0, 6);
  const services = company?.services ?? [];

  return (
    <>
      {/* HERO */}
      <section className="container-page pb-16 pt-10 lg:pb-24 lg:pt-16">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <div className="eyebrow mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-brass" />
              CH iDesign &amp; Renovation · Penang
            </div>
            <h1 className="font-display text-6xl leading-[0.95] tracking-tighter sm:text-7xl lg:text-8xl xl:text-[7.5rem]">
              {hero?.heading ?? 'Spaces that quietly endure.'}
            </h1>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-ash">{hero?.subheading}</p>
            <Link to={hero?.ctaHref ?? '/projects'} className="btn mt-10">
              {hero?.ctaLabel ?? 'View projects'} <ArrowRight size={16} />
            </Link>
          </Reveal>

          <Reveal className="lg:col-span-5" variant="clip">
            <div className="aspect-[4/5] overflow-hidden bg-line">
              {hero?.image?.url && (
                <img
                  src={hero?.image?.url}
                  alt={hero?.image?.alt ?? ''}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="group/marquee marquee border-y border-line py-5">
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <span key={dup} className="flex items-center" aria-hidden={dup === 1}>
              {MARQUEE_WORDS.map((word) => (
                <span key={word} className="flex items-center">
                  <span className="px-8 font-display text-2xl tracking-tighter text-ink/80">
                    {word}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* STUDIO + STATS */}
      <section className="container-page py-20 lg:py-section">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <SectionTitle eyebrow="The studio">Considered interiors, built to last.</SectionTitle>
            <p className="mt-8 max-w-md leading-relaxed text-ash">
              We design and build residential, commercial and office interiors across Penang —
              restrained palettes, careful detailing, and rooms that age gracefully rather than
              chase a trend.
            </p>
            <Link to="/about" className="btn-ghost mt-8">
              About the studio <ArrowRight size={16} />
            </Link>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid grid-cols-2 gap-x-8 gap-y-12 border-t border-line pt-12">
              {stats.map((stat) => (
                <StatCounter
                  key={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="container-page py-20 lg:py-section">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionTitle eyebrow="Selected work">Recent projects.</SectionTitle>
          <Link to="/projects" className="btn-ghost">
            All projects <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {featured?.map((project, i) => (
            <Reveal key={project?._id} delay={(i % 3) * 90}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-page py-20 lg:py-section">
        <SectionTitle eyebrow="What we do">Three services, done with care.</SectionTitle>
        <div className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service?.title} delay={i * 80} className="bg-bone">
              <div className="group flex h-full flex-col justify-between gap-16 p-8 transition-colors hover:bg-canvas">
                <div className="eyebrow text-brass">{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <h3 className="mb-3 font-display text-3xl tracking-tighter">{service?.title}</h3>
                  <p className="leading-relaxed text-ash">{service?.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="container-page py-20 lg:py-section">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionTitle eyebrow="How we work">From first sketch to handover.</SectionTitle>
            <p className="mt-6 leading-relaxed text-ash">
              A calm, transparent process. You always know what happens next and why.
            </p>
          </Reveal>

          <div className="lg:col-span-8">
            <div className="border-t border-line">
              {process.map((step, i) => (
                <Reveal key={step.no} delay={i * 90}>
                  <div className="grid gap-4 border-b border-line py-8 sm:grid-cols-[auto_1fr] sm:gap-12">
                    <div className="font-display text-5xl tracking-tighter text-brass">
                      {step.no}
                    </div>
                    <div>
                      <h3 className="mb-2 font-display text-3xl tracking-tighter">{step.title}</h3>
                      <p className="max-w-xl leading-relaxed text-ash">{step.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      {team.length > 0 && (
        <section className="container-page py-20 lg:py-section">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <SectionTitle eyebrow="The people">A small team, hands-on.</SectionTitle>
            <Link to="/about" className="btn-ghost">
              More about us <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <Reveal key={member?._id} delay={(i % 4) * 80}>
                <div className="group">
                  <div className="aspect-[4/5] overflow-hidden bg-line">
                    {member?.photo?.url && (
                      <img
                        src={member?.photo?.url}
                        alt={member?.photo?.alt ?? member?.name}
                        loading="lazy"
                        className="image-hover h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <h3 className="mt-4 font-display text-2xl tracking-tighter">{member?.name}</h3>
                  <div className="eyebrow mt-1">{member?.role}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="container-page py-20 lg:py-section">
          <Reveal>
            <TestimonialCarousel items={testimonials} />
          </Reveal>
        </section>
      )}

      {/* CTA */}
      <section className="bg-ink text-bone">
        <div className="container-page py-24 text-center lg:py-32">
          <Reveal>
            <div className="eyebrow text-brass">Start a project</div>
            <h2 className="mx-auto mt-6 max-w-3xl font-display text-5xl tracking-tighter lg:text-6xl">
              Have a space in mind?
            </h2>
            <Link
              to="/contact"
              className="mt-10 inline-flex items-center gap-2 border border-bone px-6 py-3 text-sm uppercase tracking-wider transition-colors hover:bg-bone hover:text-ink"
            >
              Let&apos;s talk <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
