import type { Metadata } from 'next';
import Link from 'next/link';
import { WT } from '@/lib/theme';
import { LEGAL } from '@/lib/legal';
import { PUBLICAS, painel } from '@/lib/rotas';
import { BrandMark } from '@/components/BrandMark';

// Raiz do domínio. O painel mora em /web — aqui fica só uma porta de entrada
// enxuta, que também serve de Marketing URL nas lojas. Substituir por um site
// institucional de verdade não quebra nada: as rotas do painel e as páginas
// legais são independentes desta.

export const metadata: Metadata = {
  title: 'Ponto Contagem — ponto e estoque do seu restaurante',
  description:
    'Controle de jornada e contagem de estoque para restaurantes. Painel do gerente na web e app para a equipe.',
};

const LINKS = [
  { href: PUBLICAS.termos, label: 'termos de uso' },
  { href: PUBLICAS.privacidade, label: 'privacidade' },
  { href: PUBLICAS.suporte, label: 'suporte' },
  { href: PUBLICAS.excluirConta, label: 'excluir conta' },
];

export default function Page() {
  return (
    <div
      style={{
        minHeight: '100%',
        background: WT.ink,
        color: '#fff',
        fontFamily: WT.font,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -140,
          right: -120,
          width: 460,
          height: 460,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(217,119,87,0.38), transparent 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -180,
          left: -160,
          width: 520,
          height: 520,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(45,122,79,0.26), transparent 70%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 720,
          width: '100%',
          margin: '0 auto',
          padding: '32px var(--w-pad) 40px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <BrandMark size={36} stemColor="#f7f5f0" />
          <div>
            <div
              style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.45 }}
            >
              ponto contagem
            </div>
            <div style={{ fontSize: 13, opacity: 0.6, marginTop: 1 }}>
              ponto e estoque, sem firula
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 48 }} />

        <h1
          style={{
            fontSize: 'clamp(28px, 7vw, 44px)',
            fontWeight: 600,
            letterSpacing: -1,
            lineHeight: 1.1,
            margin: 0,
            maxWidth: 560,
            textWrap: 'balance',
          }}
        >
          ponto e estoque do seu restaurante, num lugar só.
        </h1>
        <p
          style={{
            fontSize: 'clamp(15px, 4vw, 17px)',
            color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.55,
            fontWeight: 500,
            marginTop: 18,
            maxWidth: 480,
          }}
        >
          a equipe bate ponto e conta estoque pelo app. você acompanha tudo
          pelo painel do gerente, no computador ou no celular.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            marginTop: 28,
          }}
        >
          <Link
            href={painel('/login')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 48,
              padding: '0 24px',
              borderRadius: 10,
              background: '#fff',
              color: WT.ink,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            entrar no painel
          </Link>
          <Link
            href={painel('/registrar')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 48,
              padding: '0 24px',
              borderRadius: 10,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.28)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            criar conta
          </Link>
        </div>

        <div style={{ flex: 1, minHeight: 48 }} />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px 18px',
            fontSize: 13,
            fontWeight: 500,
            paddingTop: 24,
            borderTop: '1px solid rgba(255,255,255,0.14)',
          }}
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{ color: 'rgba(255,255,255,0.62)', textDecoration: 'none' }}
            >
              {l.label}
            </Link>
          ))}
          <span style={{ flex: 1 }} />
          <span style={{ color: 'rgba(255,255,255,0.42)' }}>
            {LEGAL.produto}
          </span>
        </div>
      </div>
    </div>
  );
}
