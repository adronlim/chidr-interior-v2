import ProjectCard from './project-card';
import type { Project } from '@/lib/types';

interface Props {
  projects: Project[];
  variant?: 'masonry' | 'grid';
}

export default function ProjectGrid({ projects, variant = 'grid' }: Props) {
  // Guard: nothing to render without a non-empty projects array.
  if (!Array.isArray(projects) || projects.length === 0) {
    return null;
  }

  if (variant === 'masonry') {
    return (
      <div className="masonry">
        {projects?.map((project, index) => (
          <div key={project._id}>
            <ProjectCard
              project={project}
              aspect={index % 3 === 0 ? 'portrait' : 'landscape'}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {projects?.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}
