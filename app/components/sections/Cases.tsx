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
              Two problems. <span className="it">Two working systems.</span>
            </h2>
          </div>
          <p className="copy reveal" data-d="2">
            We're early-stage and we'll say it plainly. Here's what we've shipped so far — real projects, real code, real outcomes.
          </p>
        </div>

        <div className="cases-row">
          <article className="case-card reveal" data-d="1">
            <span className="tag">Featured · Agentic AI · Computer Vision</span>
            <h4>MARG ERP <span className="it">report generation, fully automated.</span></h4>
            <p className="blurb">
              MARG ERP has no public API — reports are buried inside a GUI built for humans. We built a computer vision agent that reads the screen, identifies the correct buttons and menus for each report type, navigates the UI autonomously, and exports all four report types on demand. Configuration lives in a simple <code>config.json</code> — no code changes needed to adjust report flows.
            </p>
            <div className="results">
              <div className="result"><div className="val">4</div><div className="lbl">Report types automated</div></div>
              <div className="result"><div className="val">0</div><div className="lbl">Manual clicks required</div></div>
              <div className="result"><div className="val">100<span style={{ fontFamily: 'inherit' }}>%</span></div><div className="lbl">Config-driven setup</div></div>
            </div>
            <a className="read-more" href="#">Read the case <span className="arr">→</span></a>
          </article>

          <article className="case-card reveal" data-d="2">
            <span className="tag">Computer Vision · ML Engineering</span>
            <h4>Image-based <span className="it">visual search engine.</span></h4>
            <p className="blurb">
              Built a visual search engine that lets users search by uploading an image instead of typing keywords. The system extracts visual embeddings, indexes them efficiently, and returns visually similar results in real time. Useful for e-commerce, inventory management, and content discovery.
            </p>
            <div className="results">
              <div className="result"><div className="val">&lt;1s</div><div className="lbl">Query response</div></div>
              <div className="result"><div className="val">1k+</div><div className="lbl">Images indexed</div></div>
              <div className="result"><div className="val">Real-<span className="it">time</span></div><div className="lbl">Live results</div></div>
            </div>
            <a className="read-more" href="#">Read the case <span className="arr">→</span></a>
          </article>
        </div>
      </div>
    </section>
  );
}
