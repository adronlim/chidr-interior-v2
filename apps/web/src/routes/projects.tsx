import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProjects } from '@/hooks/use-projects';
import { useCategories } from '@/hooks/use-categories';
import ProjectGrid from '@/components/project-grid';
import FilterChips from '@/components/filter-chips';
import SectionTitle from '@/components/section-title';
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
      <SectionTitle eyebrow="Portfolio">Projects.</SectionTitle>

      <div className="mb-10 mt-10 lg:mt-12">
        <FilterChips categories={categories} active={active} onChange={onChange} />
      </div>

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
