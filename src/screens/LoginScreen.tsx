'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WT } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import { ApiError, api, type EstabelecimentoRef } from '@/lib/api';
import { WButton, WIcon, WInput } from '@/components/ui';
import { BrandMark } from '@/components/BrandMark';

type Etapa = 'credenciais' | 'estab' | 'trocar-senha';

export default function LoginScreen() {
  const T = WT;
  const router = useRouter();
  const { entrar, selecionarEstabelecimento } = useAuth();

  const [etapa, setEtapa] = useState<Etapa>('credenciais');
  const [email, setEmail] = useState('gerente@restaurante.com');
  const [senha, setSenha] = useState('mudar123');
  const [showPwd, setShowPwd] = useState(false);
  const [estabs, setEstabs] = useState<EstabelecimentoRef[]>([]);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  function depoisDoLogin(deveTrocar: boolean) {
    if (deveTrocar) {
      setEtapa('trocar-senha');
      setCarregando(false);
    } else {
      router.replace('/');
    }
  }

  async function submitCredenciais(e?: React.FormEvent) {
    e?.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      const r = await entrar(email.trim(), senha);
      if (r.tipo === 'escolher') {
        setEstabs(r.estabelecimentos);
        setEtapa('estab');
        setCarregando(false);
      } else {
        depoisDoLogin(!!r.usuario.deveTrocarSenha);
      }
    } catch (err) {
      setErro(
        err instanceof ApiError
          ? err.message
          : 'não foi possível entrar. a API está rodando?',
      );
      setCarregando(false);
    }
  }

  async function escolherEstab(id: string) {
    setErro(null);
    setCarregando(true);
    try {
      const u = await selecionarEstabelecimento(id);
      depoisDoLogin(!!u.deveTrocarSenha);
    } catch (err) {
      setErro(
        err instanceof ApiError
          ? err.message
          : 'não foi possível abrir o estabelecimento.',
      );
      setCarregando(false);
    }
  }

  async function submitTrocarSenha(e?: React.FormEvent) {
    e?.preventDefault();
    setErro(null);
    if (novaSenha.length < 6) {
      setErro('a nova senha precisa ter pelo menos 6 caracteres');
      return;
    }
    if (novaSenha !== confirmaSenha) {
      setErro('a confirmação não bate com a nova senha');
      return;
    }
    setCarregando(true);
    try {
      await api.trocarSenha(senha, novaSenha);
      router.replace('/');
    } catch (err) {
      setErro(
        err instanceof ApiError
          ? err.message
          : 'não foi possível trocar a senha.',
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
            ponto e estoque do seu restaurante, sem firula.
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
            gerencie membros e funções, atribua contagens e veja relatórios —
            tudo num só lugar.
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
          {etapa === 'credenciais' && (
            <form onSubmit={submitCredenciais}>
              <Cabecalho
                T={T}
                kicker="entrar"
                titulo="bem-vindo de volta"
                sub="entre com seu email e senha pra continuar."
              />
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
                {erro && <ErroBox T={T} texto={erro} />}
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
                <DicaBox T={T}>
                  não consegue entrar? peça pra outro ADMIN do estabelecimento
                  resetar sua senha pelo painel.
                </DicaBox>
              </div>
            </form>
          )}

          {etapa === 'estab' && (
            <div>
              <Cabecalho
                T={T}
                kicker="escolher estabelecimento"
                titulo="qual quer abrir?"
                sub="você tem acesso a mais de um. escolhe um pra continuar."
              />
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
              >
                {estabs.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => escolherEstab(e.id)}
                    disabled={carregando}
                    style={{
                      textAlign: 'left',
                      padding: '14px 16px',
                      background: T.surface,
                      border: `1px solid ${T.line}`,
                      borderRadius: 10,
                      cursor: carregando ? 'wait' : 'pointer',
                      fontFamily: T.font,
                      fontSize: 15,
                      fontWeight: 600,
                      color: T.ink,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{e.nome}</span>
                    <WIcon name="arrowRight" size={16} color={T.ink2} />
                  </button>
                ))}
                {erro && <ErroBox T={T} texto={erro} />}
              </div>
            </div>
          )}

          {etapa === 'trocar-senha' && (
            <form onSubmit={submitTrocarSenha}>
              <Cabecalho
                T={T}
                kicker="primeira vez"
                titulo="defina uma nova senha"
                sub="pra continuar, escolha uma senha que só você conhece."
              />
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
              >
                <WInput
                  label="nova senha"
                  value={novaSenha}
                  onChange={setNovaSenha}
                  placeholder="••••••••"
                  type={showPwd ? 'text' : 'password'}
                  size="lg"
                  iconRight={showPwd ? 'eyeOff' : 'eye'}
                  onIconRightClick={() => setShowPwd((v) => !v)}
                />
                <WInput
                  label="confirme a nova senha"
                  value={confirmaSenha}
                  onChange={setConfirmaSenha}
                  placeholder="••••••••"
                  type={showPwd ? 'text' : 'password'}
                  size="lg"
                />
                {erro && <ErroBox T={T} texto={erro} />}
                <WButton
                  kind="primary"
                  size="lg"
                  fullWidth
                  type="submit"
                  iconRight="arrowRight"
                  disabled={carregando}
                >
                  {carregando ? 'salvando…' : 'salvar e entrar'}
                </WButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Cabecalho({
  T,
  kicker,
  titulo,
  sub,
}: {
  T: typeof WT;
  kicker: string;
  titulo: string;
  sub: string;
}) {
  return (
    <>
      <div
        style={{
          fontSize: 12,
          color: T.ink3,
          fontWeight: 700,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        }}
      >
        {kicker}
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
        {titulo}
      </h2>
      <p
        style={{
          fontSize: 14,
          color: T.ink2,
          margin: '6px 0 28px',
          fontWeight: 500,
        }}
      >
        {sub}
      </p>
    </>
  );
}

function ErroBox({ T, texto }: { T: typeof WT; texto: string }) {
  return (
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
      {texto}
    </div>
  );
}

function DicaBox({
  T,
  children,
}: {
  T: typeof WT;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: 12,
        background: T.surface,
        border: `1px solid ${T.line}`,
        borderRadius: 10,
        marginTop: 8,
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
      }}
    >
      <WIcon name="info" size={16} color={T.ink2} />
      <div style={{ fontSize: 12, color: T.ink2, lineHeight: 1.5 }}>
        {children}
      </div>
    </div>
  );
}
