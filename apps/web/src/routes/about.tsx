import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTeam } from '@/hooks/use-team';
import { useCompany } from '@/hooks/use-company';
import { stats } from '@/lib/site-content';
import SectionTitle from '@/components/section-title';
import StatCounter from '@/components/stat-counter';
import Reveal from '@/components/reveal';

export default function About() {
  const { data: team = [] } = useTeam();
  const { data: company } = useCompany();

  return (
    <>
      {/* Split hero */}
      <section className="container-page py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="eyebrow mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-brass" />
              About
            </div>
            <h1 className="font-display text-5xl leading-[0.95] tracking-tighter lg:text-7xl">
              A small studio with one rule: design for the long haul.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ash">
              {company?.name} is an interior design and renovation studio in Penang. We work on
              residential, commercial and office projects across the island and the mainland.
            </p>
          </Reveal>
          <Reveal variant="clip" delay={120} className="lg:col-span-5">
            <div className="aspect-[4/5] overflow-hidden bg-line">
              <img
                src="https://placehold.co/1200x1500/F5F1EA/1A1A1A?text=Studio&font=playfair"
                alt="Studio"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-line">
        <div className="container-page grid grid-cols-2 gap-x-8 gap-y-12 py-16 lg:grid-cols-4 lg:py-20">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={(i % 4) * 90}>
              <StatCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Approach */}
      <section className="container-page py-20 lg:py-section">
        <Reveal>
          <SectionTitle eyebrow="Our approach">Three principles, every project.</SectionTitle>
        </Reveal>
        <div className="mt-12 grid gap-12 lg:grid-cols-3">
          {PRINCIPLES.map((principle, i) => (
            <Reveal key={principle.n} delay={i * 90}>
              <div className="eyebrow mb-3 text-brass">{principle.n}</div>
              <div className="mb-3 font-display text-3xl tracking-tighter">{principle.title}</div>
              <p className="leading-relaxed text-ash">{principle.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="hairline" />

      {/* Team */}
      <section className="container-page py-20 lg:py-section">
        <Reveal>
          <SectionTitle eyebrow="People">The team.</SectionTitle>
        </Reveal>
        <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
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
                <div className="mt-4">
                  <div className="font-display text-2xl tracking-tighter">{member?.name}</div>
                  <div className="eyebrow mt-1">{member?.role}</div>
                  <p className="mt-3 text-sm leading-relaxed text-ash">{member?.bio}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-bone">
        <div className="container-page py-24 text-center lg:py-32">
          <Reveal>
            <div className="eyebrow text-brass">Work together</div>
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

const PRINCIPLES = [
  {
    n: '01',
    title: 'Listen first',
    body: "We start every project by listening — to how you live, what you keep, and what you'd quietly like to change.",
  },
  {
    n: '02',
    title: 'Build slowly',
    body: "Joinery details, finishes and material choices are made once and made well. We'd rather spend an extra week than chase a shortcut.",
  },
  {
    n: '03',
    title: 'Age gracefully',
    body: "Trends fade. The homes we're proudest of are the ones still looking right a decade in.",
  },
];
