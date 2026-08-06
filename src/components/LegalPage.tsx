// Casca das páginas públicas de documentação legal (termos, privacidade,
// suporte, exclusão de conta). Fica fora do (panel): são páginas abertas,
// sem sessão — as lojas precisam abrir a URL sem login.

import Link from 'next/link';
import { WT } from '@/lib/theme';
import { LEGAL } from '@/lib/legal';
import { PUBLICAS, painel } from '@/lib/rotas';
import { BrandMark } from './BrandMark';

const LINKS = [
  { href: PUBLICAS.termos, label: 'termos de uso' },
  { href: PUBLICAS.privacidade, label: 'privacidade' },
  { href: PUBLICAS.suporte, label: 'suporte' },
  { href: PUBLICAS.excluirConta, label: 'excluir conta' },
];

export function LegalPage({
  titulo,
  resumo,
  children,
}: {
  titulo: string;
  resumo: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: '100%',
        background: WT.bg,
        fontFamily: WT.font,
        color: WT.ink,
      }}
    >
      {/* topo */}
      <div
        style={{
          background: WT.ink,
          color: '#fff',
          padding: '18px var(--w-pad)',
        }}
      >
        <Link
          href={painel('/login')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            color: '#fff',
          }}
        >
          <BrandMark size={26} stemColor="#f7f5f0" />
          <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.4 }}>
            ponto contagem
          </span>
        </Link>
      </div>

      <div
        className="w-legal"
        style={{ maxWidth: 760, margin: '0 auto', padding: '32px var(--w-pad) 56px' }}
      >
        <h1
          style={{
            fontSize: 'clamp(24px, 6vw, 34px)',
            fontWeight: 600,
            letterSpacing: -0.8,
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          {titulo}
        </h1>
        <p
          style={{
            fontSize: 16,
            color: WT.ink2,
            lineHeight: 1.55,
            marginTop: 12,
            fontWeight: 500,
          }}
        >
          {resumo}
        </p>
        <div
          style={{
            fontSize: 13,
            color: WT.ink3,
            fontWeight: 500,
            marginTop: 8,
            paddingBottom: 20,
            borderBottom: `1px solid ${WT.line}`,
          }}
        >
          última atualização: {LEGAL.atualizadoEm}
        </div>

        <div style={{ marginTop: 8 }}>{children}</div>

        {/* rodapé com as demais páginas — as lojas checam se os documentos
            se alcançam entre si */}
        <div
          style={{
            marginTop: 48,
            paddingTop: 20,
            borderTop: `1px solid ${WT.line}`,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px 18px',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{ color: WT.ink2, textDecoration: 'none' }}
            >
              {l.label}
            </Link>
          ))}
          <span style={{ flex: 1 }} />
          <span style={{ color: WT.ink3, fontWeight: 500 }}>
            {LEGAL.produto}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Blocos de texto ──────────────────────────────────────────────────────
export function Secao({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginTop: 34 }}>
      <h2
        style={{
          fontSize: 19,
          fontWeight: 600,
          letterSpacing: -0.4,
          margin: 0,
          color: WT.ink,
        }}
      >
        {titulo}
      </h2>
      <div style={{ marginTop: 10 }}>{children}</div>
    </section>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 15,
        lineHeight: 1.65,
        color: WT.ink2,
        margin: '0 0 12px',
        fontWeight: 500,
      }}
    >
      {children}
    </p>
  );
}

export function Lista({ itens }: { itens: React.ReactNode[] }) {
  return (
    <ul
      style={{
        margin: '0 0 12px',
        paddingLeft: 20,
        fontSize: 15,
        lineHeight: 1.65,
        color: WT.ink2,
        fontWeight: 500,
      }}
    >
      {itens.map((it, i) => (
        <li key={i} style={{ marginBottom: 6 }}>
          {it}
        </li>
      ))}
    </ul>
  );
}

export function Destaque({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: WT.surface,
        border: `1px solid ${WT.line}`,
        borderRadius: 12,
        padding: '16px 18px',
        fontSize: 15,
        lineHeight: 1.6,
        color: WT.ink,
        fontWeight: 500,
        margin: '4px 0 12px',
      }}
    >
      {children}
    </div>
  );
}

export function Mail() {
  return (
    <a
      href={`mailto:${LEGAL.email}`}
      style={{ color: WT.ink, fontWeight: 600 }}
    >
      {LEGAL.email}
    </a>
  );
}
