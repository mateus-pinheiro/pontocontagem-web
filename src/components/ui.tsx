'use client';

// Primitivas do painel — porte fiel de web-ui.jsx (Claude Design handoff).
// Estilos inline preservados pixel a pixel; só tipados e em React/TSX.

import React from 'react';
import { WT } from '@/lib/theme';

type CSS = React.CSSProperties;

// ── Icons ────────────────────────────────────────────────────────────────
type IconName =
  | 'dashboard' | 'people' | 'box' | 'list' | 'clipboard' | 'clock' | 'chart'
  | 'shield' | 'plus' | 'minus' | 'search' | 'filter' | 'chevronDown'
  | 'chevronUp' | 'chevronLeft' | 'chevronRight' | 'close' | 'check' | 'edit'
  | 'trash' | 'download' | 'upload' | 'moreH' | 'moreV' | 'grip' | 'arrowLeft'
  | 'arrowRight' | 'arrowUp' | 'arrowDown' | 'warn' | 'info' | 'enter' | 'exit'
  | 'pause' | 'play' | 'eye' | 'eyeOff' | 'calendar' | 'bell' | 'settings'
  | 'refresh' | 'key' | 'dot' | 'cloud';

export function WIcon({
  name,
  size = 18,
  color = 'currentColor',
  strokeWidth = 1.75,
}: {
  name: IconName | string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const s: CSS = { width: size, height: size, display: 'block', flexShrink: 0 };
  const c = {
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const P: Record<string, React.ReactNode> = {
    dashboard: <g {...c}><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></g>,
    people: <g {...c}><circle cx="9" cy="9" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="8" r="2.5"/><path d="M15 14a5 5 0 0 1 6 5"/></g>,
    box: <g {...c}><path d="M4 8l8-4 8 4-8 4-8-4z"/><path d="M4 8v8l8 4 8-4V8"/><path d="M12 12v8"/></g>,
    list: <g {...c}><path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1" fill={color}/><circle cx="4" cy="12" r="1" fill={color}/><circle cx="4" cy="18" r="1" fill={color}/></g>,
    clipboard: <g {...c}><rect x="6" y="4" width="12" height="17" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 11h6M9 15h6M9 19h3"/></g>,
    clock: <g {...c}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g>,
    chart: <g {...c}><path d="M3 20V4M3 20h18"/><path d="M7 16v-4M11 16V8M15 16v-6M19 16v-2"/></g>,
    shield: <g {...c}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></g>,
    plus: <path d="M12 5v14M5 12h14" {...c}/>,
    minus: <path d="M5 12h14" {...c}/>,
    search: <g {...c}><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></g>,
    filter: <path d="M4 5h16l-6 8v6l-4-2v-4L4 5z" {...c}/>,
    chevronDown: <path d="M6 10l6 6 6-6" {...c}/>,
    chevronUp: <path d="M6 14l6-6 6 6" {...c}/>,
    chevronLeft: <path d="M15 6l-6 6 6 6" {...c}/>,
    chevronRight: <path d="M9 6l6 6-6 6" {...c}/>,
    close: <path d="M6 6l12 12M18 6l-12 12" {...c}/>,
    check: <path d="M5 12l4 4 10-10" {...c}/>,
    edit: <g {...c}><path d="M4 20l4-1L20 7l-3-3L5 16l-1 4z"/><path d="M14 6l3 3"/></g>,
    trash: <g {...c}><path d="M4 7h16M10 4h4l1 3H9l1-3z"/><path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/><path d="M10 11v8M14 11v8"/></g>,
    download: <g {...c}><path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 20h16"/></g>,
    upload: <g {...c}><path d="M12 20V8M7 13l5-5 5 5"/><path d="M4 4h16"/></g>,
    moreH: <g {...c}><circle cx="6" cy="12" r="1.5" fill={color}/><circle cx="12" cy="12" r="1.5" fill={color}/><circle cx="18" cy="12" r="1.5" fill={color}/></g>,
    moreV: <g {...c}><circle cx="12" cy="6" r="1.5" fill={color}/><circle cx="12" cy="12" r="1.5" fill={color}/><circle cx="12" cy="18" r="1.5" fill={color}/></g>,
    grip: <g {...c}><circle cx="9" cy="6" r="1" fill={color}/><circle cx="15" cy="6" r="1" fill={color}/><circle cx="9" cy="12" r="1" fill={color}/><circle cx="15" cy="12" r="1" fill={color}/><circle cx="9" cy="18" r="1" fill={color}/><circle cx="15" cy="18" r="1" fill={color}/></g>,
    arrowLeft: <path d="M19 12H5M12 5l-7 7 7 7" {...c}/>,
    arrowRight: <path d="M5 12h14M12 5l7 7-7 7" {...c}/>,
    arrowUp: <path d="M12 19V5M5 12l7-7 7 7" {...c}/>,
    arrowDown: <path d="M12 5v14M5 12l7 7 7-7" {...c}/>,
    warn: <g {...c}><path d="M12 4l10 17H2L12 4z"/><path d="M12 10v5M12 18v.5"/></g>,
    info: <g {...c}><circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7v.5"/></g>,
    enter: <g {...c}><path d="M3 12h13M12 8l4 4-4 4"/><path d="M16 4h4v16h-4"/></g>,
    exit: <g {...c}><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M9 12h12M17 8l4 4-4 4"/></g>,
    pause: <g {...c}><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></g>,
    play: <path d="M7 5l11 7-11 7V5z" {...c}/>,
    eye: <g {...c}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></g>,
    eyeOff: <g {...c}><path d="M3 3l18 18"/><path d="M9.9 5.1A10.3 10.3 0 0 1 12 5c6 0 10 7 10 7a16.7 16.7 0 0 1-3.4 4M6.6 6.6A16.7 16.7 0 0 0 2 12s4 7 10 7a10.3 10.3 0 0 0 5-1.3"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></g>,
    calendar: <g {...c}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></g>,
    bell: <g {...c}><path d="M6 16V11a6 6 0 0 1 12 0v5l1 2H5l1-2z"/><path d="M10 20a2 2 0 0 0 4 0"/></g>,
    cloud: <g {...c}><path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.5A3.5 3.5 0 0 1 17 18H7z"/></g>,
    settings: <g {...c}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h.1a1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></g>,
    refresh: <g {...c}><path d="M21 4v6h-6"/><path d="M3 20v-6h6"/><path d="M3 14a9 9 0 0 0 14.5 4.5L21 14M21 10A9 9 0 0 0 6.5 5.5L3 10"/></g>,
    key: <g {...c}><circle cx="7" cy="15" r="3"/><path d="M9.3 12.7L20 2l3 3-2 2-2-2-2 2-2-2-3 3z"/></g>,
    dot: <circle cx="12" cy="12" r="3" fill={color} stroke="none"/>,
  };
  return (
    <svg viewBox="0 0 24 24" style={s} aria-hidden="true">
      {P[name] ?? P.dot}
    </svg>
  );
}

// ── Avatar ───────────────────────────────────────────────────────────────
const AVATAR_C: [string, string][] = [
  ['#fbe6da', '#8a3d1f'], ['#e3efe7', '#1c4d31'], ['#e6e3f5', '#3a2f7a'],
  ['#f5e3d8', '#7a4a1f'], ['#dfe8f0', '#1f4a6e'], ['#f0e6e3', '#6e3a3a'],
  ['#e8e1d4', '#5a4818'],
];

export function WAvatar({
  name,
  size = 32,
  photo = false,
}: {
  name: string;
  size?: number;
  photo?: boolean;
}) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((s) => s[0])
    .join('')
    .toUpperCase();
  const idx = (name.charCodeAt(0) + name.length) % AVATAR_C.length;
  const [bg, fg] = AVATAR_C[idx];
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        background: photo ? '#d4cfc6' : bg, color: fg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: WT.font, fontWeight: 600, fontSize: size * 0.38,
        flexShrink: 0, overflow: 'hidden',
      }}
    >
      {photo ? (
        <div
          style={{
            width: '100%', height: '100%',
            backgroundImage:
              'repeating-linear-gradient(45deg, #c4bfb5 0 2px, #d4cfc6 2px 6px)',
          }}
        />
      ) : (
        initials
      )}
    </div>
  );
}

// ── Button ───────────────────────────────────────────────────────────────
type BtnKind =
  | 'primary' | 'success' | 'danger' | 'neutral' | 'ghost' | 'soft'
  | 'softDanger';

export function WButton({
  children, kind = 'primary', size = 'md', onClick, disabled, icon,
  iconRight, fullWidth, style = {}, type = 'button',
}: {
  children?: React.ReactNode;
  kind?: BtnKind;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  icon?: string;
  iconRight?: string;
  fullWidth?: boolean;
  style?: CSS;
  type?: 'button' | 'submit';
}) {
  const sizes = {
    xs: { h: 26, px: 10, fs: 12, r: 6, gap: 4 },
    sm: { h: 32, px: 12, fs: 13, r: 7, gap: 6 },
    md: { h: 36, px: 14, fs: 14, r: 8, gap: 6 },
    lg: { h: 44, px: 18, fs: 15, r: 10, gap: 8 },
  } as const;
  const colors: Record<BtnKind, { bg: string; fg: string; bd: string }> = {
    primary: { bg: WT.ink, fg: '#fff', bd: WT.ink },
    success: { bg: WT.green, fg: '#fff', bd: WT.green },
    danger: { bg: WT.danger, fg: '#fff', bd: WT.danger },
    neutral: { bg: WT.surface2, fg: WT.ink, bd: WT.line },
    ghost: { bg: 'transparent', fg: WT.ink2, bd: 'transparent' },
    soft: { bg: WT.lineSoft, fg: WT.ink, bd: 'transparent' },
    softDanger: { bg: WT.dangerSoft, fg: WT.danger, bd: 'transparent' },
  };
  const cc = disabled
    ? { bg: '#ebe6dd', fg: WT.ink4, bd: 'transparent' }
    : colors[kind];
  const s = sizes[size];
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      style={{
        height: s.h, padding: `0 ${s.px}px`, borderRadius: s.r,
        background: cc.bg, color: cc.fg, border: `1px solid ${cc.bd}`,
        fontFamily: WT.font, fontSize: s.fs, fontWeight: 600,
        letterSpacing: -0.1,
        cursor: disabled ? 'default' : 'pointer',
        width: fullWidth ? '100%' : 'auto',
        display: 'inline-flex', alignItems: 'center',
        justifyContent: 'center', gap: s.gap,
        transition: 'background .12s, border-color .12s, box-shadow .12s',
        boxShadow: kind === 'primary' ? '0 1px 0 rgba(0,0,0,0.04)' : 'none',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (kind === 'neutral' || kind === 'ghost')
          e.currentTarget.style.background = WT.lineSoft;
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        if (kind === 'neutral') e.currentTarget.style.background = WT.surface2;
        if (kind === 'ghost') e.currentTarget.style.background = 'transparent';
      }}
    >
      {icon && <WIcon name={icon} size={s.fs + 2} color={cc.fg} />}
      {children}
      {iconRight && <WIcon name={iconRight} size={s.fs + 2} color={cc.fg} />}
    </button>
  );
}

// ── Tag ──────────────────────────────────────────────────────────────────
type TagTone =
  | 'neutral' | 'green' | 'terra' | 'amber' | 'blue' | 'danger' | 'outline';

export function WTag({
  children, tone = 'neutral', dot = false, size = 'sm',
}: {
  children: React.ReactNode;
  tone?: TagTone;
  dot?: boolean;
  size?: 'xs' | 'sm' | 'md';
}) {
  const tones: Record<
    TagTone,
    { bg: string; fg: string; dot: string; bd?: string }
  > = {
    neutral: { bg: WT.lineSoft, fg: WT.ink2, dot: WT.ink3 },
    green: { bg: WT.greenSoft, fg: WT.greenInk, dot: WT.green },
    terra: { bg: WT.terraSoft, fg: WT.terraInk, dot: WT.terra },
    amber: { bg: WT.amberSoft, fg: WT.amber, dot: WT.amber },
    blue: { bg: WT.blueSoft, fg: WT.blue, dot: WT.blue },
    danger: { bg: WT.dangerSoft, fg: WT.danger, dot: WT.danger },
    outline: { bg: 'transparent', fg: WT.ink2, dot: WT.ink3, bd: WT.line },
  };
  const cc = tones[tone];
  const sizes = {
    xs: { fs: 11, py: 1, px: 6, r: 4 },
    sm: { fs: 12, py: 2, px: 7, r: 5 },
    md: { fs: 13, py: 3, px: 9, r: 6 },
  } as const;
  const s = sizes[size];
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        background: cc.bg, color: cc.fg,
        border: cc.bd ? `1px solid ${cc.bd}` : 'none',
        fontFamily: WT.font, fontSize: s.fs, fontWeight: 600,
        letterSpacing: 0.1,
        padding: `${s.py}px ${s.px}px`, borderRadius: s.r, lineHeight: 1.3,
        whiteSpace: 'nowrap',
      }}
    >
      {dot && (
        <span
          style={{
            width: 6, height: 6, borderRadius: '50%', background: cc.dot,
          }}
        />
      )}
      {children}
    </span>
  );
}

// ── Input ────────────────────────────────────────────────────────────────
export function WInput({
  label, value, onChange, placeholder, type = 'text', icon, iconRight,
  error, hint, size = 'md', autoFocus, style = {}, onIconRightClick,
  name,
}: {
  label?: string;
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: string;
  iconRight?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  autoFocus?: boolean;
  style?: CSS;
  onIconRightClick?: () => void;
  name?: string;
}) {
  const sizes = {
    sm: { h: 32, fs: 13, pad: 10 },
    md: { h: 38, fs: 14, pad: 12 },
    lg: { h: 44, fs: 15, pad: 14 },
  } as const;
  const s = sizes[size];
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{ display: 'block', fontFamily: WT.font, ...style }}>
      {label && (
        <div
          style={{
            fontSize: 13, fontWeight: 600, color: WT.ink2,
            marginBottom: 6, letterSpacing: -0.1,
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          position: 'relative', display: 'flex', alignItems: 'center',
          height: s.h, background: WT.surface2,
          border: `1px solid ${
            error ? WT.danger : focus ? WT.ink : WT.line
          }`,
          borderRadius: 8,
          boxShadow: focus ? `0 0 0 3px rgba(26,26,26,0.06)` : 'none',
          transition: 'box-shadow .15s, border-color .15s',
        }}
      >
        {icon && (
          <span style={{ paddingLeft: s.pad, display: 'flex' }}>
            <WIcon name={icon} size={16} color={WT.ink3} strokeWidth={1.8} />
          </span>
        )}
        <input
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1, minWidth: 0, height: '100%',
            background: 'transparent', border: 'none', outline: 'none',
            fontFamily: WT.font, fontSize: s.fs, color: WT.ink,
            padding: icon ? `0 ${s.pad}px 0 8px` : `0 ${s.pad}px`,
          }}
        />
        {iconRight && (
          <span
            onClick={onIconRightClick}
            style={{
              paddingRight: s.pad, display: 'flex',
              cursor: onIconRightClick ? 'pointer' : 'default',
            }}
          >
            <WIcon name={iconRight} size={16} color={WT.ink3} />
          </span>
        )}
      </div>
      {(error || hint) && (
        <div
          style={{
            fontSize: 12, color: error ? WT.danger : WT.ink3,
            marginTop: 5, fontWeight: 500,
          }}
        >
          {error || hint}
        </div>
      )}
    </label>
  );
}

// ── Select ───────────────────────────────────────────────────────────────
type Opt = string | { value: string; label: string };

export function WSelect({
  label, value, options, onChange, size = 'md',
}: {
  label?: string;
  value?: string;
  options: Opt[];
  onChange?: (v: string) => void;
  size?: 'sm' | 'md';
}) {
  const sizes = { sm: { h: 32, fs: 13 }, md: { h: 38, fs: 14 } } as const;
  const s = sizes[size];
  return (
    <label style={{ display: 'block', fontFamily: WT.font }}>
      {label && (
        <div
          style={{
            fontSize: 13, fontWeight: 600, color: WT.ink2, marginBottom: 6,
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          position: 'relative', height: s.h,
          background: WT.surface2, border: `1px solid ${WT.line}`,
          borderRadius: 8,
        }}
      >
        <select
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          style={{
            width: '100%', height: '100%', background: 'transparent',
            border: 'none', outline: 'none', appearance: 'none',
            fontFamily: WT.font, fontSize: s.fs, color: WT.ink,
            padding: '0 36px 0 12px', cursor: 'pointer',
          }}
        >
          {options.map((o) => {
            const v = typeof o === 'object' ? o.value : o;
            const l = typeof o === 'object' ? o.label : o;
            return (
              <option key={v} value={v}>
                {l}
              </option>
            );
          })}
        </select>
        <div
          style={{
            position: 'absolute', top: '50%', right: 12,
            transform: 'translateY(-50%)', pointerEvents: 'none',
          }}
        >
          <WIcon name="chevronDown" size={16} color={WT.ink3} />
        </div>
      </div>
    </label>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────
export function WCard({
  children, padding = 20, style = {},
}: {
  children: React.ReactNode;
  padding?: number;
  style?: CSS;
}) {
  return (
    <div
      style={{
        background: WT.surface, border: `1px solid ${WT.line}`,
        borderRadius: 14, padding, fontFamily: WT.font, ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Drawer ───────────────────────────────────────────────────────────────
export function WDrawer({
  open, onClose, title, subtitle, children, footer, width = 460,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
}) {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 100, fontFamily: WT.font,
        animation: 'wfade 0.18s ease',
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(20,18,15,0.32)', cursor: 'pointer',
        }}
      />
      <div
        style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width,
          background: WT.bg, borderLeft: `1px solid ${WT.line}`,
          boxShadow: '-12px 0 32px rgba(0,0,0,0.08)',
          display: 'flex', flexDirection: 'column',
          animation: 'wslideIn 0.24s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        <div
          style={{
            padding: '18px 22px', borderBottom: `1px solid ${WT.line}`,
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 17, fontWeight: 600, color: WT.ink,
                letterSpacing: -0.3,
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  fontSize: 13, color: WT.ink2, marginTop: 3,
                  fontWeight: 500,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8, border: 'none',
              background: 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = WT.lineSoft)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'transparent')
            }
          >
            <WIcon name="close" size={18} color={WT.ink2} />
          </button>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 22px' }}>
          {children}
        </div>
        {footer && (
          <div
            style={{
              padding: '14px 22px', borderTop: `1px solid ${WT.line}`,
              display: 'flex', gap: 8, justifyContent: 'flex-end',
              background: WT.surface,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page header ──────────────────────────────────────────────────────────
export function WPageHeader({
  title, subtitle, actions, breadcrumb,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: '24px 32px 18px', display: 'flex',
        alignItems: 'flex-end', gap: 16, fontFamily: WT.font,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {breadcrumb && (
          <div
            style={{
              fontSize: 12, color: WT.ink3, fontWeight: 600,
              letterSpacing: 0.4, textTransform: 'uppercase',
              marginBottom: 6,
            }}
          >
            {breadcrumb}
          </div>
        )}
        <h1
          style={{
            fontSize: 26, fontWeight: 600, margin: 0,
            letterSpacing: -0.6, color: WT.ink, lineHeight: 1.15,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <div
            style={{
              fontSize: 14, color: WT.ink2, marginTop: 4, fontWeight: 500,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {actions}
        </div>
      )}
    </div>
  );
}

// ── Stat tile ────────────────────────────────────────────────────────────
export function WStat({
  label, value, sub, delta, icon, accent,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  delta?: string;
  icon?: string;
  accent?: 'green' | 'terra' | 'amber' | 'blue' | null;
}) {
  return (
    <div
      style={{
        background: WT.surface, border: `1px solid ${WT.line}`,
        borderRadius: 14, padding: '18px 20px', fontFamily: WT.font,
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}
    >
      {icon && (
        <div
          style={{
            width: 38, height: 38, borderRadius: 11, flexShrink: 0,
            background:
              accent === 'green' ? WT.greenSoft
              : accent === 'terra' ? WT.terraSoft
              : accent === 'amber' ? WT.amberSoft
              : accent === 'blue' ? WT.blueSoft
              : WT.lineSoft,
            color:
              accent === 'green' ? WT.greenInk
              : accent === 'terra' ? WT.terraInk
              : accent === 'amber' ? WT.amber
              : accent === 'blue' ? WT.blue
              : WT.ink2,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <WIcon name={icon} size={18} color="currentColor" />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12, color: WT.ink3, fontWeight: 600,
            letterSpacing: 0.4, textTransform: 'uppercase',
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 28, fontWeight: 600, color: WT.ink, marginTop: 4,
            letterSpacing: -0.8, fontVariantNumeric: 'tabular-nums',
            lineHeight: 1.05,
          }}
        >
          {value}
        </div>
        {sub && (
          <div
            style={{
              fontSize: 13, color: WT.ink2, marginTop: 4, fontWeight: 500,
            }}
          >
            {sub}
          </div>
        )}
        {delta && (
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              marginTop: 6, fontSize: 12, fontWeight: 600,
              color: delta.startsWith('+')
                ? WT.green
                : delta.startsWith('-')
                ? WT.danger
                : WT.ink2,
            }}
          >
            <WIcon
              name={delta.startsWith('+') ? 'arrowUp' : 'arrowDown'}
              size={12}
              color="currentColor"
              strokeWidth={2.2}
            />
            {delta}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Table primitives ─────────────────────────────────────────────────────
export function WTable({
  children, style = {},
}: {
  children: React.ReactNode;
  style?: CSS;
}) {
  return (
    <table
      style={{
        width: '100%', borderCollapse: 'separate', borderSpacing: 0,
        fontFamily: WT.font, fontSize: 14, ...style,
      }}
    >
      {children}
    </table>
  );
}
export function WTh({
  children, align = 'left', width, style = {},
}: {
  children?: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: number;
  style?: CSS;
}) {
  return (
    <th
      style={{
        textAlign: align, padding: '10px 14px',
        borderBottom: `1px solid ${WT.line}`, fontWeight: 600,
        fontSize: 12, color: WT.ink3, letterSpacing: 0.4,
        textTransform: 'uppercase', width, background: WT.surface,
        ...style,
      }}
    >
      {children}
    </th>
  );
}
export function WTd({
  children, align = 'left', style = {}, nowrap = false,
}: {
  children?: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  style?: CSS;
  nowrap?: boolean;
}) {
  return (
    <td
      style={{
        textAlign: align, padding: '12px 14px',
        borderBottom: `1px solid ${WT.lineSoft}`, color: WT.ink,
        verticalAlign: 'middle',
        whiteSpace: nowrap ? 'nowrap' : 'normal',
        ...style,
      }}
    >
      {children}
    </td>
  );
}
export function WTr({
  children, onClick, style = {},
}: {
  children: React.ReactNode;
  onClick?: () => void;
  style?: CSS;
}) {
  return (
    <tr
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', ...style }}
      onMouseEnter={(e) => {
        if (onClick) e.currentTarget.style.background = WT.lineSoft;
      }}
      onMouseLeave={(e) => {
        if (onClick) e.currentTarget.style.background = 'transparent';
      }}
    >
      {children}
    </tr>
  );
}

// ── Segmented control ────────────────────────────────────────────────────
export function WSegmented({
  value, options, onChange, size = 'md',
}: {
  value: string;
  options: Opt[];
  onChange: (v: string) => void;
  size?: 'sm' | 'md';
}) {
  const sizes = {
    sm: { h: 28, fs: 12, px: 10 },
    md: { h: 32, fs: 13, px: 12 },
  } as const;
  const s = sizes[size];
  return (
    <div
      style={{
        display: 'flex', flexWrap: 'wrap', rowGap: 3, columnGap: 0,
        background: WT.lineSoft, padding: 3,
        borderRadius: 8, fontFamily: WT.font, maxWidth: '100%',
      }}
    >
      {options.map((o) => {
        const v = typeof o === 'object' ? o.value : o;
        const l = typeof o === 'object' ? o.label : o;
        const on = v === value;
        return (
          <button
            key={v}
            onClick={() => onChange(v)}
            style={{
              minHeight: s.h - 6, padding: `0 ${s.px}px`, border: 'none',
              background: on ? WT.surface2 : 'transparent',
              color: on ? WT.ink : WT.ink2, fontFamily: WT.font,
              fontSize: s.fs, fontWeight: 600,
              borderRadius: 6, cursor: 'pointer',
              boxShadow: on ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              transition: 'background .12s, color .12s',
              whiteSpace: 'nowrap',
              display: 'inline-flex', alignItems: 'center',
            }}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────────────────
export function WEmpty({
  icon = 'box', title, subtitle, action,
}: {
  icon?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        textAlign: 'center', padding: '64px 24px', fontFamily: WT.font,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 12,
      }}
    >
      <div
        style={{
          width: 56, height: 56, borderRadius: 16,
          background: WT.lineSoft, color: WT.ink3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <WIcon name={icon} size={26} color={WT.ink3} />
      </div>
      <div
        style={{
          fontSize: 17, fontWeight: 600, color: WT.ink,
          letterSpacing: -0.3,
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          style={{
            fontSize: 14, color: WT.ink2, maxWidth: 340, lineHeight: 1.45,
          }}
        >
          {subtitle}
        </div>
      )}
      {action && <div style={{ marginTop: 4 }}>{action}</div>}
    </div>
  );
}

// ── Toolbar ──────────────────────────────────────────────────────────────
export function WToolbar({
  children, style = {},
}: {
  children: React.ReactNode;
  style?: CSS;
}) {
  return (
    <div
      style={{
        padding: '0 32px 14px', display: 'flex', alignItems: 'center',
        gap: 10, fontFamily: WT.font, ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Estados de carregamento / erro ───────────────────────────────────────
export function WLoading({ texto = 'carregando…' }: { texto?: string }) {
  return (
    <div
      style={{
        padding: '64px 24px', textAlign: 'center', color: WT.ink3,
        fontFamily: WT.font, fontSize: 14, fontWeight: 500,
        animation: 'wpulse 1.2s ease-in-out infinite',
      }}
    >
      {texto}
    </div>
  );
}

export function WErro({
  mensagem, onRetry,
}: {
  mensagem: string;
  onRetry?: () => void;
}) {
  return (
    <div style={{ padding: '0 32px 32px' }}>
      <WCard>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            color: WT.danger,
          }}
        >
          <WIcon name="warn" size={20} color={WT.danger} />
          <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>
            {mensagem}
          </div>
          {onRetry && (
            <WButton kind="neutral" size="sm" icon="refresh" onClick={onRetry}>
              tentar de novo
            </WButton>
          )}
        </div>
      </WCard>
    </div>
  );
}
