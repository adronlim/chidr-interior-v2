import type { ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, Mail, Image as ImageIcon } from 'lucide-react';
import { useCompany } from '@/hooks/use-company';
import { useProjects } from '@/hooks/use-projects';
import type { Social } from '@/lib/types';
import Reveal from './reveal';

// lucide ships no WhatsApp brand glyph, so supply our own (filled, inherits
// currentColor like the lucide outline icons around it).
function WhatsappIcon({ size = 24 }: { size?: string | number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.748-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

const ICON: Record<Social['platform'], ComponentType<{ size?: string | number }>> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  whatsapp: WhatsappIcon,
  email: Mail,
  tiktok: Instagram, // lucide doesn't ship a tiktok icon — substitute or import a custom SVG later
};

export default function Footer() {
  const { data: company } = useCompany();
  const { data: projects = [] } = useProjects();

  // The footer always renders, even before/without a company document — empty
  // company fields fall back to the known brand defaults (and a contact
  // placeholder) so the section fills its position instead of collapsing.
  const brandPrimary = company?.logoWordmark?.primary ?? 'CH iDesign';
  const brandSecondary = company?.logoWordmark?.secondary ?? '& Renovation';
  const tagline = company?.tagline ?? 'Spaces that quietly endure.';
  const name = company?.name ?? 'CH iDesign & Renovation';
  const address = company?.address;
  const phone = company?.phone;
  const email = company?.email;
  const hasContact = Boolean(address || phone || email);

  // Socials live in the bottom bar (not a top column), so a count of 0/1/many
  // can never unbalance the column grid above. Guarded so an empty list shows
  // nothing rather than an orphaned label or gap.
  const socials = company?.socials ?? [];
  const latest = projects.slice(0, 4);

  return (
    <footer className="mt-24 bg-ink text-bone">
      <Reveal className="container-page py-20">
        {/* Even, always-present columns — none can be empty, so the row stays
            balanced with no justify-between void. */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="font-display text-3xl tracking-tighter">
              {brandPrimary}
              {brandSecondary && <span className="text-ash"> {brandSecondary}</span>}
            </div>
            <p className="mt-4 max-w-xs text-ash">{tagline}</p>
          </div>

          <div className="lg:col-span-4">
            <h4 className="eyebrow mb-4 text-ash">Visit</h4>
            {hasContact ? (
              <>
                {address && (
                  <p className="whitespace-pre-line text-sm leading-relaxed">{address}</p>
                )}
                {phone && (
                  <p className="mt-4 text-sm">
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="link-underline">
                      {phone}
                    </a>
                  </p>
                )}
                {email && (
                  <p className="text-sm">
                    <a href={`mailto:${email}`} className="link-underline">
                      {email}
                    </a>
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm leading-relaxed text-ash">Studio details coming soon.</p>
            )}
          </div>

          <div className="lg:col-span-3">
            <h4 className="eyebrow mb-4 text-ash">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/projects" className="link-underline">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/about" className="link-underline">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="link-underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Latest projects: a full-width band that always renders. When there
            are projects, auto-fit fills the row evenly (any 1–4 count, no ragged
            cells); when there are none, placeholder tiles hold the space so the
            footer composition never collapses. */}
        <div className="mt-16 border-t border-ash/20 pt-12">
          <h4 className="eyebrow mb-6 text-ash">Latest projects</h4>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
            {latest.length > 0
              ? latest.map((project) => (
                  <Link
                    key={project?._id}
                    to={`/projects/${project?.slug}`}
                    className="group block aspect-[4/3] overflow-hidden bg-ash/20"
                    aria-label={project?.title}
                  >
                    {project?.coverImage?.url && (
                      <img
                        src={project?.coverImage?.url}
                        alt={project?.coverImage?.alt ?? project?.title}
                        loading="lazy"
                        className="image-hover h-full w-full object-cover opacity-90 group-hover:opacity-100"
                      />
                    )}
                  </Link>
                ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex aspect-[4/3] items-center justify-center bg-ash/10"
                    aria-hidden
                  >
                    <ImageIcon size={20} className="text-ash/40" />
                  </div>
                ))}
          </div>
        </div>
      </Reveal>

      {/* Bottom bar: copyright left, socials + locale right. The socials row is
          a slim inline cluster here, balanced at any count. */}
      <div className="border-t border-ash/20">
        <div className="container-page flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-6 text-xs text-ash">
          <span>
            © {new Date().getFullYear()} {name}. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            {socials.length > 0 && (
              <ul className="flex items-center gap-4">
                {socials.map((social) => {
                  const Icon = ICON[social?.platform];
                  return (
                    <li key={social?.platform}>
                      <a
                        href={social?.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={social?.platform}
                        className="text-ash transition-colors hover:text-bone"
                      >
                        <Icon size={16} />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
            <span>Made in Penang.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
