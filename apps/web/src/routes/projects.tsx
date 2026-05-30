import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProjects } from '@/hooks/use-projects';
import { useCategories } from '@/hooks/use-categories';
import ProjectGrid from '@/components/project-grid';
import FilterChips from '@/components/filter-chips';
import Reveal from '@/components/reveal';
import type { CategorySlug } from '@/lib/types';

const VALID: CategorySlug[] = ['residential', 'commercial', 'office'];

function parseCategory(value: string | null): CategorySlug | null {
  return VALID.includes(value as CategorySlug) ? (value as CategorySlug) : null;
}

export default function Projects() {
  const [params, setParams] = useSearchParams();
  const [active, setActive] = useState<CategorySlug | null>(parseCategory(params.get('category')));

  const { data: categories = [] } = useCategories();
  const { data: projects = [], isLoading } = useProjects(active ?? undefined);
  const onChange = (next: CategorySlug | null) => {
    setActive(next);
    const nextParams = new URLSearchParams(params);
    if (next) nextParams.set('category', next);
    else nextParams.delete('category');
    setParams(nextParams, { replace: true });
  };

  return (
    <section className="container-page py-16 lg:py-24">
      <Reveal>
        <div className="eyebrow mb-6 flex items-center gap-3">
          <span className="h-px w-10 bg-brass" />
          Portfolio
        </div>
        <h1 className="max-w-3xl font-display text-6xl leading-[0.95] tracking-tighter lg:text-8xl">
          Selected projects.
        </h1>
        <p className="mt-8 max-w-md leading-relaxed text-ash">
          Residential, commercial and office interiors across Penang. Filter by the kind of space
          you have in mind.
        </p>
      </Reveal>

      <Reveal delay={120} className="mb-10 mt-12">
        <FilterChips categories={categories} active={active} onChange={onChange} />
      </Reveal>

      {isLoading ? (
        <p className="text-ash">Loading projects…</p>
      ) : projects?.length === 0 ? (
        <p className="text-ash">No projects in this category yet.</p>
      ) : (
        <ProjectGrid projects={projects} variant="masonry" />
      )}
    </section>
  );
}
