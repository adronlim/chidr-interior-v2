import { useCompany } from '@/hooks/use-company';
import ContactForm from '@/components/contact-form';
import SectionTitle from '@/components/section-title';

export default function Contact() {
  const { data: company } = useCompany();

  return (
    <section className="container-page py-16 lg:py-24">
      <div className="max-w-xl">
        <div className="eyebrow mb-6">Contact</div>
        <h1 className="font-display text-5xl lg:text-7xl tracking-tighter leading-[0.95]">
          Get in touch.
        </h1>
        <p className="mt-6 text-lg text-ash leading-relaxed">
          Tell us a little about your space. We'll reply within one working day.
        </p>
      </div>

      <div className="mt-16 grid lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

        <aside className="lg:col-span-5 space-y-10">
          {company && (
            <>
              <Block title="Studio">
                <p className="whitespace-pre-line">{company.address}</p>
              </Block>
              <Block title="Phone">
                <a href={`tel:${company.phone.replace(/\s/g, '')}`}>{company.phone}</a>
              </Block>
              <Block title="Email">
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </Block>
              <Block title="Hours">
                <p>Mon – Fri · 10:00 – 18:00</p>
                <p>By appointment on weekends</p>
              </Block>
              <div className="aspect-[4/3] bg-line overflow-hidden">
                <iframe
                  src={company?.mapEmbedUrl}
                  title="Studio location"
                  loading="lazy"
                  className="w-full h-full border-0"
                />
              </div>
            </>
          )}
        </aside>
      </div>

      <div className="mt-24">
        <SectionTitle align="center" eyebrow="Visit">
          Meet us at the studio.
        </SectionTitle>
      </div>
    </section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="eyebrow mb-2">{title}</div>
      <div className="text-ink leading-relaxed">{children}</div>
    </div>
  );
}
