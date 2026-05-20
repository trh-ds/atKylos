'use client';

import { JSX } from 'react';

export default function Cases(): JSX.Element {
  return (
    <section className="section" id="cases">
      <div className="wrap">
        <div className="section-head">
          <div className="lead">
            <span className="eyebrow reveal"><span className="dot"></span>Selected work</span>
            <h2 className="h-section reveal" data-d="1">
              Systems we've put <span className="it">in flight.</span>
            </h2>
          </div>
          <p className="copy reveal" data-d="2">
            Three of the agentic workflows we've shipped this year. Each one started with a bottleneck, became a system, and is still learning.
          </p>
        </div>

        <div className="cases-row">
          <article className="case-card reveal" data-d="1">
            <span className="tag">Featured · B2B SaaS</span>
            <h4>From 400-hour onboarding to a <span className="it">six-day glide path.</span></h4>
            <p className="blurb">
              A multi-agent system that drafts integration plans, runs sandbox tests, and hands off to humans only when needed. The customer success team now ships 14 onboardings/week with the same headcount.
            </p>
            <div className="results">
              <div className="result"><div className="val">98<span className="it">×</span></div><div className="lbl">Faster onboarding</div></div>
              <div className="result"><div className="val">14<span style={{ fontFamily: 'inherit' }}>/wk</span></div><div className="lbl">Sustained throughput</div></div>
              <div className="result"><div className="val">$420k</div><div className="lbl">Annual ops saved</div></div>
            </div>
            <a className="read-more" href="#">Read the case <span className="arr">→</span></a>
          </article>

          <div className="case-mini">
            <article className="case-card reveal" data-d="2">
              <span className="tag">Fintech</span>
              <h4>Risk memos <span className="it">in 90 seconds.</span></h4>
              <a className="read-more" href="#">Read <span className="arr">→</span></a>
            </article>
            <article className="case-card reveal" data-d="3">
              <span className="tag">E-commerce</span>
              <h4>A copilot that <span className="it">never sleeps.</span></h4>
              <a className="read-more" href="#">Read <span className="arr">→</span></a>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
