import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { ArrowUpRight } from 'lucide-react';

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand-link">
          <span>Akashdip Mahapatra</span>
          <span className="brand-badge">Engineering Blog</span>
        </Link>

        <div className="header-actions">
          <a
            href="https://akashdipmahapatra.in"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
            title="Visit Portfolio"
          >
            <span>Portfolio</span>
            <ArrowUpRight size={15} />
          </a>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
