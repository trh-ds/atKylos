'use client';

import { useRef, useEffect, useState, useId, useCallback, useMemo, JSX } from 'react';

const INK = '#15130e';
const VOID = '#ebe5d4';
const DUST = 'rgba(21,19,14,0.42)';
const HALO = 'oklch(0.55 0.02 240)';

// atKylos atom — node + limb definitions (centered geometry, units in viewBox px)
const ATOM_NODES = [
  { x: 0,   y: 0,   r: 22 },   // 0 · core
  { x: -8,  y: -74, r: 16 },   // 1 · top limb
  { x: 60,  y: -38, r: 16 },   // 2 · upper-right limb
  { x: 54,  y: 52,  r: 16 },   // 3 · lower-right leg
  { x: -54, y: 52,  r: 16 },   // 4 · lower-left leg
  { x: -68, y: -22, r: 14 },   // 5 · upper-left limb
];
const ATOM_SATELLITE = { x: 96, y: -86, r: 9 };

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function deg(i: number, n: number): number { return (i / n) * 360; }

interface StickRingProps {
  count?: number;
  inner?: number;
  outer?: number;
  width?: number;
  color?: string;
  taper?: boolean;
  lengthFn?: ((i: number, n: number) => number) | null;
  opacityFn?: ((i: number, n: number) => number) | null;
}

function StickRing({ count = 64, inner = 70, outer = 120, width = 1.2, color = INK, taper = false, lengthFn = null, opacityFn = null }: StickRingProps): JSX.Element {
  const arr = Array.from({ length: count });
  return (
    <g>
      {arr.map((_, i) => {
        const a = (i / count) * Math.PI * 2;
        const len = lengthFn ? lengthFn(i, count) : 1;
        const r1 = inner;
        const r2 = inner + (outer - inner) * len;
        const x1 = Math.cos(a) * r1;
        const y1 = Math.sin(a) * r1;
        const x2 = Math.cos(a) * r2;
        const y2 = Math.sin(a) * r2;
        const op = opacityFn ? opacityFn(i, count) : 1;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={color} strokeWidth={taper ? width * (0.4 + len * 0.6) : width}
            strokeLinecap="round" opacity={op} />
        );
      })}
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// A · APERTURE — dense radial pulse
// ─────────────────────────────────────────────────────────────
interface MarkApertureProps {
  size?: number;
  spin?: boolean;
}

function MarkAperture({ size = 240, spin = true }: MarkApertureProps): JSX.Element {
  const s = size;
  return (
    <div style={{ width: s, height: s, position: 'relative' }}>
      <svg viewBox="-160 -160 320 320" width={s} height={s}
        style={{ animation: spin ? 'akSpin 28s linear infinite' : 'none', display: 'block' }}>
        <StickRing count={120} inner={42} outer={140} width={1.1}
          lengthFn={(i, n) => 0.55 + 0.45 * Math.abs(Math.sin((i / n) * Math.PI * 6))} />
        <StickRing count={60} inner={28} outer={48} width={0.8} color={DUST} />
        <circle cx="0" cy="0" r="6" fill={INK} />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// B · ORBIT — tangential stick wheel
// ─────────────────────────────────────────────────────────────
interface MarkOrbitProps {
  size?: number;
  spin?: boolean;
}

function MarkOrbit({ size = 240, spin = true }: MarkOrbitProps): JSX.Element {
  const s = size;
  const count = 72;
  return (
    <div style={{ width: s, height: s }}>
      <svg viewBox="-160 -160 320 320" width={s} height={s}
        style={{ animation: spin ? 'akSpin 36s linear infinite' : 'none', display: 'block' }}>
        <g>
          {Array.from({ length: count }).map((_, i) => {
            const a = (i / count) * Math.PI * 2;
            const r = 110;
            const cx = Math.cos(a) * r;
            const cy = Math.sin(a) * r;
            // tangent direction
            const tx = -Math.sin(a);
            const ty = Math.cos(a);
            const len = 22 + (i % 4 === 0 ? 14 : 0);
            const x1 = cx - tx * len / 2;
            const y1 = cy - ty * len / 2;
            const x2 = cx + tx * len / 2;
            const y2 = cy + ty * len / 2;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={INK} strokeWidth={i % 4 === 0 ? 1.6 : 1} strokeLinecap="round" />;
          })}
        </g>
        <StickRing count={48} inner={70} outer={86} width={0.7} color={DUST} />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// C · SPHERE — 3D wireframe sphere of stick meridians
// ─────────────────────────────────────────────────────────────
interface MarkSphereProps {
  size?: number;
  spin?: boolean;
}

function MarkSphere({ size = 240, spin = true }: MarkSphereProps): JSX.Element {
  const s = size;
  const meridians = 18;
  const rings = 9;
  const R = 130;
  return (
    <div style={{ width: s, height: s, perspective: 800 }}>
      <div style={{
        width: s, height: s,
        transformStyle: 'preserve-3d',
        animation: spin ? 'akSphere 24s linear infinite' : 'none'
      }}>
        <svg viewBox="-160 -160 320 320" width={s} height={s} style={{ display: 'block' }}>
          {/* latitude rings (ellipses simulating 3D) */}
          {Array.from({ length: rings }).map((_, i) => {
            const phi = ((i + 1) / (rings + 1)) * Math.PI;
            const ry = R * Math.sin(phi);
            const cy = -R * Math.cos(phi);
            const op = 0.25 + 0.6 * Math.sin(phi);
            return (
              <g key={`r${i}`}>
                {Array.from({ length: meridians * 2 }).map((_, j) => {
                  const a1 = (j / (meridians * 2)) * Math.PI * 2;
                  const a2 = ((j + 0.55) / (meridians * 2)) * Math.PI * 2;
                  const x1 = Math.cos(a1) * ry;
                  const y1 = cy + Math.sin(a1) * ry * 0.18;
                  const x2 = Math.cos(a2) * ry;
                  const y2 = cy + Math.sin(a2) * ry * 0.18;
                  return <line key={j} x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={INK} strokeWidth={0.9} strokeLinecap="round" opacity={op} />;
                })}
              </g>
            );
          })}
          {/* poles dot */}
          <circle cx="0" cy={-R} r="2" fill={INK} opacity="0.5" />
          <circle cx="0" cy={R} r="2" fill={INK} opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// D · PULSAR — depth-faded radial burst (3D feel via opacity)
// ─────────────────────────────────────────────────────────────
interface MarkPulsarProps {
  size?: number;
  spin?: boolean;
}

function MarkPulsar({ size = 240, spin = true }: MarkPulsarProps): JSX.Element {
  const s = size;
  return (
    <div style={{ width: s, height: s, position: 'relative' }}>
      <svg viewBox="-160 -160 320 320" width={s} height={s}
        style={{ animation: spin ? 'akSpinRev 40s linear infinite' : 'none', display: 'block' }}>
        {/* back layer (faded, longer) */}
        <g opacity="0.35">
          <StickRing count={48} inner={20} outer={150} width={0.8}
            lengthFn={(i, n) => 0.7 + 0.3 * Math.cos((i / n) * Math.PI * 4)} />
        </g>
        {/* mid */}
        <g opacity="0.7" transform="rotate(7)">
          <StickRing count={36} inner={32} outer={120} width={1}
            lengthFn={(i, n) => 0.5 + 0.5 * Math.sin((i / n) * Math.PI * 8)} />
        </g>
        {/* front (sharpest, shortest) */}
        <g transform="rotate(13)">
          <StickRing count={24} inner={40} outer={92} width={1.4} taper />
        </g>
        <circle cx="0" cy="0" r="3.5" fill={INK} />
        <circle cx="0" cy="0" r="14" fill="none" stroke={INK} strokeWidth="0.6" opacity="0.4" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// E · SPIRAL — galactic logarithmic arms
// ─────────────────────────────────────────────────────────────
interface MarkSpiralProps {
  size?: number;
  spin?: boolean;
}

function MarkSpiral({ size = 240, spin = true }: MarkSpiralProps): JSX.Element {
  const s = size;
  const arms = 3;
  const perArm = 60;
  return (
    <div style={{ width: s, height: s }}>
      <svg viewBox="-160 -160 320 320" width={s} height={s}
        style={{ animation: spin ? 'akSpin 50s linear infinite' : 'none', display: 'block' }}>
        {Array.from({ length: arms }).map((_, armI) => {
          const phase = (armI / arms) * Math.PI * 2;
          return (
            <g key={armI}>
              {Array.from({ length: perArm }).map((_, i) => {
                const t = i / perArm;
                const r = 18 + Math.pow(t, 0.85) * 130;
                const a = phase + t * Math.PI * 2.2;
                const cx = Math.cos(a) * r;
                const cy = Math.sin(a) * r;
                // stick perpendicular to spiral tangent
                const tangent = a + Math.PI / 2 + t * 0.4;
                const len = 6 + (1 - t) * 14;
                const tx = Math.cos(tangent);
                const ty = Math.sin(tangent);
                const op = 0.3 + 0.7 * (1 - t * 0.6);
                return (
                  <line key={i}
                    x1={cx - tx * len / 2} y1={cy - ty * len / 2}
                    x2={cx + tx * len / 2} y2={cy + ty * len / 2}
                    stroke={INK} strokeWidth={0.8 + (1 - t) * 0.8}
                    strokeLinecap="round" opacity={op} />
                );
              })}
            </g>
          );
        })}
        <circle cx="0" cy="0" r="5" fill={INK} />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// F · @-GLYPH — sticks tracing the @ orbit (the "at" in atKylos)
// ─────────────────────────────────────────────────────────────
interface MarkAtGlyphProps {
  size?: number;
  spin?: boolean;
}

function MarkAtGlyph({ size = 240, spin = true }: MarkAtGlyphProps): JSX.Element {
  const s = size;
  // Two concentric arcs + sticks tracing them
  const outer = 130;
  const inner = 56;
  return (
    <div style={{ width: s, height: s }}>
      <svg viewBox="-160 -160 320 320" width={s} height={s} style={{ display: 'block' }}>
        {/* outer arc 270° — sticks pointing inward */}
        <g style={{ animation: spin ? 'akSpin 32s linear infinite' : 'none', transformOrigin: 'center' }}>
          {Array.from({ length: 80 }).map((_, i) => {
            const t = i / 80;
            // arc from -45° around through 270°
            const a = -Math.PI * 0.25 + t * Math.PI * 1.6;
            const cx = Math.cos(a) * outer;
            const cy = Math.sin(a) * outer;
            const inX = Math.cos(a) * (outer - 14);
            const inY = Math.sin(a) * (outer - 14);
            return <line key={i} x1={cx} y1={cy} x2={inX} y2={inY}
              stroke={INK} strokeWidth={1} strokeLinecap="round" />;
          })}
        </g>
        {/* inner orbit — sticks tangential, counter-rotating */}
        <g style={{ animation: spin ? 'akSpinRev 18s linear infinite' : 'none', transformOrigin: 'center' }}>
          {Array.from({ length: 40 }).map((_, i) => {
            const a = (i / 40) * Math.PI * 2;
            const cx = Math.cos(a) * inner;
            const cy = Math.sin(a) * inner;
            const tx = -Math.sin(a);
            const ty = Math.cos(a);
            const len = 14;
            return <line key={i}
              x1={cx - tx * len / 2} y1={cy - ty * len / 2}
              x2={cx + tx * len / 2} y2={cy + ty * len / 2}
              stroke={INK} strokeWidth={1.1} strokeLinecap="round" />;
          })}
        </g>
        {/* the @ tail — short stick stub */}
        <g>
          {Array.from({ length: 22 }).map((_, i) => {
            const a = -Math.PI * 0.25 - (i / 22) * Math.PI * 0.45;
            const r1 = outer - 6 + i * 0.6;
            const r2 = outer + 14 + i * 0.9;
            const x1 = Math.cos(a) * r1;
            const y1 = Math.sin(a) * r1;
            const x2 = Math.cos(a) * r2;
            const y2 = Math.sin(a) * r2;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={INK} strokeWidth={0.9} strokeLinecap="round" opacity={0.85} />;
          })}
        </g>
        <circle cx="0" cy="0" r="3" fill={INK} />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HERO — large kinetic mark, layered Pulsar+Sphere feel
// ─────────────────────────────────────────────────────────────
interface MarkHeroProps {
  size?: number;
}

function MarkHero({ size = 520 }: MarkHeroProps): JSX.Element {
  return (
    <div style={{ width: size, height: size, perspective: 1400, position: 'relative' }}>
      <div style={{
        width: size, height: size, position: 'absolute', inset: 0,
        transformStyle: 'preserve-3d',
      }}>
        {/* tilted disk */}
        <div style={{
          position: 'absolute', inset: 0,
          transform: 'rotateX(62deg)',
          transformStyle: 'preserve-3d',
        }}>
          <div style={{ animation: 'akSpin 38s linear infinite', width: '100%', height: '100%' }}>
            <svg viewBox="-160 -160 320 320" width="100%" height="100%">
              <StickRing count={140} inner={56} outer={150} width={1}
                lengthFn={(i, n) => 0.45 + 0.55 * Math.abs(Math.sin((i / n) * Math.PI * 7))} />
              <StickRing count={70} inner={28} outer={50} width={0.8} color={DUST} />
            </svg>
          </div>
        </div>
        {/* front upright pulsar */}
        <div style={{ position: 'absolute', inset: 0, animation: 'akSpinRev 26s linear infinite' }}>
          <svg viewBox="-160 -160 320 320" width="100%" height="100%">
            <g opacity="0.85">
              <StickRing count={36} inner={20} outer={108} width={1.3} taper
                lengthFn={(i, n) => 0.55 + 0.45 * Math.cos((i / n) * Math.PI * 4)} />
            </g>
            <circle cx="0" cy="0" r="5" fill={INK} />
            <circle cx="0" cy="0" r="18" fill="none" stroke={INK} strokeWidth="0.6" opacity="0.4" />
            <circle cx="0" cy="0" r="155" fill="none" stroke={INK} strokeWidth="0.4" opacity="0.18" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// WORDMARK
// ─────────────────────────────────────────────────────────────
interface WordmarkProps {
  size?: number;
  weight?: number;
  kerning?: string;
}

function Wordmark({ size = 1, weight = 500, kerning = '-0.04em' }: WordmarkProps): JSX.Element {
  return (
    <div style={{
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: weight,
      fontSize: `${size}em`,
      letterSpacing: kerning,
      color: INK,
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: '0.05em',
      lineHeight: 1,
    }}>
      <span style={{ opacity: 0.45 }}>at</span>
      <span>Kylos</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// G · TAIJI — yin-yang built from sticks
// Two semicircular halves, counter-rotating, opposite weight.
// One half: light sticks on void.  Other half: void sticks on a light disc.
// ─────────────────────────────────────────────────────────────
interface MarkTaijiProps {
  size?: number;
  spin?: boolean;
}

function MarkTaiji({ size = 240, spin = true }: MarkTaijiProps): JSX.Element {
  const s = size;
  // sticks along a curved S-path of the taijitu
  const sticksHalf = 64;
  const R = 138;
  return (
    <div style={{ width: s, height: s, position: 'relative' }}>
      <svg viewBox="-160 -160 320 320" width={s} height={s} style={{ display: 'block' }}>
        <defs>
          {/* the classic taijitu mask: full circle minus the S-divider region */}
          <clipPath id="tj-light">
            {/* Right half of circle plus the small top bulge minus bottom bulge */}
            <path d={`
              M 0 ${-R}
              A ${R/2} ${R/2} 0 0 1 0 0
              A ${R/2} ${R/2} 0 0 0 0 ${R}
              A ${R} ${R} 0 0 1 0 ${-R}
              Z
            `} />
          </clipPath>
          <clipPath id="tj-dark">
            <path d={`
              M 0 ${-R}
              A ${R/2} ${R/2} 0 0 1 0 0
              A ${R/2} ${R/2} 0 0 0 0 ${R}
              A ${R} ${R} 0 0 0 0 ${-R}
              Z
            `} />
          </clipPath>
        </defs>

        {/* full disc fill = light (ink) — but only where clip says */}
        <g clipPath="url(#tj-light)">
          <circle cx="0" cy="0" r={R} fill={INK} />
        </g>

        {/* Light half: sticks are DARK on the cream disc, counter-rotating */}
        <g clipPath="url(#tj-light)"
          style={{ animation: spin ? 'akSpinRev 28s linear infinite' : 'none', transformOrigin: 'center' }}>
          {Array.from({ length: 140 }).map((_, i) => {
            const a = (i / 140) * Math.PI * 2;
            const r1 = 24;
            const r2 = 24 + (R - 24) * (0.55 + 0.45 * Math.abs(Math.sin(a * 6)));
            return <line key={`l${i}`}
              x1={Math.cos(a)*r1} y1={Math.sin(a)*r1}
              x2={Math.cos(a)*r2} y2={Math.sin(a)*r2}
              stroke={VOID} strokeWidth={1.1} strokeLinecap="round" />;
          })}
        </g>

        {/* Dark half: sticks are LIGHT on the void, rotating CW */}
        <g clipPath="url(#tj-dark)"
          style={{ animation: spin ? 'akSpin 28s linear infinite' : 'none', transformOrigin: 'center' }}>
          {Array.from({ length: 140 }).map((_, i) => {
            const a = (i / 140) * Math.PI * 2;
            const r1 = 24;
            const r2 = 24 + (R - 24) * (0.55 + 0.45 * Math.abs(Math.sin(a * 6)));
            return <line key={`d${i}`}
              x1={Math.cos(a)*r1} y1={Math.sin(a)*r1}
              x2={Math.cos(a)*r2} y2={Math.sin(a)*r2}
              stroke={INK} strokeWidth={1.1} strokeLinecap="round" />;
          })}
        </g>

        {/* the two eyes */}
        <circle cx="0" cy={-R/2} r="9" fill={VOID} />
        <circle cx="0" cy={R/2}  r="9" fill={INK} />
        {/* fine boundary */}
        <circle cx="0" cy="0" r={R} fill="none" stroke={INK} strokeWidth="0.5" opacity="0.4" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// H · DUALITY — two counter-rotating semicircular stick fans
// ─────────────────────────────────────────────────────────────
interface MarkDualityProps {
  size?: number;
  spin?: boolean;
}

function MarkDuality({ size = 240, spin = true }: MarkDualityProps): JSX.Element {
  const s = size;
  return (
    <div style={{ width: s, height: s, position: 'relative' }}>
      <svg viewBox="-160 -160 320 320" width={s} height={s} style={{ display: 'block' }}>
        {/* upper half — bright, spins CW */}
        <g style={{ animation: spin ? 'akSpin 22s linear infinite' : 'none', transformOrigin: 'center' }}>
          {Array.from({ length: 90 }).map((_, i) => {
            const t = i / 90;
            const a = -Math.PI + t * Math.PI; // top semicircle: π..2π → -π..0
            const r1 = 32;
            const r2 = 32 + 110 * (0.6 + 0.4 * Math.sin(t * Math.PI * 5));
            return <line key={i}
              x1={Math.cos(a)*r1} y1={Math.sin(a)*r1}
              x2={Math.cos(a)*r2} y2={Math.sin(a)*r2}
              stroke={INK} strokeWidth={1.1} strokeLinecap="round" />;
          })}
        </g>
        {/* lower half — faded, spins CCW */}
        <g style={{ animation: spin ? 'akSpinRev 22s linear infinite' : 'none', transformOrigin: 'center' }}>
          {Array.from({ length: 90 }).map((_, i) => {
            const t = i / 90;
            const a = t * Math.PI; // bottom semicircle
            const r1 = 32;
            const r2 = 32 + 110 * (0.6 + 0.4 * Math.sin(t * Math.PI * 5));
            return <line key={i}
              x1={Math.cos(a)*r1} y1={Math.sin(a)*r1}
              x2={Math.cos(a)*r2} y2={Math.sin(a)*r2}
              stroke={INK} strokeWidth={1.1} strokeLinecap="round" opacity={0.32} />;
          })}
        </g>
        {/* central dividing line — the seam */}
        <line x1={-148} y1="0" x2={148} y2="0" stroke={INK} strokeWidth="0.6" opacity="0.18" />
        <circle cx="0" cy="0" r="4" fill={INK} />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// I · ECLIPSE — two offset stick discs interlocking
// ─────────────────────────────────────────────────────────────
interface MarkEclipseProps {
  size?: number;
  spin?: boolean;
}

function MarkEclipse({ size = 240, spin = true }: MarkEclipseProps): JSX.Element {
  const s = size;
  return (
    <div style={{ width: s, height: s, position: 'relative' }}>
      <svg viewBox="-160 -160 320 320" width={s} height={s} style={{ display: 'block' }}>
        <defs>
          <clipPath id="ecl-left"><circle cx="-30" cy="0" r="115" /></clipPath>
          <clipPath id="ecl-right"><circle cx="30" cy="0" r="115" /></clipPath>
        </defs>
        {/* left disc: light bg, dark sticks */}
        <g clipPath="url(#ecl-left)">
          <circle cx="-30" cy="0" r="115" fill={INK} />
          <g style={{ animation: spin ? 'akSpin 30s linear infinite' : 'none', transformOrigin: 'center' }}>
            {Array.from({ length: 100 }).map((_, i) => {
              const a = (i / 100) * Math.PI * 2;
              const r1 = 20, r2 = 110;
              const len = 0.5 + 0.5 * Math.abs(Math.sin(a * 5));
              return <line key={i}
                x1={Math.cos(a)*r1} y1={Math.sin(a)*r1}
                x2={Math.cos(a)*(r1 + (r2-r1)*len)} y2={Math.sin(a)*(r1 + (r2-r1)*len)}
                stroke={VOID} strokeWidth={1} strokeLinecap="round" />;
            })}
          </g>
        </g>
        {/* right disc: dark bg (already void), light sticks */}
        <g clipPath="url(#ecl-right)">
          <g style={{ animation: spin ? 'akSpinRev 30s linear infinite' : 'none', transformOrigin: 'center' }}>
            {Array.from({ length: 100 }).map((_, i) => {
              const a = (i / 100) * Math.PI * 2;
              const r1 = 20, r2 = 110;
              const len = 0.5 + 0.5 * Math.abs(Math.sin(a * 5));
              return <line key={i}
                x1={Math.cos(a)*r1} y1={Math.sin(a)*r1}
                x2={Math.cos(a)*(r1 + (r2-r1)*len)} y2={Math.sin(a)*(r1 + (r2-r1)*len)}
                stroke={INK} strokeWidth={1} strokeLinecap="round" />;
            })}
          </g>
        </g>
        {/* hairline boundaries */}
        <circle cx="-30" cy="0" r="115" fill="none" stroke={INK} strokeWidth="0.5" opacity="0.25" />
        <circle cx="30"  cy="0" r="115" fill="none" stroke={INK} strokeWidth="0.5" opacity="0.25" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// J · GYRE — two interlocking S-curves of sticks (kinetic yin-yang)
// ─────────────────────────────────────────────────────────────
interface MarkGyreProps {
  size?: number;
  spin?: boolean;
}

function MarkGyre({ size = 240, spin = true }: MarkGyreProps): JSX.Element {
  const s = size;
  const N = 90;
  return (
    <div style={{ width: s, height: s, position: 'relative' }}>
      <svg viewBox="-160 -160 320 320" width={s} height={s}
        style={{ animation: spin ? 'akSpin 24s linear infinite' : 'none', display: 'block' }}>
        {/* arm A — log spiral 0..π */}
        {Array.from({ length: N }).map((_, i) => {
          const t = i / N;
          const r = 24 + Math.pow(t, 0.9) * 120;
          const a = t * Math.PI * 1.1;
          const cx = Math.cos(a) * r, cy = Math.sin(a) * r;
          const tang = a + Math.PI / 2;
          const len = 8 + (1 - t) * 16;
          return <line key={`a${i}`}
            x1={cx - Math.cos(tang)*len/2} y1={cy - Math.sin(tang)*len/2}
            x2={cx + Math.cos(tang)*len/2} y2={cy + Math.sin(tang)*len/2}
            stroke={INK} strokeWidth={1 + (1-t)*0.6} strokeLinecap="round" opacity={0.55 + (1-t)*0.45} />;
        })}
        {/* arm B — mirrored (rotated 180°) */}
        {Array.from({ length: N }).map((_, i) => {
          const t = i / N;
          const r = 24 + Math.pow(t, 0.9) * 120;
          const a = Math.PI + t * Math.PI * 1.1;
          const cx = Math.cos(a) * r, cy = Math.sin(a) * r;
          const tang = a + Math.PI / 2;
          const len = 8 + (1 - t) * 16;
          return <line key={`b${i}`}
            x1={cx - Math.cos(tang)*len/2} y1={cy - Math.sin(tang)*len/2}
            x2={cx + Math.cos(tang)*len/2} y2={cy + Math.sin(tang)*len/2}
            stroke={INK} strokeWidth={1 + (1-t)*0.6} strokeLinecap="round" opacity={(0.55 + (1-t)*0.45) * 0.45} />;
        })}
        {/* the two eyes */}
        <circle cx={Math.cos(0)*72} cy={Math.sin(0)*72} r="6" fill={INK} opacity="0.85" />
        <circle cx={Math.cos(Math.PI)*72} cy={Math.sin(Math.PI)*72} r="6" fill={INK} opacity="0.3" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// K · ATOM — the atKylos metaball glyph (5-limb + satellite)
// ─────────────────────────────────────────────────────────────
interface MarkAtomProps {
  size?: number;
  spin?: boolean;
  gooId?: string;
}

function MarkAtom({ size = 240, spin = false, gooId = 'goo-atom' }: MarkAtomProps): JSX.Element {
  const limbs = ATOM_NODES.slice(1).map((n, i) => ({ ...n, idx: i }));
  return (
    <div style={{ width: size, height: size }}>
      <svg viewBox="-160 -160 320 320" width={size} height={size} style={{ display: 'block' }}>
        <defs>
          <filter id={gooId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feColorMatrix in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -11" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
        <g filter={`url(#${gooId})`}
          style={{ animation: spin ? 'akSpin 80s linear infinite' : 'none', transformOrigin: 'center' }}>
          {limbs.map((n, i) => (
            <line key={`l${i}`} x1="0" y1="0" x2={n.x} y2={n.y}
              stroke={INK} strokeWidth="13" strokeLinecap="round" />
          ))}
          {ATOM_NODES.map((n, i) => (
            <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={INK} />
          ))}
        </g>
        {/* satellite stays separate (not merged into goo) */}
        <circle cx={ATOM_SATELLITE.x} cy={ATOM_SATELLITE.y} r={ATOM_SATELLITE.r} fill={INK} />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// L · ATOM PARTICLES — particle-cloud version, Canvas-driven
//
// mode:
//   'shimmer'  — particles always at target, gentle orbit + brownian wiggle
//   'assemble' — looping disperse → assemble → hold → disperse
// ─────────────────────────────────────────────────────────────
interface AtomParticlesProps {
  size?: number;
  count?: number;
  mode?: 'shimmer' | 'assemble';
  trails?: boolean;
}

function AtomParticles({ size = 520, count = 700, mode = 'shimmer', trails = true }: AtomParticlesProps): JSX.Element {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // ── Generate target points sampled from atom geometry
    // viewBox is -160..160 (320 wide); canvas is `size` wide
    const cx = size / 2, cy = size / 2;
    const k = size / 320;

    const nodes = ATOM_NODES.map(n => ({ ...n, weight: n.r * n.r }));
    const satellite = { ...ATOM_SATELLITE, weight: ATOM_SATELLITE.r * ATOM_SATELLITE.r * 0.7 };
    const allNodes = [...nodes, satellite];
    const limbs = nodes.slice(1).map(n => ({ x1: 0, y1: 0, x2: n.x, y2: n.y, w: 8 }));

    const nodeWeightSum = allNodes.reduce((s, n) => s + n.weight, 0);

    interface AtomTarget {
      tx: number;
      ty: number;
      size: number;
      satellite: boolean;
    }

    const targets: AtomTarget[] = [];
    for (let i = 0; i < count; i++) {
      const onNode = Math.random() < 0.62;
      if (onNode) {
        let r = Math.random() * nodeWeightSum;
        let picked = allNodes[0];
        for (const n of allNodes) { r -= n.weight; if (r <= 0) { picked = n; break; } }
        const a = Math.random() * Math.PI * 2;
        const rad = Math.sqrt(Math.random()) * picked.r;
        targets.push({
          tx: cx + (picked.x + Math.cos(a) * rad) * k,
          ty: cy + (picked.y + Math.sin(a) * rad) * k,
          size: 0.7 + Math.random() * 1.4,
          satellite: picked === satellite,
        });
      } else {
        const l = limbs[Math.floor(Math.random() * limbs.length)];
        const t = Math.random();
        const px = l.x1 + (l.x2 - l.x1) * t;
        const py = l.y1 + (l.y2 - l.y1) * t;
        const dx = l.x2 - l.x1, dy = l.y2 - l.y1;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len, ny = dx / len;
        const off = (Math.random() - 0.5) * l.w;
        targets.push({
          tx: cx + (px + nx * off) * k,
          ty: cy + (py + ny * off) * k,
          size: 0.6 + Math.random() * 1.1,
          satellite: false,
        });
      }
    }

    // ── Particle state
    interface AtomParticleState extends AtomTarget {
      x: number;
      y: number;
      vx: number;
      vy: number;
      phase: number;
      wiggleR: number;
      wiggleS: number;
    }

    const particles: AtomParticleState[] = targets.map((t) => {
      const startA = Math.random() * Math.PI * 2;
      const startR = (size * 0.4) + Math.random() * size * 0.5;
      const initX = mode === 'assemble'
        ? cx + Math.cos(startA) * startR
        : t.tx + (Math.random() - 0.5) * 14;
      const initY = mode === 'assemble'
        ? cy + Math.sin(startA) * startR
        : t.ty + (Math.random() - 0.5) * 14;
      return {
        ...t,
        x: initX, y: initY,
        vx: 0, vy: 0,
        phase: Math.random() * Math.PI * 2,
        wiggleR: 1.2 + Math.random() * 2.4,
        wiggleS: 0.4 + Math.random() * 0.8,
      };
    });

    const CYCLE = 7.5; // seconds for assemble cycle

    let t0 = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      const w = size, h = size;

      // background fade — creates trails
      if (trails) {
        ctx.fillStyle = 'rgba(235,229,212,0.18)';
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.clearRect(0, 0, w, h);
      }

      // global behavior — assemble cycle vs always-on shimmer
      let attract = 1;
      let disperse = 0;
      if (mode === 'assemble') {
        const phase = (t % CYCLE) / CYCLE; // 0..1
        // 0.00–0.10 dispersed (hold scatter)
        // 0.10–0.45 assemble (ramp attract up)
        // 0.45–0.85 hold + breathe
        // 0.85–1.00 disperse (push out)
        if (phase < 0.10) { attract = 0.005; disperse = 0; }
        else if (phase < 0.45) { attract = 0.005 + ((phase - 0.10) / 0.35) * 0.085; disperse = 0; }
        else if (phase < 0.85) { attract = 0.09; disperse = 0; }
        else { attract = 0.005; disperse = 1.0 * ((phase - 0.85) / 0.15); }
      } else {
        attract = 0.10;
      }

      ctx.fillStyle = '#15130e';
      for (const p of particles) {
        // orbit around target
        const orbit = p.wiggleR;
        const op = p.phase + t * p.wiggleS;
        const ox = Math.cos(op) * orbit;
        const oy = Math.sin(op) * orbit;
        const tx = p.tx + ox;
        const ty = p.ty + oy;
        const dx = tx - p.x;
        const dy = ty - p.y;
        p.vx += dx * attract;
        p.vy += dy * attract;
        if (disperse > 0) {
          // push outward from center
          const rx = p.x - cx, ry = p.y - cy;
          const rl = Math.hypot(rx, ry) || 1;
          p.vx += (rx / rl) * disperse * 1.2;
          p.vy += (ry / rl) * disperse * 1.2;
        }
        // brownian
        p.vx += (Math.random() - 0.5) * 0.08;
        p.vy += (Math.random() - 0.5) * 0.08;
        // damping
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [size, count, mode, trails]);

  return <canvas ref={ref} style={{ display: 'block', width: size, height: size }} />;
}

// ═════════════════════════════════════════════════════════════
// BLOOM — recreation of the user's 4-ellipse / 8-lobe mandala
// ═════════════════════════════════════════════════════════════
const BLOOM = {
  N_LOBES: 8,
  LOBE_R: 42,         // radius of each outer lobe-circle
  RING_R: 98,         // radius of the ring on which lobe centers sit
  INNER_HIDE_R: 70,   // mask radius — hides inner arc of each lobe-circle
  ELLIPSE_RX: 84,     // half-width of center ellipses
  ELLIPSE_RY: 34,     // half-height of center ellipses
  ELLIPSE_ANGLES: [0, 45, 90, 135] as number[],
  DOT_R: 5,
  DOT_DIST: 152,      // distance of cardinal dots from center
  STROKE: 4.5,
};

// ─────────────────────────────────────────────────────────────
// MarkBloom · static SVG version
// ─────────────────────────────────────────────────────────────
interface MarkBloomProps {
  size?: number;
  drawIn?: boolean;
  drawSeconds?: number;
}

function MarkBloom({ size = 320, drawIn = false, drawSeconds = 2.4 }: MarkBloomProps): JSX.Element {
  const id = useId();
  const maskId = `bloom-mask-${id}`;
  const B = BLOOM;
  const lobes = Array.from({ length: B.N_LOBES }).map((_, i) => {
    const a = (i / B.N_LOBES) * Math.PI * 2 - Math.PI / 2;
    return { x: Math.cos(a) * B.RING_R, y: Math.sin(a) * B.RING_R };
  });
  const dots = [0, 90, 180, 270].map((d) => {
    const a = (d * Math.PI) / 180 - Math.PI / 2;
    return { x: Math.cos(a) * B.DOT_DIST, y: Math.sin(a) * B.DOT_DIST };
  });
  // perimeters for stroke-dasharray draw-in
  const circumLobe = 2 * Math.PI * B.LOBE_R;
  // ellipse perimeter approx (Ramanujan)
  const a = B.ELLIPSE_RX, b = B.ELLIPSE_RY;
  const h = Math.pow(a - b, 2) / Math.pow(a + b, 2);
  const circumEllipse = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));

  return (
    <div style={{ width: size, height: size }}>
      <svg viewBox="-180 -180 360 360" width={size} height={size} style={{ display: 'block' }}>
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="-180" y="-180" width="360" height="360">
            <rect x="-180" y="-180" width="360" height="360" fill="white" />
            <circle cx="0" cy="0" r={B.INNER_HIDE_R} fill="black" />
          </mask>
          <style>{`
            .b-draw { stroke-dasharray: var(--len); stroke-dashoffset: var(--len); animation: bloomDraw ${drawSeconds}s cubic-bezier(.65,.05,.36,1) forwards; }
            .b-fade { opacity: 0; animation: bloomFade .6s ease-out forwards; }
            @keyframes bloomDraw { to { stroke-dashoffset: 0; } }
            @keyframes bloomFade { to { opacity: 1; } }
          `}</style>
        </defs>

        {/* Outer ring — 8 overlapping circles, inner portion masked */}
        <g mask={`url(#${maskId})`} fill="none" stroke={INK} strokeWidth={B.STROKE} strokeLinecap="round">
          {lobes.map((c, i) => (
            <circle key={`L${i}`} cx={c.x} cy={c.y} r={B.LOBE_R}
              className={drawIn ? 'b-draw' : ''}
              style={{ '--len': circumLobe, animationDelay: drawIn ? `${0.06 * i}s` : '0s' } as React.CSSProperties} />
          ))}
        </g>

        {/* Center — 4 ellipses at 0/45/90/135° */}
        <g fill="none" stroke={INK} strokeWidth={B.STROKE} strokeLinecap="round">
          {B.ELLIPSE_ANGLES.map((ang, i) => (
            <ellipse key={`E${i}`} cx="0" cy="0" rx={B.ELLIPSE_RX} ry={B.ELLIPSE_RY}
              transform={`rotate(${ang})`}
              className={drawIn ? 'b-draw' : ''}
              style={{ '--len': circumEllipse, animationDelay: drawIn ? `${0.55 + 0.12 * i}s` : '0s' } as React.CSSProperties} />
          ))}
        </g>

        {/* Cardinal dots */}
        <g fill={INK}>
          {dots.map((d, i) => (
            <circle key={`D${i}`} cx={d.x} cy={d.y} r={B.DOT_R}
              className={drawIn ? 'b-fade' : ''}
              style={{ animationDelay: drawIn ? `${1.6 + 0.08 * i}s` : '0s' }} />
          ))}
        </g>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BloomFluid · SVG metaballs swirl + merge + resolve into logo
// Loops: scatter → swirl → converge → reveal logo → hold → disperse
// ─────────────────────────────────────────────────────────────
interface BloomFluidProps {
  size?: number;
}

function BloomFluid({ size = 520 }: BloomFluidProps): JSX.Element {
  const id = useId();
  const [phase, setPhase] = useState(0); // 0..1 across the loop
  const CYCLE = 9.5; // seconds

  useEffect(() => {
    let raf: number;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = ((now - t0) / 1000) % CYCLE;
      setPhase(t / CYCLE);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const B = BLOOM;
  // Phase windows
  // 0.00-0.18 scattered swirl
  // 0.18-0.45 converge to anchors (blobs become lobe/petal seeds)
  // 0.45-0.55 logo lines draw in
  // 0.55-0.82 hold
  // 0.82-1.00 release (blobs disperse, lines fade)
  const p = phase;
  const easeInOut = (x: number): number => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

  // Convergence amount: 0 = scattered, 1 = at anchor positions
  let conv = 0;
  if (p < 0.18) conv = 0;
  else if (p < 0.45) conv = easeInOut((p - 0.18) / 0.27);
  else if (p < 0.82) conv = 1;
  else conv = 1 - easeInOut((p - 0.82) / 0.18);

  // Logo line reveal: 0 = hidden, 1 = drawn
  let reveal = 0;
  if (p < 0.42) reveal = 0;
  else if (p < 0.58) reveal = easeInOut((p - 0.42) / 0.16);
  else if (p < 0.82) reveal = 1;
  else reveal = 1 - easeInOut((p - 0.82) / 0.18);

  // 12 blobs — 8 destined for lobes, 4 for ellipse petal-tips
  interface BloomBlob {
    x: number;
    y: number;
    r: number;
    key: string;
  }

  const blobs: BloomBlob[] = [];
  const tNow = phase * Math.PI * 2;
  // Lobe blobs
  for (let i = 0; i < 8; i++) {
    const aTarget = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const tx = Math.cos(aTarget) * B.RING_R;
    const ty = Math.sin(aTarget) * B.RING_R;
    // scatter orbit: swirl on radius ~140, slowly orbiting
    const swirlR = 130 + 30 * Math.sin(phase * Math.PI * 4 + i);
    const swirlA = aTarget + tNow * 0.7 + i * 0.6;
    const sx = Math.cos(swirlA) * swirlR;
    const sy = Math.sin(swirlA) * swirlR;
    const x = sx + (tx - sx) * conv;
    const y = sy + (ty - sy) * conv;
    // size: small when scattered, big when settled
    const r = 14 + 14 * conv;
    blobs.push({ x, y, r, key: `lobe-${i}` });
  }
  // Petal-tip blobs (8 tips from the 4 ellipses' extremes)
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2; // 8 directions matching the 4 ellipses' tips
    const tx = Math.cos(ang) * B.ELLIPSE_RX;
    const ty = Math.sin(ang) * B.ELLIPSE_RX;
    // each ellipse tip is at distance ELLIPSE_RX from center along its rotation
    // Use offset orbit for scatter
    const swirlR = 55 + 25 * Math.sin(phase * Math.PI * 6 + i * 0.7);
    const swirlA = ang - tNow * 0.9 + i * 0.4;
    const sx = Math.cos(swirlA) * swirlR;
    const sy = Math.sin(swirlA) * swirlR;
    const x = sx + (tx - sx) * conv;
    const y = sy + (ty - sy) * conv;
    const r = 10 + 8 * conv;
    blobs.push({ x, y, r, key: `tip-${i}` });
  }
  // Cardinal dots
  for (let i = 0; i < 4; i++) {
    const ang = (i / 4) * Math.PI * 2 - Math.PI / 2;
    const tx = Math.cos(ang) * B.DOT_DIST;
    const ty = Math.sin(ang) * B.DOT_DIST;
    const sx = Math.cos(ang + tNow * 0.5) * (160 + 10 * Math.sin(phase * 7 + i));
    const sy = Math.sin(ang + tNow * 0.5) * (160 + 10 * Math.sin(phase * 7 + i));
    const x = sx + (tx - sx) * conv;
    const y = sy + (ty - sy) * conv;
    const r = 4 + 2 * conv;
    blobs.push({ x, y, r, key: `dot-${i}` });
  }

  const lobeCenters = Array.from({ length: B.N_LOBES }).map((_, i) => {
    const a = (i / B.N_LOBES) * Math.PI * 2 - Math.PI / 2;
    return { x: Math.cos(a) * B.RING_R, y: Math.sin(a) * B.RING_R };
  });

  return (
    <div style={{ width: size, height: size }}>
      <svg viewBox="-180 -180 360 360" width={size} height={size} style={{ display: 'block' }}>
        <defs>
          <filter id="bloomGoo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
          <mask id="bloomFluidMask" maskUnits="userSpaceOnUse" x="-180" y="-180" width="360" height="360">
            <rect x="-180" y="-180" width="360" height="360" fill="white" />
            <circle cx="0" cy="0" r={B.INNER_HIDE_R} fill="black" />
          </mask>
        </defs>

        {/* Fluid blobs (gooey-merged) */}
        <g filter="url(#bloomGoo)" opacity={1 - reveal * 0.55}>
          {blobs.map((b) => (
            <circle key={b.key} cx={b.x} cy={b.y} r={b.r} fill={INK} />
          ))}
        </g>

        {/* Logo strokes — fade in on reveal */}
        <g opacity={reveal} fill="none" stroke={INK} strokeWidth={B.STROKE} strokeLinecap="round">
          <g mask="url(#bloomFluidMask)">
            {lobeCenters.map((c, i) => (
              <circle key={`l${i}`} cx={c.x} cy={c.y} r={B.LOBE_R} />
            ))}
          </g>
          {B.ELLIPSE_ANGLES.map((ang, i) => (
            <ellipse key={`e${i}`} cx="0" cy="0" rx={B.ELLIPSE_RX} ry={B.ELLIPSE_RY}
              transform={`rotate(${ang})`} />
          ))}
        </g>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BloomParticles · canvas particle convergence to the Bloom shape
// ─────────────────────────────────────────────────────────────
interface BloomParticlesProps {
  size?: number;
  count?: number;
  mode?: 'assemble' | string;
  trails?: boolean;
}

function BloomParticles({ size = 520, count = 1100, mode = 'assemble', trails = true }: BloomParticlesProps): JSX.Element {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2;
    const k = size / 360; // viewBox scale

    const B = BLOOM;

    // ── Sample target points along the logo geometry
    interface BloomTarget {
      tx: number;
      ty: number;
      size: number;
    }

    const targets: BloomTarget[] = [];

    // Lobe circles — sample only visible arcs (outside INNER_HIDE_R)
    const lobeCenters = Array.from({ length: B.N_LOBES }).map((_, i) => {
      const a = (i / B.N_LOBES) * Math.PI * 2 - Math.PI / 2;
      return { x: Math.cos(a) * B.RING_R, y: Math.sin(a) * B.RING_R };
    });
    const lobeSamples = Math.floor(count * 0.55 / B.N_LOBES);
    for (const c of lobeCenters) {
      let placed = 0, attempts = 0;
      while (placed < lobeSamples && attempts < lobeSamples * 4) {
        attempts++;
        const a = Math.random() * Math.PI * 2;
        const px = c.x + Math.cos(a) * B.LOBE_R;
        const py = c.y + Math.sin(a) * B.LOBE_R;
        if (Math.hypot(px, py) < B.INNER_HIDE_R) continue;
        targets.push({
          tx: cx + px * k,
          ty: cy + py * k,
          size: 0.7 + Math.random() * 0.8,
        });
        placed++;
      }
    }

    // Ellipses — sample evenly
    const ellipseSamples = Math.floor(count * 0.35 / 4);
    for (const ang of B.ELLIPSE_ANGLES) {
      const rad = (ang * Math.PI) / 180;
      const cosA = Math.cos(rad), sinA = Math.sin(rad);
      for (let i = 0; i < ellipseSamples; i++) {
        const t = (i / ellipseSamples) * Math.PI * 2 + Math.random() * 0.02;
        const ex = Math.cos(t) * B.ELLIPSE_RX;
        const ey = Math.sin(t) * B.ELLIPSE_RY;
        // rotate
        const rx = ex * cosA - ey * sinA;
        const ry = ex * sinA + ey * cosA;
        targets.push({
          tx: cx + rx * k,
          ty: cy + ry * k,
          size: 0.6 + Math.random() * 0.7,
        });
      }
    }

    // Cardinal dots — small dense clusters
    const dots = [0, 90, 180, 270];
    const dotSamples = Math.floor(count * 0.08 / 4);
    for (const d of dots) {
      const a = (d * Math.PI) / 180 - Math.PI / 2;
      const dx = Math.cos(a) * B.DOT_DIST;
      const dy = Math.sin(a) * B.DOT_DIST;
      for (let i = 0; i < dotSamples; i++) {
        const aa = Math.random() * Math.PI * 2;
        const rr = Math.random() * B.DOT_R;
        targets.push({
          tx: cx + (dx + Math.cos(aa) * rr) * k,
          ty: cy + (dy + Math.sin(aa) * rr) * k,
          size: 0.8 + Math.random() * 0.8,
        });
      }
    }

    // ── Particle state
    interface BloomParticleState extends BloomTarget {
      x: number;
      y: number;
      vx: number;
      vy: number;
      phase: number;
      wiggleR: number;
      wiggleS: number;
    }

    const particles: BloomParticleState[] = targets.map((t) => {
      const startA = Math.random() * Math.PI * 2;
      const startR = (size * 0.45) + Math.random() * size * 0.5;
      const initX = mode === 'assemble'
        ? cx + Math.cos(startA) * startR
        : t.tx + (Math.random() - 0.5) * 18;
      const initY = mode === 'assemble'
        ? cy + Math.sin(startA) * startR
        : t.ty + (Math.random() - 0.5) * 18;
      return {
        ...t,
        x: initX, y: initY, vx: 0, vy: 0,
        phase: Math.random() * Math.PI * 2,
        wiggleR: 0.9 + Math.random() * 2.2,
        wiggleS: 0.4 + Math.random() * 0.8,
      };
    });

    const CYCLE = 8.5;
    let t0 = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      if (trails) {
        ctx.fillStyle = 'rgba(235,229,212,0.16)';
        ctx.fillRect(0, 0, size, size);
      } else {
        ctx.clearRect(0, 0, size, size);
      }

      let attract = 0.10;
      let disperse = 0;
      if (mode === 'assemble') {
        const phase = (t % CYCLE) / CYCLE;
        if (phase < 0.10) { attract = 0.005; disperse = 0; }
        else if (phase < 0.42) { attract = 0.005 + ((phase - 0.10) / 0.32) * 0.10; disperse = 0; }
        else if (phase < 0.82) { attract = 0.105; disperse = 0; }
        else { attract = 0.005; disperse = 1.1 * ((phase - 0.82) / 0.18); }
      }

      ctx.fillStyle = INK;
      for (const p of particles) {
        const orbit = p.wiggleR;
        const op = p.phase + t * p.wiggleS;
        const tx = p.tx + Math.cos(op) * orbit;
        const ty = p.ty + Math.sin(op) * orbit;
        p.vx += (tx - p.x) * attract;
        p.vy += (ty - p.y) * attract;
        if (disperse > 0) {
          const rx = p.x - cx, ry = p.y - cy;
          const rl = Math.hypot(rx, ry) || 1;
          p.vx += (rx / rl) * disperse * 1.2;
          p.vy += (ry / rl) * disperse * 1.2;
        }
        p.vx += (Math.random() - 0.5) * 0.08;
        p.vy += (Math.random() - 0.5) * 0.08;
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [size, count, mode, trails]);

  return <canvas ref={ref} style={{ display: 'block', width: size, height: size }} />;
}

// ─────────────────────────────────────────────────────────────
// AtomFluid · the bloom's metaball motion applied to the atom mark
// Loop: scatter swarm → swirl → migrate to nodes → limbs lock in
//       → hold/breathe → disperse outward → repeat
// ─────────────────────────────────────────────────────────────
interface AtomFluidProps {
  size?: number;
  withWord?: boolean;
  withHalo?: boolean;
}

function AtomFluid({ size = 520, withWord = false, withHalo = true }: AtomFluidProps): JSX.Element {
  const id = useId();
  const filterId = `atomFluidGoo-${id}`;
  const [phase, setPhase] = useState(0);
  const CYCLE = 8.5;

  useEffect(() => {
    let raf: number;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = ((now - t0) / 1000) % CYCLE;
      setPhase(t / CYCLE);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const p = phase;
  const easeInOut = (x: number): number => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

  // Convergence: 0 = scattered, 1 = at anchor
  let conv = 0;
  if (p < 0.13) conv = 0;
  else if (p < 0.45) conv = easeInOut((p - 0.13) / 0.32);
  else if (p < 0.82) conv = 1;
  else conv = 1 - easeInOut((p - 0.82) / 0.18);

  // Settled: when limbs reveal + satellite + word + halo all come online
  let settled = 0;
  if (p < 0.40) settled = 0;
  else if (p < 0.56) settled = easeInOut((p - 0.40) / 0.16);
  else if (p < 0.82) settled = 1;
  else settled = 1 - easeInOut((p - 0.82) / 0.18);

  const tNow = phase * Math.PI * 2;

  // 6 primary node blobs → atom node positions
  const nodeBlobs = ATOM_NODES.map((n, i) => {
    const swirlR = 95 + 35 * Math.sin(phase * Math.PI * 4 + i * 1.7);
    const swirlA = (i / ATOM_NODES.length) * Math.PI * 2 + tNow * 0.85 + i * 0.55;
    const sx = Math.cos(swirlA) * swirlR;
    const sy = Math.sin(swirlA) * swirlR;
    // breathing wiggle in settled state
    const breath = settled * 1.4;
    const wx = breath * Math.cos(phase * Math.PI * 6 + i * 1.7);
    const wy = breath * Math.sin(phase * Math.PI * 6 + i * 1.3);
    const x = sx + (n.x + wx - sx) * conv;
    const y = sy + (n.y + wy - sy) * conv;
    const r = n.r * (0.55 + 0.45 * conv);
    return { x, y, r };
  });

  // 12 dust blobs — swirl during scatter, fade out during converge
  const DUST_BLOBS = 12;
  const dustBlobs = Array.from({ length: DUST_BLOBS }).map((_, i) => {
    const baseR = 105 + 30 * Math.sin(phase * Math.PI * 5 + i * 0.9);
    const baseA = (i / DUST_BLOBS) * Math.PI * 2 + tNow * (0.55 + (i % 3) * 0.22) - i * 0.31;
    const x = Math.cos(baseA) * baseR;
    const y = Math.sin(baseA) * baseR;
    const r = (7 + 4 * Math.sin(phase * 7 + i)) * (1 - conv * 0.95);
    return { x, y, r };
  });

  // Satellite — separate blob, scatters along its own orbit then locks to ATOM_SATELLITE
  const satOrbitR = 130 + 18 * Math.sin(phase * Math.PI * 3);
  const satOrbitA = tNow * 1.25 + 2.1;
  const ssx = Math.cos(satOrbitA) * satOrbitR;
  const ssy = Math.sin(satOrbitA) * satOrbitR;
  const satX = ssx + (ATOM_SATELLITE.x - ssx) * conv;
  const satY = ssy + (ATOM_SATELLITE.y - ssy) * conv;
  const satR = ATOM_SATELLITE.r * (0.55 + 0.45 * conv);

  // Halo ring — appears briefly on settle moment as a "lock-in" pulse
  // peaks at p=0.50, fades by 0.65
  let haloPulse = 0;
  if (p > 0.42 && p < 0.62) {
    const t = (p - 0.42) / 0.20;
    haloPulse = Math.sin(t * Math.PI); // 0→1→0
  }

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg viewBox="-160 -160 320 320" width={size} height={size} style={{ display: 'block' }}>
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="blur" />
            <feColorMatrix in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>

        {/* Halo ring — lock-in pulse */}
        {withHalo && haloPulse > 0.01 && (
          <circle cx="0" cy="0" r={130 + 18 * haloPulse}
            fill="none" stroke={INK} strokeWidth="0.8"
            opacity={0.35 * (1 - haloPulse)} />
        )}

        {/* Gooey-merged atom group */}
        <g filter={`url(#${filterId})`}>
          {/* Limb lines fade in during settle, anchoring node-blobs together */}
          <g opacity={settled}>
            {ATOM_NODES.slice(1).map((n, i) => (
              <line key={`limb-${i}`} x1="0" y1="0" x2={n.x} y2={n.y}
                stroke={INK} strokeWidth="13" strokeLinecap="round" />
            ))}
          </g>
          {/* Node blobs — primary mass */}
          {nodeBlobs.map((b, i) => (
            <circle key={`node-${i}`} cx={b.x} cy={b.y} r={b.r} fill={INK} />
          ))}
          {/* Dust blobs — ambient swirl, fade out on converge */}
          {dustBlobs.map((b, i) => (
            <circle key={`dust-${i}`} cx={b.x} cy={b.y} r={b.r} fill={INK} />
          ))}
        </g>

        {/* Satellite — separate, not gooey-merged into the atom */}
        <circle cx={satX} cy={satY} r={satR} fill={INK} />
      </svg>

      {/* Wordmark — fades in with settled state */}
      {withWord && (
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: '8%', textAlign: 'center',
          opacity: settled, transform: `translateY(${(1 - settled) * 12}px)`,
          transition: 'none', pointerEvents: 'none',
        }}>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: Math.round(size * 0.135),
            fontWeight: 500, letterSpacing: '-0.04em', lineHeight: 1, color: INK,
          }}>
            <span style={{ opacity: 0.42 }}>at</span>Kylos
          </div>
          <div style={{ height: 10 }} />
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: Math.round(size * 0.022), letterSpacing: '0.32em',
            color: DUST, textTransform: 'uppercase',
          }}>
            converge · resolve · release
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// BIRD · the nature mark — "Soaring" eagle silhouette
// Front view · wings spread upward · symbol of freedom + flight
// ════════════════════════════════════════════════════════════

interface Point {
  x: number;
  y: number;
}

interface WingCurve {
  p0: Point;
  p1: Point;
  p2: Point;
}

interface BirdGeom {
  head: { cx: number; cy: number; r: number };
  body: { cx: number; cy: number; rx: number; ry: number };
  wingUpperR: WingCurve;
  wingLowerR: WingCurve;
  tail: number[][];
  shoulderR: Point;
}

// Quadratic Bezier eval
const qbez = (t: number, p0: Point, p1: Point, p2: Point): Point => ({
  x: (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x,
  y: (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y,
});

const BIRD: BirdGeom = {
  head: { cx: 0, cy: -100, r: 14 },
  body: { cx: 0, cy: -15, rx: 18, ry: 55 },
  wingUpperR: { p0: { x: 15, y: -78 }, p1: { x: 80, y: -150 }, p2: { x: 170, y: -128 } },
  wingLowerR: { p0: { x: 170, y: -128 }, p1: { x: 95, y: -55 }, p2: { x: 35, y: -30 } },
  tail: [[-10, 35], [-32, 100], [0, 80], [32, 100], [10, 35]],
  shoulderR: { x: 15, y: -78 },
};

// Sample N points within the bird's filled silhouette
function sampleBirdPoints(N: number): Point[] {
  const pts: Point[] = [];
  // Head (circle, filled)
  for (let i = 0; i < Math.floor(N * 0.06); i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * BIRD.head.r;
    pts.push({ x: BIRD.head.cx + Math.cos(a) * r, y: BIRD.head.cy + Math.sin(a) * r });
  }
  // Body (ellipse, filled)
  for (let i = 0; i < Math.floor(N * 0.12); i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random());
    pts.push({
      x: BIRD.body.cx + Math.cos(a) * r * BIRD.body.rx,
      y: BIRD.body.cy + Math.sin(a) * r * BIRD.body.ry,
    });
  }
  // Wings (both, filled between upper and lower curves)
  for (const side of [1, -1] as const) {
    for (let i = 0; i < Math.floor(N * 0.30); i++) {
      const t = Math.random();
      const u = qbez(t, BIRD.wingUpperR.p0, BIRD.wingUpperR.p1, BIRD.wingUpperR.p2);
      // Lower curve parametrized tip→shoulder; sample at (1-t) to align with upper
      const l = qbez(1 - t, BIRD.wingLowerR.p0, BIRD.wingLowerR.p1, BIRD.wingLowerR.p2);
      const e = Math.random();
      pts.push({ x: (u.x * (1 - e) + l.x * e) * side, y: u.y * (1 - e) + l.y * e });
    }
  }
  // Tail (V-shaped fan)
  for (let i = 0; i < Math.floor(N * 0.10); i++) {
    // Sample within the tail polygon: two triangles
    // L triangle: (-10,35) (-32,100) (0,80)
    // R triangle: (10,35) (32,100) (0,80)
    const right = Math.random() < 0.5;
    const verts = right
      ? [{ x: 10, y: 35 }, { x: 32, y: 100 }, { x: 0, y: 80 }]
      : [{ x: -10, y: 35 }, { x: -32, y: 100 }, { x: 0, y: 80 }];
    let u = Math.random(), v = Math.random();
    if (u + v > 1) { u = 1 - u; v = 1 - v; }
    const w = 1 - u - v;
    pts.push({
      x: verts[0].x * u + verts[1].x * v + verts[2].x * w,
      y: verts[0].y * u + verts[1].y * v + verts[2].y * w,
    });
  }
  return pts;
}

// ─────────────────────────────────────────────────────────────
// MarkBird — static SVG · optional wing-flap idle
// ─────────────────────────────────────────────────────────────
interface MarkBirdProps {
  size?: number;
  color?: string;
  animateWings?: boolean;
}

function MarkBird({ size = 240, color = INK, animateWings = false }: MarkBirdProps): JSX.Element {
  return (
    <div style={{ width: size, height: size }}>
      <svg viewBox="-200 -200 400 400" width={size} height={size} style={{ display: 'block', overflow: 'visible' }}>
        <style>{`
          @keyframes birdWingR { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-7deg); } }
          @keyframes birdWingL { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(7deg); } }
        `}</style>
        <g fill={color}>
          <path d="M 15 -78 Q 80 -150 170 -128 Q 95 -55 35 -30 Z"
            style={animateWings ? { transformOrigin: '15px -78px', animation: 'birdWingR 2.6s ease-in-out infinite' } : {}} />
          <path d="M -15 -78 Q -80 -150 -170 -128 Q -95 -55 -35 -30 Z"
            style={animateWings ? { transformOrigin: '-15px -78px', animation: 'birdWingL 2.6s ease-in-out infinite' } : {}} />
          <ellipse cx="0" cy="-15" rx="18" ry="55" />
          <circle cx="0" cy="-100" r="14" />
          <path d="M -10 35 L -32 100 L 0 80 L 32 100 L 10 35 Z" />
        </g>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BirdParticles — canvas particle morph
// Loop: scatter cloud → magnetic snap into bird → hold → release
// ─────────────────────────────────────────────────────────────
interface BirdParticlesProps {
  size?: number;
  count?: number;
  mode?: 'assemble' | string;
  trails?: boolean;
  bgColor?: string;
  particleColor?: string;
  species?: 'eagle' | 'hawk';
}

function BirdParticles({ size = 720, count = 1400, mode = 'assemble', trails = true,
  bgColor = 'rgba(0,0,0,0.18)', particleColor = '#F5F1E8', species = 'eagle' }: BirdParticlesProps): JSX.Element {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2;
    const k = (size * 0.92) / 400;

    const sampler = species === 'hawk' ? sampleHawkPoints : sampleBirdPoints;
    const localPts = sampler(count);

    interface BirdParticleState {
      tx: number;
      ty: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      phase: number;
      wiggleR: number;
      wiggleS: number;
    }

    const particles: BirdParticleState[] = localPts.map((p) => {
      const tx = cx + p.x * k;
      const ty = cy + p.y * k;
      const startA = Math.random() * Math.PI * 2;
      const startR = (size * 0.5) + Math.random() * size * 0.5;
      return {
        tx, ty,
        x: mode === 'assemble' ? cx + Math.cos(startA) * startR : tx + (Math.random() - 0.5) * 14,
        y: mode === 'assemble' ? cy + Math.sin(startA) * startR : ty + (Math.random() - 0.5) * 14,
        vx: 0, vy: 0,
        size: 0.7 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
        wiggleR: 0.8 + Math.random() * 2.0,
        wiggleS: 0.3 + Math.random() * 0.7,
      };
    });

    const CYCLE = 7.5;
    const t0 = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      if (trails) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
      } else {
        ctx.clearRect(0, 0, size, size);
      }

      let attract = 0.10;
      let disperse = 0;
      if (mode === 'assemble') {
        const phase = (t % CYCLE) / CYCLE;
        if (phase < 0.08) { attract = 0.003; disperse = 0; }
        else if (phase < 0.40) { attract = 0.003 + ((phase - 0.08) / 0.32) * 0.105; disperse = 0; }
        else if (phase < 0.82) { attract = 0.108; disperse = 0; }
        else { attract = 0.003; disperse = 1.2 * ((phase - 0.82) / 0.18); }
      }

      ctx.fillStyle = particleColor;
      for (const p of particles) {
        const op = p.phase + t * p.wiggleS;
        const tx = p.tx + Math.cos(op) * p.wiggleR;
        const ty = p.ty + Math.sin(op) * p.wiggleR;
        p.vx += (tx - p.x) * attract;
        p.vy += (ty - p.y) * attract;
        if (disperse > 0) {
          const rx = p.x - cx, ry = p.y - cy;
          const rl = Math.hypot(rx, ry) || 1;
          p.vx += (rx / rl) * disperse * 1.3;
          p.vy += (ry / rl) * disperse * 1.3;
        }
        p.vx += (Math.random() - 0.5) * 0.08;
        p.vy += (Math.random() - 0.5) * 0.08;
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [size, count, mode, trails, bgColor, particleColor, species]);

  return <canvas ref={ref} style={{ display: 'block', width: size, height: size }} />;
}

// ════════════════════════════════════════════════════════════
// HAWK · sharper silhouette · wings spread horizontally
// More angular than the eagle · "Hunter" stance
// ════════════════════════════════════════════════════════════
const HAWK: BirdGeom = {
  head: { cx: 0, cy: -88, r: 11 },
  body: { cx: 0, cy: -15, rx: 13, ry: 55 },
  wingUpperR: { p0: { x: 12, y: -58 }, p1: { x: 95, y: -88 }, p2: { x: 182, y: -54 } },
  wingLowerR: { p0: { x: 182, y: -54 }, p1: { x: 100, y: -22 }, p2: { x: 28, y: -15 } },
  tail: [[-14, 38], [-22, 88], [0, 78], [22, 88], [14, 38]],
  shoulderR: { x: 12, y: -58 },
};

function sampleHawkPoints(N: number): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i < Math.floor(N * 0.05); i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * HAWK.head.r;
    pts.push({ x: HAWK.head.cx + Math.cos(a) * r, y: HAWK.head.cy + Math.sin(a) * r });
  }
  for (let i = 0; i < Math.floor(N * 0.12); i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random());
    pts.push({
      x: HAWK.body.cx + Math.cos(a) * r * HAWK.body.rx,
      y: HAWK.body.cy + Math.sin(a) * r * HAWK.body.ry,
    });
  }
  for (const side of [1, -1] as const) {
    for (let i = 0; i < Math.floor(N * 0.32); i++) {
      const t = Math.random();
      const u = qbez(t, HAWK.wingUpperR.p0, HAWK.wingUpperR.p1, HAWK.wingUpperR.p2);
      const l = qbez(1 - t, HAWK.wingLowerR.p0, HAWK.wingLowerR.p1, HAWK.wingLowerR.p2);
      const e = Math.random();
      pts.push({ x: (u.x * (1 - e) + l.x * e) * side, y: u.y * (1 - e) + l.y * e });
    }
  }
  // Wedge tail (more compact than eagle's deep V)
  for (let i = 0; i < Math.floor(N * 0.09); i++) {
    const right = Math.random() < 0.5;
    const verts = right
      ? [{ x: 14, y: 38 }, { x: 22, y: 88 }, { x: 0, y: 78 }]
      : [{ x: -14, y: 38 }, { x: -22, y: 88 }, { x: 0, y: 78 }];
    let u = Math.random(), v = Math.random();
    if (u + v > 1) { u = 1 - u; v = 1 - v; }
    const w = 1 - u - v;
    pts.push({
      x: verts[0].x * u + verts[1].x * v + verts[2].x * w,
      y: verts[0].y * u + verts[1].y * v + verts[2].y * w,
    });
  }
  return pts;
}

interface MarkHawkProps {
  size?: number;
  color?: string;
  animateWings?: boolean;
}

function MarkHawk({ size = 240, color = INK, animateWings = false }: MarkHawkProps): JSX.Element {
  return (
    <div style={{ width: size, height: size }}>
      <svg viewBox="-200 -200 400 400" width={size} height={size} style={{ display: 'block', overflow: 'visible' }}>
        <style>{`
          @keyframes hawkWingR { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-4deg); } }
          @keyframes hawkWingL { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(4deg); } }
        `}</style>
        <g fill={color}>
          <path d="M 12 -58 Q 95 -88 182 -54 Q 100 -22 28 -15 Z"
            style={animateWings ? { transformOrigin: '12px -58px', animation: 'hawkWingR 2.6s ease-in-out infinite' } : {}} />
          <path d="M -12 -58 Q -95 -88 -182 -54 Q -100 -22 -28 -15 Z"
            style={animateWings ? { transformOrigin: '-12px -58px', animation: 'hawkWingL 2.6s ease-in-out infinite' } : {}} />
          <ellipse cx="0" cy="-15" rx="13" ry="55" />
          <circle cx="0" cy="-88" r="11" />
          <path d="M -14 38 L -22 88 L 0 78 L 22 88 L 14 38 Z" />
        </g>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BirdInFlight · solid bird, flapping wings, particle wake
// "Taking flight" — body hovers/drifts, wings flap, trail streams
// ─────────────────────────────────────────────────────────────
interface BirdInFlightProps {
  size?: number;
  species?: 'eagle' | 'hawk';
  particleColor?: string;
  fadeColor?: string;
  trailIntensity?: number;
  flapSpeed?: number;
  driftStrength?: number;
}

interface FlightParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
}

function BirdInFlight({
  size = 720,
  species = 'eagle',
  particleColor = '#F5F1E8',
  fadeColor = 'rgba(0,0,0,0.12)',
  trailIntensity = 1,
  flapSpeed = 1.5,
  driftStrength = 1,
}: BirdInFlightProps): JSX.Element {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2;
    const k = (size * 0.78) / 400; // leave room for wing extension

    const EAGLE: BirdGeom = {
      head: { cx: 0, cy: -100, r: 14 },
      body: { cx: 0, cy: -15, rx: 18, ry: 55 },
      wingUpperR: { p0: { x: 15, y: -78 }, p1: { x: 80, y: -150 }, p2: { x: 170, y: -128 } },
      wingLowerR: { p0: { x: 170, y: -128 }, p1: { x: 95, y: -55 }, p2: { x: 35, y: -30 } },
      tail: [[-10, 35], [-32, 100], [0, 80], [32, 100], [10, 35]],
      shoulderR: { x: 15, y: -78 },
    };
    const HAWK_GEOM: BirdGeom = {
      head: { cx: 0, cy: -88, r: 11 },
      body: { cx: 0, cy: -15, rx: 13, ry: 55 },
      wingUpperR: { p0: { x: 12, y: -58 }, p1: { x: 95, y: -88 }, p2: { x: 182, y: -54 } },
      wingLowerR: { p0: { x: 182, y: -54 }, p1: { x: 100, y: -22 }, p2: { x: 28, y: -15 } },
      tail: [[-14, 38], [-22, 88], [0, 78], [22, 88], [14, 38]],
      shoulderR: { x: 12, y: -58 },
    };
    const geom = species === 'hawk' ? HAWK_GEOM : EAGLE;

    const particles: FlightParticle[] = [];
    const t0 = performance.now();
    let raf: number;

    const drawWing = (sign: 1 | -1, wingAngle: number) => {
      // sign: +1 = right wing, -1 = left wing
      const pivot = { x: geom.shoulderR.x * sign, y: geom.shoulderR.y };
      ctx.save();
      ctx.translate(pivot.x, pivot.y);
      ctx.rotate((sign === 1 ? wingAngle : -wingAngle) * Math.PI / 180);
      ctx.translate(-pivot.x, -pivot.y);
      ctx.beginPath();
      ctx.moveTo(geom.wingUpperR.p0.x * sign, geom.wingUpperR.p0.y);
      ctx.quadraticCurveTo(geom.wingUpperR.p1.x * sign, geom.wingUpperR.p1.y,
                           geom.wingUpperR.p2.x * sign, geom.wingUpperR.p2.y);
      ctx.quadraticCurveTo(geom.wingLowerR.p1.x * sign, geom.wingLowerR.p1.y,
                           geom.wingLowerR.p2.x * sign, geom.wingLowerR.p2.y);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawBird = (offX: number, offY: number, wingAngle: number) => {
      ctx.save();
      ctx.translate(cx + offX, cy + offY);
      ctx.scale(k, k);
      ctx.fillStyle = particleColor;

      // Body
      ctx.beginPath();
      ctx.ellipse(geom.body.cx, geom.body.cy, geom.body.rx, geom.body.ry, 0, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.beginPath();
      ctx.arc(geom.head.cx, geom.head.cy, geom.head.r, 0, Math.PI * 2);
      ctx.fill();

      // Tail
      ctx.beginPath();
      const t = geom.tail;
      ctx.moveTo(t[0][0], t[0][1]);
      for (let i = 1; i < t.length; i++) ctx.lineTo(t[i][0], t[i][1]);
      ctx.closePath();
      ctx.fill();

      // Wings (rotated around shoulder pivots)
      drawWing(1, wingAngle);   // right
      drawWing(-1, wingAngle);  // left (drawWing mirrors internally)

      ctx.restore();
    };

    // Compute world-space wingtip for particle emission
    const computeWingtipWorld = (sign: 1 | -1, wingAngle: number, offX: number, offY: number) => {
      const pivot = { x: geom.shoulderR.x * sign, y: geom.shoulderR.y };
      const tip = { x: geom.wingUpperR.p2.x * sign, y: geom.wingUpperR.p2.y };
      const dx = tip.x - pivot.x;
      const dy = tip.y - pivot.y;
      const ang = (sign === 1 ? wingAngle : -wingAngle) * Math.PI / 180;
      const c = Math.cos(ang), s = Math.sin(ang);
      const rx = dx * c - dy * s;
      const ry = dx * s + dy * c;
      return {
        x: cx + offX + (pivot.x + rx) * k,
        y: cy + offY + (pivot.y + ry) * k,
      };
    };

    const tick = (now: number) => {
      const t = (now - t0) / 1000;

      // Trail fade
      ctx.fillStyle = fadeColor;
      ctx.fillRect(0, 0, size, size);

      // Bird hover drift (gentle figure-8-ish path)
      const offX = Math.sin(t * 0.35) * 32 * driftStrength;
      const offY = Math.cos(t * 0.55) * 22 * driftStrength;

      // Wing flap — asymmetric for dramatic effect
      const flapPhase = t * flapSpeed * Math.PI * 2;
      const wingMod = Math.sin(flapPhase);
      let wingAngle: number;
      if (wingMod > 0) {
        wingAngle = -42 * Math.pow(wingMod, 0.55);  // upstroke: dramatic raise
      } else {
        wingAngle = 14 * Math.pow(-wingMod, 1.6);   // downstroke: quick plunge
      }
      // Body bob (slight rise at peak upstroke)
      const bodyBob = -wingMod * 5;

      // Emit particles from wingtips during downstroke power moment
      if (wingMod < -0.45 && Math.random() < 0.85 * trailIntensity) {
        const tipR = computeWingtipWorld(1, wingAngle, offX, offY + bodyBob);
        const tipL = computeWingtipWorld(-1, wingAngle, offX, offY + bodyBob);
        for (let i = 0; i < 2; i++) {
          for (const tip of [tipR, tipL]) {
            particles.push({
              x: tip.x + (Math.random() - 0.5) * 8,
              y: tip.y + (Math.random() - 0.5) * 8,
              vx: (Math.random() - 0.5) * 0.5,
              vy: 0.3 + Math.random() * 0.8,
              age: 0,
              life: 1.4 + Math.random() * 0.8,
              size: 0.9 + Math.random() * 1.2,
            });
          }
        }
      }

      // Continuous tail-wake emission
      if (Math.random() < 0.35 * trailIntensity) {
        const tailY = cy + offY + bodyBob + 85 * k;
        particles.push({
          x: cx + offX + (Math.random() - 0.5) * 20,
          y: tailY + (Math.random() - 0.5) * 14,
          vx: (Math.random() - 0.5) * 0.25,
          vy: 0.25 + Math.random() * 0.6,
          age: 0,
          life: 1.8 + Math.random() * 0.4,
          size: 0.6 + Math.random() * 0.7,
        });
      }

      // Update + draw particles (under bird)
      const dt = 1 / 60;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += dt;
        if (p.age >= p.life) { particles.splice(i, 1); continue; }
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.0035;
        const alpha = (1 - p.age / p.life) * 0.78;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Bird on top
      drawBird(offX, offY + bodyBob, wingAngle);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [size, species, particleColor, fadeColor, trailIntensity, flapSpeed, driftStrength]);

  return <canvas ref={ref} style={{ display: 'block', width: size, height: size }} />;
}

export {
  MarkAperture, MarkOrbit, MarkSphere, MarkPulsar, MarkSpiral, MarkAtGlyph,
  MarkTaiji, MarkDuality, MarkEclipse, MarkGyre,
  MarkHero, Wordmark,
  MarkAtom, AtomParticles, AtomFluid, ATOM_NODES, ATOM_SATELLITE,
  MarkBloom, BloomFluid, BloomParticles, BLOOM,
  MarkBird, BirdParticles, BIRD, sampleBirdPoints,
  MarkHawk, sampleHawkPoints,
  BirdInFlight,
  INK, VOID, DUST, HALO,
};
