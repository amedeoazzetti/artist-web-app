import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-6 py-12 text-sm text-text-secondary lg:grid-cols-3 lg:px-20">
        <div>
          <h3 className="font-display text-xl text-text-primary">Atelier Arte Italiana</h3>
          <p className="mt-2">Opere originali uniche, spedizione assicurata in tutta Italia.</p>
        </div>
        <div>
          <h4 className="mb-2 text-text-primary">Navigazione</h4>
          <ul className="space-y-1">
            <li><Link href="/galleria">Galleria</Link></li>
            <li><Link href="/bio">Bio</Link></li>
            <li><Link href="/commissioni">Commissioni</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-2 text-text-primary">Legali</h4>
          <ul className="space-y-1">
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/cookie">Cookie</Link></li>
            <li><Link href="/termini">Termini</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-6 py-4 text-center text-xs text-text-muted">
        © {new Date().getFullYear()} Atelier Arte Italiana
      </div>
    </footer>
  );
}
