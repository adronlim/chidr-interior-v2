import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin } from 'lucide-react';
import { useCompany } from '@/hooks/use-company';
import { useProjects } from '@/hooks/use-projects';
import Reveal from './reveal';

const ICON = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  tiktok: Instagram, // lucide doesn't ship a tiktok icon — substitute or import a custom SVG later
} as const;

export default function Footer() {
  const { data: company } = useCompany();
  const { data: projects = [] } = useProjects();
  if (!company) return null;

  const latest = projects.slice(0, 4);

  return (
    <footer className="mt-24 bg-ink text-bone">
      <Reveal className="container-page grid gap-12 py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="font-display text-3xl tracking-tighter">
            {company?.logoWordmark?.primary}
            {company?.logoWordmark?.secondary && (
              <span className="text-ash"> {company?.logoWordmark?.secondary}</span>
            )}
          </div>
          <p className="mt-4 max-w-xs text-ash">{company?.tagline}</p>

          <ul className="mt-8 flex gap-4">
            {company?.socials.map((social) => {
              const Icon = ICON[social?.platform];
              return (
                <li key={social?.platform}>
                  <a
                    href={social?.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social?.platform}
                    className="inline-flex h-10 w-10 items-center justify-center border border-ash/30 transition-colors hover:border-bone hover:text-bone"
                  >
                    <Icon size={16} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="eyebrow mb-4 text-ash">Visit</h4>
          <p className="whitespace-pre-line text-sm leading-relaxed">{company?.address}</p>
          <p className="mt-4 text-sm">
            <a href={`tel:${company?.phone.replace(/\s/g, '')}`} className="link-underline">
              {company?.phone}
            </a>
          </p>
          <p className="text-sm">
            <a href={`mailto:${company?.email}`} className="link-underline">
              {company?.email}
            </a>
          </p>

          <h4 className="eyebrow mb-3 mt-8 text-ash">Explore</h4>
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

        {latest.length > 0 && (
          <div className="lg:col-span-5">
            <h4 className="eyebrow mb-4 text-ash">Latest projects</h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
              {latest.map((project) => (
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
              ))}
            </div>
          </div>
        )}
      </Reveal>

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
