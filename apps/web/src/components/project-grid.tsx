import ProjectCard from './project-card';
import Reveal from './reveal';
import type { Project } from '@/lib/types';

interface Props {
  projects: Project[];
  variant?: 'masonry' | 'grid';
}

export default function ProjectGrid({ projects, variant = 'grid' }: Props) {
  // Degrade gracefully: tolerate a missing / non-array projects prop by
  // rendering an empty grid rather than hiding the section entirely.
  const safeProjects = Array.isArray(projects) ? projects : [];

  if (variant === 'masonry') {
    return (
      <div className="masonry">
        {safeProjects.map((project, index) => (
          <Reveal key={project._id} delay={(index % 3) * 80}>
            <ProjectCard project={project} aspect={index % 3 === 0 ? 'portrait' : 'landscape'} />
          </Reveal>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {safeProjects.map((project, index) => (
        <Reveal key={project._id} delay={(index % 3) * 80}>
          <ProjectCard project={project} />
        </Reveal>
      ))}
    </div>
  );
}
