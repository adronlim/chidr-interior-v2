import { useCompany } from '@/hooks/use-company';
import ContactForm from '@/components/contact-form';
import Reveal from '@/components/reveal';

export default function Contact() {
  const { data: company } = useCompany();

  // Guarantee a map pin: prefer an explicit embed override, otherwise build a
  // marker-showing embed from the address. The `q=…&output=embed` form drops a
  // pin at the location (a raw `pb` embed only centres the view, no marker) and
  // needs no API key.
  const mapQuery = company?.address?.replace(/\s*\n\s*/g, ', ').trim();
  const mapSrc =
    company?.mapEmbedUrl?.trim() ||
    (mapQuery ? `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed` : '');
  return (
    <section className="container-page py-16 lg:py-24">
      <Reveal>
        <div className="max-w-xl">
          <div className="eyebrow mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-brass" />
            Contact
          </div>
          <h1 className="font-display text-6xl leading-[0.95] tracking-tighter lg:text-8xl">
            Get in touch.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ash">
            Tell us a little about your space. We&apos;ll reply within one working day.
          </p>
        </div>
      </Reveal>

      <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-20">
        <Reveal className="lg:col-span-7">
          <ContactForm />
        </Reveal>

        <Reveal delay={140} className="lg:col-span-5">
          <aside className="space-y-10">
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
                {mapSrc && (
                  <div className="aspect-[4/3] overflow-hidden bg-line">
                    <iframe
                      src={mapSrc}
                      title="Studio location"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="h-full w-full border-0"
                    />
                  </div>
                )}
              </>
            )}
          </aside>
        </Reveal>
      </div>
    </section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="eyebrow mb-2">{title}</div>
      <div className="leading-relaxed text-ink">{children}</div>
    </div>
  );
}
