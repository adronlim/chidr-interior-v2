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
  const hasImage = Boolean(project?.coverImage?.url);
  const meta = [project?.location, project?.year].filter(Boolean).join(' · ');

  return (
    <Link to={`/projects/${project?.slug}`} className="group block">
      {hasImage ? (
        <>
          <div className={`overflow-hidden bg-line ${ASPECT_CLASS[aspect]}`}>
            <img
              src={project?.coverImage?.url}
              alt={project?.coverImage?.alt ?? project?.title ?? ''}
              loading="lazy"
              className="image-hover w-full h-full object-cover"
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
        </>
      ) : (
        // No cover image: a bordered editorial card holds the project's place in
        // the grid, surfacing its info instead of collapsing to a bare line.
        <div
          className={`flex flex-col justify-between border border-line p-6 transition-colors group-hover:border-ink ${ASPECT_CLASS[aspect]}`}
        >
          <div>
            {project?.category?.title && (
              <div className="eyebrow mb-3">{project.category.title}</div>
            )}
            <h3 className="font-display text-2xl lg:text-3xl tracking-tighter leading-[1.05] link-underline">
              {project?.title || 'N/A'}
            </h3>
          </div>
          <div>
            {meta && <div className="text-xs uppercase tracking-wider text-ash">{meta}</div>}
            <div className="mt-4 border-t border-line pt-3 text-xs uppercase tracking-wider text-ink">
              View project →
            </div>
          </div>
        </div>
      )}
    </Link>
  );
}
