'use client';

import { useEffect } from 'react';

export default function useReveal(): void {
  useEffect(() => {
    const targets = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
}
