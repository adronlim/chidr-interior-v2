import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin } from 'lucide-react';
import { useCompany } from '@/hooks/use-company';

const ICON = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  tiktok: Instagram, // lucide doesn't ship a tiktok icon — substitute or import a custom SVG later
} as const;

export default function Footer() {
  const { data: company } = useCompany();
  if (!company) return null;

  return (
    <footer className="mt-24 bg-ink text-bone">
      <div className="container-page grid gap-12 py-20 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="font-display text-3xl tracking-tighter">
            {company?.logoWordmark?.primary}
            {company?.logoWordmark?.secondary && (
              <span className="text-ash"> {company?.logoWordmark?.secondary}</span>
            )}
          </div>
          <p className="mt-4 max-w-md text-ash">{company?.tagline}</p>
        </div>

        <div>
          <h4 className="eyebrow mb-4 text-ash">Visit</h4>
          <p className="whitespace-pre-line text-sm leading-relaxed">{company?.address}</p>
          <p className="mt-4 text-sm">
            <a href={`tel:${company?.phone.replace(/\s/g, '')}`}>{company?.phone}</a>
          </p>
          <p className="text-sm">
            <a href={`mailto:${company?.email}`}>{company?.email}</a>
          </p>
        </div>

        <div>
          <h4 className="eyebrow mb-4 text-ash">Follow</h4>
          <ul className="flex gap-4">
            {company?.socials.map((social) => {
              const Icon = ICON[social?.platform];
              return (
                <li key={social?.platform}>
                  <a
                    href={social?.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social?.platform}
                    className="inline-flex h-10 w-10 items-center justify-center border border-ash/30 transition-colors hover:border-bone"
                  >
                    <Icon size={16} />
                  </a>
                </li>
              );
            })}
          </ul>

          <h4 className="eyebrow mb-4 mt-8 text-ash">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/projects">Projects</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ash/20">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-6 text-xs text-ash">
          <span>
            © {new Date().getFullYear()} {company?.name}. All rights reserved.
          </span>
          <span>Made in Penang.</span>
        </div>
      </div>
    </footer>
  );
}
