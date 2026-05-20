'use client';

import { JSX } from 'react';
import StaggerHeadline from '../StaggerHeadline';

export default function Hero(): JSX.Element {
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
          />
        </div>
      </div>
    </section>
  );
}
