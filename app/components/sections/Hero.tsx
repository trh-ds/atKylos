'use client';

import { JSX } from 'react';
import StaggerHeadline from '../StaggerHeadline';

interface HeroProps {
  introDone?: boolean;
}

export default function Hero({ introDone = false }: HeroProps): JSX.Element {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-inner">
        <div className="hero-text">
          <StaggerHeadline
            words={[
              { text: 'Intelligence' },
              { text: 'that' },
              { text: 'takes' },
              { text: 'flight.', it: true },
            ]}
            accentIdx={-1}
            animate={introDone}
          />
        </div>
      </div>
    </section>
  );
}
