'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WT } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import { ApiError } from '@/lib/api';
import { WButton, WIcon, WInput } from '@/components/ui';
import { BrandMark } from '@/components/BrandMark';

export default function RegistrarScreen() {
  const T = WT;
  const router = useRouter();
  const { cadastrar } = useAuth();

  const [nomeEstabelecimento, setNomeEstabelecimento] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  function validar(): string | null {
    if (nomeEstabelecimento.trim().length < 2) {
      return 'nome do estabelecimento muito curto';
    }
    if (nomeUsuario.trim().length < 2) return 'seu nome está muito curto';
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return 'informe um email válido';
    if (senha.length < 8) return 'a senha tem no mínimo 8 caracteres';
    if (senha !== confirmaSenha) return 'a confirmação não bate com a senha';
    return null;
  }

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    setErro(null);
    const v = validar();
    if (v) {
      setErro(v);
      return;
    }
    setCarregando(true);
    try {
      await cadastrar({
        nomeEstabelecimento: nomeEstabelecimento.trim(),
        nomeUsuario: nomeUsuario.trim(),
        email: email.trim(),
        senha,
      });
      router.replace('/');
    } catch (err) {
      setErro(
        err instanceof ApiError
          ? err.message
          : 'não foi possível criar a conta. a API está rodando?',
      );
      setCarregando(false);
    }
  }

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        background: T.bg,
        display: 'flex',
        alignItems: 'stretch',
        fontFamily: T.font,
      }}
    >
      {/* Left — brand panel */}
      <div
        style={{
          flex: '0 0 46%',
          background: T.ink,
          color: '#fff',
          padding: '48px 56px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(217,119,87,0.4), transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -120,
            left: -120,
            width: 420,
            height: 420,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(45,122,79,0.28), transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
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
              painel
            </div>
          </div>
        </div>
        <div style={{ minHeight: 80 }} />
        <div style={{ position: 'relative', maxWidth: 380 }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: -0.8,
              lineHeight: 1.15,
              margin: 0,
              textWrap: 'balance',
            }}
          >
            comece em dois minutos.
          </h1>
          <p
            style={{
              fontSize: 15,
              color: 'rgba(255,255,255,0.7)',
              marginTop: 18,
              lineHeight: 1.5,
              fontWeight: 500,
            }}
          >
            crie seu estabelecimento, vire ADMIN e convide a equipe quando
            quiser. sem cartão, sem firula.
          </p>
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            position: 'relative',
            display: 'flex',
            gap: 16,
            opacity: 0.6,
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          <span>v1.3 · 2026</span>
          <span>·</span>
          <span>Ponto Contagem</span>
        </div>
      </div>

      {/* Right — form */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 380 }}>
          <form onSubmit={submit}>
            <div
              style={{
                fontSize: 12,
                color: T.ink3,
                fontWeight: 700,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}
            >
              criar conta
            </div>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: -0.6,
                margin: '6px 0 0',
                color: T.ink,
              }}
            >
              vamos abrir seu estabelecimento
            </h2>
            <p
              style={{
                fontSize: 14,
                color: T.ink2,
                margin: '6px 0 24px',
                fontWeight: 500,
              }}
            >
              você vira ADMIN e pode convidar o resto da equipe depois.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <WInput
                label="nome do estabelecimento"
                value={nomeEstabelecimento}
                onChange={setNomeEstabelecimento}
                placeholder="ex.: cantina do bairro"
                size="lg"
              />
              <WInput
                label="seu nome"
                value={nomeUsuario}
                onChange={setNomeUsuario}
                placeholder="como prefere ser chamado(a)"
                size="lg"
                icon="people"
              />
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
                placeholder="mínimo 8 caracteres"
                type={showPwd ? 'text' : 'password'}
                size="lg"
                iconRight={showPwd ? 'eyeOff' : 'eye'}
                onIconRightClick={() => setShowPwd((v) => !v)}
              />
              <WInput
                label="confirme a senha"
                value={confirmaSenha}
                onChange={setConfirmaSenha}
                placeholder="repita a senha"
                type={showPwd ? 'text' : 'password'}
                size="lg"
              />
              {erro && (
                <div
                  style={{
                    padding: '10px 12px',
                    background: T.dangerSoft,
                    border: `1px solid ${T.danger}`,
                    borderRadius: 8,
                    fontSize: 13,
                    color: T.danger,
                    fontWeight: 600,
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
                {carregando ? 'criando…' : 'criar conta e entrar'}
              </WButton>
              <div
                style={{
                  marginTop: 4,
                  display: 'flex',
                  gap: 6,
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  color: T.ink2,
                  fontWeight: 500,
                }}
              >
                <WIcon name="info" size={14} color={T.ink2} />
                <span>
                  já tem conta?{' '}
                  <Link
                    href="/login"
                    style={{ color: T.ink, fontWeight: 600 }}
                  >
                    entrar
                  </Link>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
