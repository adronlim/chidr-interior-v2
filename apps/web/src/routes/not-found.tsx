import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="container-page py-32 text-center">
      <div className="eyebrow mb-4">404</div>
      <h1 className="font-display text-6xl lg:text-7xl tracking-tighter leading-none">
        Page not found.
      </h1>
      <p className="mt-6 text-ash">The page you're looking for doesn't exist (anymore).</p>
      <Link to="/" className="btn-ghost mt-10 inline-flex">
        <ArrowLeft size={16} /> Back home
      </Link>
    </section>
  );
}
