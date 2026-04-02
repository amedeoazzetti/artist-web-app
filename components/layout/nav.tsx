import Link from 'next/link';

const links = [
  { href: '/', label: 'Home' },
  { href: '/galleria', label: 'Galleria' },
  { href: '/bio', label: 'Bio' },
  { href: '/commissioni', label: 'Commissioni' },
  { href: '/contatti', label: 'Contatti' }
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <nav className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 lg:px-20">
        <Link className="font-display text-2xl text-text-primary" href="/">
          Atelier
        </Link>
        <ul className="hidden gap-6 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link className="text-sm text-text-secondary hover:text-accent" href={link.href}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
