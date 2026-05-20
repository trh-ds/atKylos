'use client';

import { JSX } from 'react';

export default function TrustBar(): JSX.Element {
  return (
    <div className="trust-bar">
      <div className="wrap trust-row">
        <div className="trust-label">Operating partners & references</div>
        <div className="trust-logos">
          <span className="logo">helix▽labs</span>
          <span className="logo">Northbound</span>
          <span className="logo">Quanta⌁io</span>
          <span className="logo">Sablefield</span>
          <span className="logo">Verge&nbsp;OS</span>
        </div>
      </div>
    </div>
  );
}
