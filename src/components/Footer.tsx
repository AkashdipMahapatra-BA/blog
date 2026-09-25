import { SplitGithubButton } from './SplitGithubButton';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <p>© {currentYear} Akashdip Mahapatra. All technical rights reserved.</p>
        </div>

        <div className="footer-links" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href="https://www.linkedin.com/in/akashdip2001"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>

          {/* Split GitHub Profile Button (Work & Academic) */}
          <SplitGithubButton />

          <a
            href="mailto:contact@akashdipmahapatra.in"
            className="nav-link"
            aria-label="Email"
            title="Email"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
