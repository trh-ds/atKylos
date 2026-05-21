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
            <p>An emerging engineering studio building AI systems, connected hardware, and full-stack products. From Ahmedabad, for the world.</p>
          </div>
          <div className="footer-col">
            <h5>Services</h5>
            <ul>
              <li><a href="#capabilities">Full Stack & DevOps</a></li>
              <li><a href="#capabilities">App Development</a></li>
              <li><a href="#capabilities">IoT Systems</a></li>
              <li><a href="#capabilities">Agentic AI</a></li>
              <li><a href="#capabilities">Computer Vision</a></li>
              <li><a href="#capabilities">ML Engineering</a></li>
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
              <li><a href="mailto:nealatkylos@outlook.com,tirthatkylos@outlook.com?subject=Project%20Inquiry">Contact Us</a></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">Twitter / X</a></li>
              <li><a href="#">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 atKylos Studio · Ahmedabad, India</span>
          <span>Built with intent · v0.4</span>
        </div>
      </div>
    </footer>
  );
}
