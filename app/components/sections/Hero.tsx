'use client';

import { JSX } from 'react';
import StaggerHeadline from '../StaggerHeadline';

interface HeroProps {
  introDone?: boolean;
}

export default function Hero({ introDone = false }: HeroProps): JSX.Element {
  const animateClass = introDone ? 'animate' : '';
  return (
    <section className="hero" id="top">
      <div className="hero-bg">
        <div className="stars" />
      </div>
      <div className="wrap hero-inner">
        <div className="hero-text">
          <StaggerHeadline
            words={[
              { text: 'Engineering' },
              { text: 'that' },
              { text: 'ships.', it: true },
            ]}
            accentIdx={-1}
            animate={introDone}
          />
          <p className={`hero-sub ${animateClass}`}>
            We build AI systems, connected hardware, and full-stack products — from first commit to production fleet.
          </p>
          <p className={`hero-supporting ${animateClass}`}>
            Computer vision. Agentic automation. IoT. Mobile. ML pipelines. One focused studio.
          </p>
          <div className={`hero-cta-row ${animateClass}`}>
            <a href="mailto:nealatkylos@outlook.com,tirthatkylos@outlook.com?subject=Project%20Inquiry" className="btn btn-primary">
              Book a Discovery Call <span className="arr">→</span>
            </a>
            <a href="#cases" className="btn btn-ghost">
              See our work <span className="arr">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
