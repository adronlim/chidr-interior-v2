import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useCompany } from '@/hooks/use-company';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav() {
  const { data: company } = useCompany();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location?.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur transition-colors duration-300 ${
        scrolled ? 'border-b border-line bg-bone/90 shadow-[0_1px_0_rgba(0,0,0,0.02)]' : 'bg-bone/70'
      }`}
    >
      <div
        className={`container-page flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'h-14 lg:h-16' : 'h-16 lg:h-20'
        }`}
      >
        <Link to="/" className="font-display text-xl lg:text-2xl tracking-tighter leading-none">
          <span>{company?.logoWordmark?.primary ?? 'CH iDesign'}</span>
          {company?.logoWordmark?.secondary && (
            <span className="text-ash"> {company?.logoWordmark?.secondary}</span>
          )}
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {LINKS?.map((link) => (
            <NavLink
              key={link?.to}
              to={link?.to}
              end={link?.end}
              className={({ isActive }) =>
                `link-underline text-xs uppercase tracking-wider ${isActive ? 'active text-ink' : 'text-ash hover:text-ink'}`
              }
            >
              {link?.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="lg:hidden p-2 -mr-2"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((isOpen) => !isOpen)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-line bg-bone">
          <ul className="container-page py-6 flex flex-col gap-5">
            {LINKS.map((link) => (
              <li key={link?.to}>
                <NavLink
                  to={link?.to}
                  end={link?.end}
                  className={({ isActive }) =>
                    `font-display text-3xl tracking-tighter ${isActive ? 'text-ink' : 'text-ash'}`
                  }
                >
                  {link?.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
