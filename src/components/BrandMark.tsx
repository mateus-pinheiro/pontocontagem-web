import React from 'react';

// Marca Ponto Contagem — stem vertical + ponto terracota.
// Geometria idêntica aos assets exportados (viewBox 0 0 100 100).

export function BrandMark({
  size = 28,
  stemColor = '#1a1a1a',
  dotColor = '#d97757',
}: {
  size?: number;
  stemColor?: string;
  dotColor?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <rect x="22" y="20" width="13" height="60" rx="6.5" fill={stemColor} />
      <circle cx="62" cy="38" r="18" fill={dotColor} />
    </svg>
  );
}

// Lockup horizontal: marca + wordmark "ponto contagem" (DM Sans 600,
// sentence case, tracking −2.5%).
export function BrandLockup({
  height = 22,
  color = '#1a1a1a',
  stemColor,
  dotColor = '#d97757',
}: {
  height?: number;
  color?: string;
  stemColor?: string;
  dotColor?: string;
}) {
  const fontSize = height * 0.86;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: height * 0.32,
        lineHeight: 1,
      }}
    >
      <BrandMark size={height} stemColor={stemColor ?? color} dotColor={dotColor} />
      <span
        style={{
          fontSize,
          fontWeight: 600,
          color,
          letterSpacing: -0.025 * fontSize,
        }}
      >
        ponto contagem
      </span>
    </div>
  );
}
