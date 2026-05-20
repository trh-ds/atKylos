'use client';

import { JSX } from 'react';

export default function Nav(): JSX.Element {
  return (
    <nav className="nav">
      <a href="#top" className="nav-brand">
        <span className="mini-bird">
          <img src="/logo.png" alt="atKylos" width={28} height={28} style={{ display: 'block', objectFit: 'contain' }} />
        </span>
        <span><span className="at-prefix">at</span>Kylos</span>
      </a>
      <div className="nav-links">
        <a href="#capabilities">Capabilities</a>
        <a href="#process">Process</a>
        <a href="#cases">Work</a>
        <a href="#contact">Contact</a>
      </div>
      <a href="#contact" className="btn btn-primary">
        Book a call <span className="arr">→</span>
      </a>
    </nav>
  );
}
