import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useProject } from '@/hooks/use-project';
import Gallery from '@/components/gallery';
import MetaList from '@/components/meta-list';
import ProjectCard from '@/components/project-card';
import SectionTitle from '@/components/section-title';
import VideoEmbed from '@/components/video-embed';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, isLoading } = useProject(slug);

  if (isLoading) {
    return <div className="container-page py-24 text-ash">Loading…</div>;
  }

  if (!project) {
    return (
      <div className="container-page py-24">
        <SectionTitle>Project not found.</SectionTitle>
        <Link to="/projects" className="btn-ghost mt-6">
          <ArrowLeft size={16} /> Back to all projects
        </Link>
      </div>
    );
  }

  const meta = [
    { label: 'Year', value: String(project.year) },
    { label: 'Location', value: project.location },
    ...(project.areaSqft
      ? [{ label: 'Area', value: `${project.areaSqft.toLocaleString()} sqft` }]
      : []),
    { label: 'Category', value: project.category.title },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-line">
        <img
          src={project.coverImage.url}
          alt={project.coverImage.alt ?? project.title}
          className="w-full h-[60vh] lg:h-[80vh] object-cover"
        />
      </section>

      {/* Title + meta */}
      <section className="container-page py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <div className="eyebrow mb-3">
              {project.category.title} · {project.year}
            </div>
            <h1 className="font-display text-5xl lg:text-7xl tracking-tighter leading-[0.95]">
              {project.title}
            </h1>
            <div className="mt-10 space-y-5 max-w-prose text-ink/85 leading-relaxed">
              {project.description.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <MetaList items={meta} />
            <Link to="/contact" className="btn mt-8 w-full justify-center">
              Inquire about a project <ArrowRight size={16} />
            </Link>
          </aside>
        </div>
      </section>

      {/* Walkthrough video */}
      {project.videoUrl && (
        <section className="container-page pb-16">
          <div className="eyebrow mb-4">Walkthrough</div>
          <VideoEmbed url={project.videoUrl} title={`${project.title} walkthrough`} />
        </section>
      )}

      {/* Gallery */}
      {project.gallery.length > 0 && (
        <section className="container-page pb-20">
          <Gallery images={project.gallery} />
        </section>
      )}

      <div className="hairline" />

      {/* Related */}
      {project.related.length > 0 && (
        <section className="container-page py-20 lg:py-section">
          <SectionTitle eyebrow="You may also like">More work.</SectionTitle>
          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {project.related.map((r) => (
              <ProjectCard key={r._id} project={r} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
