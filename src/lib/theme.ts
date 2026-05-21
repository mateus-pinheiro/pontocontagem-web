// Design tokens — portados fielmente de web-ui.jsx (Claude Design handoff).
// O painel web reusa o sistema visual do app: cream + tinta + verde/terracota,
// DM Sans. Densidade desktop.

export const WT = {
  bg: '#f4f1ea', // app background (um pouco mais escuro que o mobile)
  surface: '#fffefb', // card / sidebar
  surface2: '#ffffff', // branco puro para inputs
  ink: '#1a1a1a',
  ink2: '#5a5550',
  ink3: '#8a857e',
  ink4: '#b8b3aa',
  line: '#e8e3d8',
  lineSoft: '#f1ede4',
  green: '#2d7a4f',
  greenSoft: '#e3efe7',
  greenInk: '#1c4d31',
  terra: '#d97757',
  terraSoft: '#fbe6da',
  terraInk: '#8a3d1f',
  amber: '#c97a1a',
  amberSoft: '#fbeed3',
  blue: '#3a6ea5',
  blueSoft: '#dfe8f0',
  danger: '#b3261e',
  dangerSoft: '#fae0dc',
  font: '"DM Sans", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  fontMono: '"DM Mono", ui-monospace, Menlo, monospace',
} as const;

export const W_KEYFRAMES = `
@keyframes wfade { from { opacity: 0; } to { opacity: 1; } }
@keyframes wslideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes wpulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
@keyframes wShake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}
@keyframes wShimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.w-row-hover:hover { background: ${WT.lineSoft}; }
.w-sb-item { background: transparent; color: ${WT.ink2}; }
.w-sb-item:hover { background: ${WT.lineSoft}; }
.w-sb-item.is-active,
.w-sb-item.is-active:hover { background: ${WT.ink}; color: #fff; }
.w-icon-btn { background: transparent; transition: background .12s; }
.w-icon-btn:hover { background: ${WT.lineSoft}; }
`;
