'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WT } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import { ApiError } from '@/lib/api';
import { WButton, WIcon, WInput } from '@/components/ui';
import { BrandMark } from '@/components/BrandMark';

export default function LoginScreen() {
  const T = WT;
  const router = useRouter();
  const { entrar } = useAuth();
  const [email, setEmail] = useState('gerente@restaurante.com');
  const [senha, setSenha] = useState('mudar123');
  const [showPwd, setShowPwd] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      await entrar(email.trim(), senha);
      router.replace('/');
    } catch (err) {
      setErro(
        err instanceof ApiError
          ? err.message
          : 'não foi possível entrar. a API está rodando?',
      );
      setCarregando(false);
    }
  }

  return (
    <div
      style={{
        height: '100%', width: '100%', background: T.bg,
        display: 'flex', alignItems: 'stretch', fontFamily: T.font,
      }}
    >
      {/* Left — brand panel */}
      <div
        style={{
          flex: '0 0 46%', background: T.ink, color: '#fff',
          padding: '48px 56px', display: 'flex', flexDirection: 'column',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute', top: -80, right: -80, width: 360,
            height: 360, borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(217,119,87,0.4), transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute', bottom: -120, left: -120, width: 420,
            height: 420, borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(45,122,79,0.28), transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'relative', display: 'flex',
            alignItems: 'center', gap: 12,
          }}
        >
          <BrandMark size={40} stemColor="#f7f5f0" />
          <div>
            <div
              style={{ fontSize: 19, fontWeight: 600, letterSpacing: -0.475 }}
            >
              ponto contagem
            </div>
            <div style={{ fontSize: 13, opacity: 0.65, marginTop: 1 }}>
              painel do gerente
            </div>
          </div>
        </div>
        <div style={{ minHeight: 80 }} />
        <div style={{ position: 'relative', maxWidth: 380 }}>
          <h1
            style={{
              fontSize: 32, fontWeight: 600, letterSpacing: -0.8,
              lineHeight: 1.15, margin: 0, textWrap: 'balance',
            }}
          >
            ponto e estoque do seu restaurante, sem firula.
          </h1>
          <p
            style={{
              fontSize: 15, color: 'rgba(255,255,255,0.7)', marginTop: 18,
              lineHeight: 1.5, fontWeight: 500,
            }}
          >
            cadastre funcionários, atribua contagens e veja relatórios —
            tudo num só lugar.
          </p>
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            position: 'relative', display: 'flex', gap: 16,
            opacity: 0.6, fontSize: 12, fontWeight: 500,
          }}
        >
          <span>v1.2 · 2026</span>
          <span>·</span>
          <span>Pitéu</span>
        </div>
      </div>

      {/* Right — form */}
      <div
        style={{
          flex: 1, display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '40px',
        }}
      >
        <form onSubmit={submit} style={{ width: '100%', maxWidth: 380 }}>
          <div
            style={{
              fontSize: 12, color: T.ink3, fontWeight: 700,
              letterSpacing: 0.5, textTransform: 'uppercase',
            }}
          >
            entrar
          </div>
          <h2
            style={{
              fontSize: 28, fontWeight: 600, letterSpacing: -0.6,
              margin: '6px 0 0', color: T.ink,
            }}
          >
            bem-vindo de volta
          </h2>
          <p
            style={{
              fontSize: 14, color: T.ink2, margin: '6px 0 28px',
              fontWeight: 500,
            }}
          >
            entre com seu email e senha pra continuar.
          </p>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            <WInput
              label="email"
              value={email}
              onChange={setEmail}
              placeholder="seu@email.com"
              size="lg"
              icon="enter"
              type="email"
            />
            <WInput
              label="senha"
              value={senha}
              onChange={setSenha}
              placeholder="••••••••"
              type={showPwd ? 'text' : 'password'}
              size="lg"
              iconRight={showPwd ? 'eyeOff' : 'eye'}
              onIconRightClick={() => setShowPwd((v) => !v)}
            />
            <div
              style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', margin: '4px 0 8px',
              }}
            >
              <label
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  cursor: 'pointer', fontSize: 13, color: T.ink2,
                  fontWeight: 500,
                }}
              >
                <input
                  type="checkbox"
                  defaultChecked
                  style={{ accentColor: T.ink }}
                />
                lembrar de mim
              </label>
              <button
                type="button"
                style={{
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', fontSize: 13, color: T.ink2,
                  fontFamily: T.font, fontWeight: 600,
                  textDecoration: 'underline', textUnderlineOffset: 3,
                }}
              >
                esqueci a senha
              </button>
            </div>
            {erro && (
              <div
                style={{
                  padding: '10px 12px', background: T.dangerSoft,
                  border: `1px solid ${T.danger}`, borderRadius: 8,
                  fontSize: 13, color: T.danger, fontWeight: 600,
                }}
              >
                {erro}
              </div>
            )}
            <WButton
              kind="primary"
              size="lg"
              fullWidth
              type="submit"
              iconRight="arrowRight"
              disabled={carregando}
            >
              {carregando ? 'entrando…' : 'entrar no painel'}
            </WButton>
            <div
              style={{
                padding: 12, background: T.surface,
                border: `1px solid ${T.line}`, borderRadius: 10,
                marginTop: 8, display: 'flex', gap: 10,
                alignItems: 'flex-start',
              }}
            >
              <WIcon name="info" size={16} color={T.ink2} />
              <div
                style={{ fontSize: 12, color: T.ink2, lineHeight: 1.5 }}
              >
                não consegue entrar? peça pra outro gerente resetar sua
                senha pelo painel.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
