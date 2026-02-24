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

export default function Hello() {
  const logoUrl = useLogo();

  return (
    
      <div className="home">
        <section>
          <article>
            <img src={logoUrl} alt="Sciotta logo" />
            <p>
              Hi, my name is Thiago Sciotta and I'm a software developer.
            </p>
            <p>
              Try to read my <a href="/blog">blog</a>, check my <a href="/docs/intro">personal wiki</a> or follow me on social media.
            </p>
            <nav>
              <ul>
                <li><a href="https://www.linkedin.com/in/sciotta/">LinkedIn</a></li>
                <li><a href="https://github.com/thiagog3">Github</a></li>
                <li><a href="https://www.youtube.com/channel/UCfNbBxgDSTvcOJ3X5uD1jZQ">YouTube</a></li>
              </ul>
            </nav>
          </article>
        </section>
      </div>
  );
}
