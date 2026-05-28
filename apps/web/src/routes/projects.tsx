import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProjects } from '@/hooks/use-projects';
import { useCategories } from '@/hooks/use-categories';
import ProjectGrid from '@/components/project-grid';
import FilterChips from '@/components/filter-chips';
import SectionTitle from '@/components/section-title';
import type { CategorySlug } from '@/lib/types';

const VALID: CategorySlug[] = ['residential', 'commercial', 'office'];

function parseCategory(v: string | null): CategorySlug | null {
  return VALID.includes(v as CategorySlug) ? (v as CategorySlug) : null;
}

export default function Projects() {
  const [params, setParams] = useSearchParams();
  const [active, setActive] = useState<CategorySlug | null>(parseCategory(params.get('category')));

  const { data: categories = [] } = useCategories();
  const { data: projects = [], isLoading } = useProjects(active ?? undefined);

  const onChange = (next: CategorySlug | null) => {
    setActive(next);
    const p = new URLSearchParams(params);
    if (next) p.set('category', next);
    else p.delete('category');
    setParams(p, { replace: true });
  };

  return (
    <section className="container-page py-16 lg:py-24">
      <SectionTitle eyebrow="Portfolio">Projects.</SectionTitle>

      <div className="mt-10 lg:mt-12 mb-10">
        <FilterChips categories={categories} active={active} onChange={onChange} />
      </div>

      {isLoading ? (
        <p className="text-ash">Loading projects…</p>
      ) : projects.length === 0 ? (
        <p className="text-ash">No projects in this category yet.</p>
      ) : (
        <ProjectGrid projects={projects} variant="masonry" />
      )}
    </section>
  );
}
