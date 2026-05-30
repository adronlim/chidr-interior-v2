import { Link } from 'react-router-dom';
import type { Project } from '@/lib/types';

interface Props {
  project: Project;
  aspect?: 'portrait' | 'landscape' | 'auto';
}

const ASPECT_CLASS = {
  portrait: 'aspect-[4/5]',
  landscape: 'aspect-[16/11]',
  auto: '',
} as const;

export default function ProjectCard({ project, aspect = 'landscape' }: Props) {
  // Guard: card requires a project with a slug, cover image, and title.
  if (!project || !project.slug || !project.coverImage?.url || !project.title) {
    return null;
  }

  return (
    <Link to={`/projects/${project?.slug}`} className="group block">
      <div className={`overflow-hidden bg-line ${ASPECT_CLASS[aspect]}`}>
        <img
          src={project?.coverImage?.url}
          alt={project?.coverImage?.alt ?? project?.title}
          loading="lazy"
          className="image-hover w-full h-full object-cover"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-xl lg:text-2xl tracking-tighter link-underline">
          {project?.title}
        </h3>
        <span className="text-xs uppercase tracking-wider text-ash whitespace-nowrap">
          {project?.year} · {project?.category?.title}
        </span>
      </div>
    </Link>
  );
}
