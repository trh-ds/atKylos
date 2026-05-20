'use client';

import { JSX } from 'react';

export default function CTA(): JSX.Element {
  return (
    <section className="cta-section" id="contact">
      <div className="wrap cta-inner">
        <span className="eyebrow reveal"><span className="dot"></span>Let's build</span>
        <h2 className="cta-headline reveal" data-d="1">
          Got a hard engineering<br />
          <span className="it">problem?</span><br />
          <span className="accent">That's exactly what we're for.</span>
        </h2>
        <p className="cta-sub reveal" data-d="2">
          30 minutes. We'll look at your problem, tell you how we'd approach it, and give you a straight answer on whether we're the right fit. No pitch deck. No vague proposals.
        </p>
        <div className="reveal" data-d="3" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="mailto:nealatkylos@outlook.com,tirthatkylos@outlook.com?subject=Project%20Inquiry" className="btn btn-primary">Book a Discovery Call <span className="arr">→</span></a>
          <a href="mailto:nealatkylos@outlook.com,tirthatkylos@outlook.com?subject=Project%20Inquiry" className="btn btn-ghost">hello@atkylos.studio</a>
        </div>
      </div>
    </section>
  );
}
