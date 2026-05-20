'use client';

import { JSX } from 'react';

export default function CTA(): JSX.Element {
  return (
    <section className="cta-section" id="contact">
      <div className="wrap cta-inner">
        <span className="eyebrow reveal"><span className="dot"></span>Let's build</span>
        <h2 className="cta-headline reveal" data-d="1">
          Your next system <span className="it">is already alive.</span><br />
          <span className="accent">It just needs to take shape.</span>
        </h2>
        <p className="cta-sub reveal" data-d="2">
          30-minute discovery call. We'll map your highest-leverage agentic opportunity in real time. No deck. No nonsense.
        </p>
        <div className="reveal" data-d="3" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#" className="btn btn-primary">Book a call <span className="arr">→</span></a>
          <a href="mailto:hello@atkylos.studio" className="btn btn-ghost">hello@atkylos.studio</a>
        </div>
      </div>
    </section>
  );
}
