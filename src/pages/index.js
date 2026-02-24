import React from 'react';
import './index.css';
import SciottaLogoUrl from '@site/static/img/sciotta.png';
import SciottaDarkLogoUrl from '@site/static/img/sciotta-dark.png';
import useIsBrowser from '@docusaurus/useIsBrowser';

function useLogo() {
  const isBrowser = useIsBrowser();
  if (!isBrowser) return SciottaLogoUrl;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return isDark ? SciottaDarkLogoUrl : SciottaLogoUrl;
}

const SocialIcon = ({ href, label, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="social-icon">
    {children}
  </a>
);

export default function Hello() {
  const logoUrl = useLogo();

  return (
    <div className="home">
      <section>
        <article>
          <img src={logoUrl} alt="Sciotta logo" className="logo" />
          <p className="intro">
            Software developer, building things for the web.
          </p>
          <div className="links">
            <a href="/blog" className="link-pill">Blog</a>
            <a href="/docs/intro" className="link-pill">Wiki</a>
          </div>
          <nav className="social-nav">
            <SocialIcon href="https://www.linkedin.com/in/sciotta/" label="LinkedIn">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M20.47,2H3.53A1.45,1.45,0,0,0,2.06,3.43V20.57A1.45,1.45,0,0,0,3.53,22H20.47a1.45,1.45,0,0,0,1.47-1.43V3.43A1.45,1.45,0,0,0,20.47,2ZM8.09,18.74h-3v-9h3ZM6.59,8.48h0a1.56,1.56,0,1,1,0-3.12,1.57,1.57,0,1,1,0,3.12ZM18.91,18.74h-3V13.91c0-1.21-.43-2-1.52-2A1.65,1.65,0,0,0,12.85,13a2,2,0,0,0-.1.73v5h-3s0-8.18,0-9h3V11A3,3,0,0,1,15.46,9.5c2,0,3.45,1.29,3.45,4.06Z"/>
              </svg>
            </SocialIcon>
            <SocialIcon href="https://github.com/thiagog3" label="GitHub">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </SocialIcon>
            <SocialIcon href="https://www.youtube.com/channel/UCfNbBxgDSTvcOJ3X5uD1jZQ" label="YouTube">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </SocialIcon>
          </nav>
        </article>
      </section>
    </div>
  );
}
