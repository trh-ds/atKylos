'use client';

import { JSX } from 'react';

export default function Footer(): JSX.Element {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="word">
              <span className="mini-bird">
                <img src="/logo.png" alt="atKylos" width={36} height={36} style={{ display: 'block', objectFit: 'contain' }} />
              </span>
              <span><span className="at-prefix">at</span>Kylos</span>
            </div>
            <p>An agentic AI and automation studio. We build the systems that flex, learn, and compound — so your team can do the work only humans can.</p>
          </div>
          <div className="footer-col">
            <h5>Services</h5>
            <ul>
              <li><a href="#capabilities">Agentic systems</a></li>
              <li><a href="#capabilities">Orchestration</a></li>
              <li><a href="#capabilities">Custom copilots</a></li>
              <li><a href="#capabilities">LLM ops</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Studio</h5>
            <ul>
              <li><a href="#process">Process</a></li>
              <li><a href="#cases">Work</a></li>
              <li><a href="#">Writing</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Contact</h5>
            <ul>
              <li><a href="mailto:hello@atkylos.studio">hello@atkylos.studio</a></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">Twitter / X</a></li>
              <li><a href="#">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 atKylos studio · Brooklyn × Bengaluru</span>
          <span>Built with intent · v0.4</span>
        </div>
      </div>
    </footer>
  );
}
