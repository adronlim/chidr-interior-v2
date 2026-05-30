import { Link } from 'react-router-dom';
import projectPlaceholder from '@/assets/project-placeholder.svg';
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
  // Fall back to a static placeholder image so every card shares the same tile
  // composition whether or not the project has a cover upload.
  const hasImage = Boolean(project?.coverImage?.url);
  const coverUrl = hasImage ? project?.coverImage?.url : projectPlaceholder;
  const coverAlt = hasImage
    ? (project?.coverImage?.alt ?? project?.title ?? '')
    : `${project?.title ?? 'Project'} — image coming soon`;

  return (
    <Link to={`/projects/${project?.slug}`} className="group block">
      <div className={`overflow-hidden bg-line ${ASPECT_CLASS[aspect]}`}>
        <img
          src={coverUrl}
          alt={coverAlt}
          loading="lazy"
          className="image-hover h-full w-full object-cover"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-xl lg:text-2xl tracking-tighter link-underline">
          {project?.title || 'N/A'}
        </h3>
        <span className="text-xs uppercase tracking-wider text-ash whitespace-nowrap">
          {project?.year ? `${project.year} · ` : ''}
          {project?.category?.title}
        </span>
      </div>
    </Link>
  );
}
