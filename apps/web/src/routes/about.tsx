import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTeam } from '@/hooks/use-team';
import { useCompany } from '@/hooks/use-company';
import SectionTitle from '@/components/section-title';

export default function About() {
  const { data: team = [] } = useTeam();
  const { data: company } = useCompany();

  return (
    <>
      {/* Split hero */}
      <section className="container-page py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="eyebrow mb-6">About</div>
            <h1 className="font-display text-5xl lg:text-7xl tracking-tighter leading-[0.95]">
              A small studio with one rule: design for the long haul.
            </h1>
            <p className="mt-8 max-w-xl text-lg text-ash leading-relaxed">
              {company?.name} is an interior design and renovation studio in Penang. We work on
              residential, commercial and office projects across the island and the mainland.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="aspect-[4/5] bg-line overflow-hidden">
              <img
                src="https://placehold.co/1200x1500/F5F1EA/1A1A1A?text=Studio&font=playfair"
                alt="Studio"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="hairline" />

      {/* Approach */}
      <section className="container-page py-20 lg:py-section">
        <SectionTitle eyebrow="Our approach">Three principles, every project.</SectionTitle>
        <div className="mt-12 grid gap-12 lg:grid-cols-3">
          <Pillar n="01" title="Listen first">
            We start every project by listening — to how you live, what you keep, and what you'd
            quietly like to change.
          </Pillar>
          <Pillar n="02" title="Build slowly">
            Joinery details, finishes and material choices are made once and made well. We'd rather
            spend an extra week than chase a shortcut.
          </Pillar>
          <Pillar n="03" title="Age gracefully">
            Trends fade. The homes we're proudest of are the ones still looking right a decade in.
          </Pillar>
        </div>
      </section>

      <div className="hairline" />

      {/* Team */}
      <section className="container-page py-20 lg:py-section">
        <SectionTitle eyebrow="People">The team.</SectionTitle>
        <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div key={member?._id}>
              <div className="aspect-[4/5] bg-line overflow-hidden">
                <img
                  src={member?.photo?.url}
                  alt={member?.photo?.alt ?? member?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4">
                <div className="font-display text-2xl tracking-tighter">{member?.name}</div>
                <div className="eyebrow mt-1">{member?.role}</div>
                <p className="mt-3 text-sm text-ash leading-relaxed">{member?.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="hairline" />

      {/* CTA */}
      <section className="container-page py-20 lg:py-section text-center">
        <SectionTitle align="center" eyebrow="Work together">
          Have a space in mind?
        </SectionTitle>
        <Link to="/contact" className="btn mt-8">
          Let's talk <ArrowRight size={16} />
        </Link>
      </section>
    </>
  );
}

function Pillar({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="eyebrow mb-3">{n}</div>
      <div className="font-display text-3xl tracking-tighter mb-3">{title}</div>
      <p className="text-ash leading-relaxed">{children}</p>
    </div>
  );
}
