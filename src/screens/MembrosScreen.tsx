'use client';

import { useCallback, useEffect, useState } from 'react';
import { WT } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import { api, ApiError, type Membro, type Role } from '@/lib/api';
import {
  WButton,
  WDrawer,
  WEmpty,
  WErro,
  WIcon,
  WInput,
  WLoading,
  WPageHeader,
  WTable,
  WTag,
  WTd,
  WTh,
  WToolbar,
  WTr,
} from '@/components/ui';

type ModoDrawer =
  | { tipo: 'fechado' }
  | { tipo: 'novo' }
  | { tipo: 'editar'; membro: Membro };

interface Aviso {
  titulo: string;
  valor: string;
  ajuda: string;
}

export default function MembrosScreen() {
  const T = WT;
  const { usuario } = useAuth();
  const [membros, setMembros] = useState<Membro[] | null>(null);
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<ModoDrawer>({ tipo: 'fechado' });
  const [aviso, setAviso] = useState<Aviso | null>(null);

  const carregar = useCallback(async () => {
    try {
      const [m, r] = await Promise.all([api.membros(), api.roles()]);
      setMembros(m);
      setRoles(r);
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'erro ao carregar');
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function executarAcao(
    promessa: Promise<unknown>,
    sucessoAviso?: (r: unknown) => Aviso | null,
  ) {
    setErro(null);
    try {
      const r = await promessa;
      await carregar();
      if (sucessoAviso) {
        const a = sucessoAviso(r);
        if (a) setAviso(a);
      }
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'erro ao executar ação');
    }
  }

  if (erro && !membros) {
    return (
      <WErro
        mensagem={erro}
        onRetry={() => {
          carregar();
        }}
      />
    );
  }
  if (!membros || !roles) {
    return <WLoading texto="carregando membros…" />;
  }

  return (
    <>
      <WPageHeader
        title="membros"
        subtitle="quem pode acessar o painel ou bater ponto neste estabelecimento."
        actions={
          <WButton
            kind="primary"
            size="md"
            icon="plus"
            onClick={() => setDrawer({ tipo: 'novo' })}
          >
            novo membro
          </WButton>
        }
      />

      {aviso && (
        <div style={{ padding: '0 32px 12px' }}>
          <AvisoBox aviso={aviso} onFechar={() => setAviso(null)} />
        </div>
      )}
      {erro && (
        <WToolbar>
          <div style={{ color: T.danger, fontSize: 13, fontWeight: 600 }}>
            {erro}
          </div>
        </WToolbar>
      )}

      <div style={{ padding: '0 32px' }}>
        {membros.length === 0 ? (
          <WEmpty
            icon="people"
            title="sem membros ainda"
            subtitle="adicione a primeira pessoa pra começar."
            action={
              <WButton
                kind="primary"
                onClick={() => setDrawer({ tipo: 'novo' })}
              >
                novo membro
              </WButton>
            }
          />
        ) : (
          <WTable>
            <thead>
              <WTr>
                <WTh>nome</WTh>
                <WTh width={220}>contato</WTh>
                <WTh width={180}>funções</WTh>
                <WTh width={100} align="right">
                  status
                </WTh>
                <WTh width={140} align="right" />
              </WTr>
            </thead>
            <tbody>
              {membros.map((m) => {
                const ehVoceMesmo = m.usuarioId === usuario?.id;
                return (
                  <WTr key={m.id}>
                    <WTd>
                      <div style={{ fontWeight: 600 }}>
                        {m.nome}
                        {ehVoceMesmo && (
                          <span
                            style={{
                              marginLeft: 8,
                              fontSize: 11,
                              color: T.ink3,
                              fontWeight: 600,
                            }}
                          >
                            (você)
                          </span>
                        )}
                      </div>
                      {m.cargo && (
                        <div
                          style={{
                            fontSize: 12,
                            color: T.ink3,
                            marginTop: 2,
                          }}
                        >
                          {m.cargo}
                        </div>
                      )}
                    </WTd>
                    <WTd>
                      <div style={{ fontSize: 13 }}>
                        {m.email || (
                          <span style={{ color: T.ink4 }}>—</span>
                        )}
                      </div>
                      {m.documento && (
                        <div style={{ fontSize: 12, color: T.ink3 }}>
                          {m.documento}
                        </div>
                      )}
                      {m.temCodigoAcesso && (
                        <div
                          style={{
                            fontSize: 11,
                            color: T.ink3,
                            marginTop: 2,
                          }}
                        >
                          tem código de acesso
                        </div>
                      )}
                    </WTd>
                    <WTd>
                      <div
                        style={{
                          display: 'flex',
                          gap: 4,
                          flexWrap: 'wrap',
                        }}
                      >
                        {m.roles.map((r) => (
                          <WTag
                            key={r.id}
                            tone={r.nome === 'ADMIN' ? 'terra' : 'neutral'}
                            size="xs"
                          >
                            {r.nome}
                          </WTag>
                        ))}
                      </div>
                    </WTd>
                    <WTd align="right">
                      <WTag
                        tone={m.ativo ? 'green' : 'neutral'}
                        size="sm"
                      >
                        {m.ativo ? 'ativo' : 'inativo'}
                      </WTag>
                    </WTd>
                    <WTd align="right">
                      <WButton
                        kind="ghost"
                        size="sm"
                        icon="settings"
                        onClick={() =>
                          setDrawer({ tipo: 'editar', membro: m })
                        }
                      >
                        editar
                      </WButton>
                    </WTd>
                  </WTr>
                );
              })}
            </tbody>
          </WTable>
        )}
      </div>

      <DrawerMembro
        modo={drawer}
        roles={roles}
        onClose={() => setDrawer({ tipo: 'fechado' })}
        onCriar={(body) =>
          executarAcao(api.criarMembro(body), () => ({
            titulo: 'membro criado',
            valor: '',
            ajuda: 'cadastrado com sucesso.',
          }))
        }
        onSalvar={(id, body) =>
          executarAcao(api.atualizarMembro(id, body))
        }
        onDesativar={(id) =>
          executarAcao(api.desativarMembro(id), () => ({
            titulo: 'membro desativado',
            valor: '',
            ajuda: 'ele não consegue mais acessar.',
          }))
        }
        onResetarSenha={(id) =>
          executarAcao(api.resetarSenhaMembro(id), (r) => ({
            titulo: 'senha temporária',
            valor: (r as { senhaTemporaria: string }).senhaTemporaria,
            ajuda:
              'compartilhe com o membro. ele terá que trocar no 1º login.',
          }))
        }
        onResetarPin={(id) =>
          executarAcao(api.resetarPinMembro(id), () => ({
            titulo: 'PIN resetado',
            valor: '',
            ajuda: 'o membro define um novo no próximo acesso pelo app.',
          }))
        }
        onRegenerarCodigo={(id) =>
          executarAcao(api.regenerarCodigoMembro(id), (r) => ({
            titulo: 'código de acesso',
            valor: (r as { codigoAcesso: string }).codigoAcesso,
            ajuda: 'compartilhe com o membro pra ele logar no app.',
          }))
        }
      />
    </>
  );
}

function DrawerMembro({
  modo,
  roles,
  onClose,
  onCriar,
  onSalvar,
  onDesativar,
  onResetarSenha,
  onResetarPin,
  onRegenerarCodigo,
}: {
  modo: ModoDrawer;
  roles: Role[];
  onClose: () => void;
  onCriar: (body: {
    nome: string;
    email?: string;
    documento?: string;
    cargo?: string;
    roleIds: string[];
    senha?: string;
    gerarCodigo?: boolean;
  }) => Promise<void>;
  onSalvar: (
    id: string,
    body: { cargo?: string; roleIds?: string[]; ativo?: boolean },
  ) => Promise<void>;
  onDesativar: (id: string) => Promise<void>;
  onResetarSenha: (id: string) => Promise<void>;
  onResetarPin: (id: string) => Promise<void>;
  onRegenerarCodigo: (id: string) => Promise<void>;
}) {
  const novo = modo.tipo === 'novo';
  const editar = modo.tipo === 'editar' ? modo.membro : null;

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [documento, setDocumento] = useState('');
  const [cargo, setCargo] = useState('');
  const [roleIds, setRoleIds] = useState<string[]>([]);
  const [senha, setSenha] = useState('');
  const [gerarCodigo, setGerarCodigo] = useState(false);
  const [ativo, setAtivo] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (modo.tipo === 'fechado') return;
    if (modo.tipo === 'novo') {
      setNome('');
      setEmail('');
      setDocumento('');
      setCargo('');
      setRoleIds([]);
      setSenha('');
      setGerarCodigo(false);
      setAtivo(true);
    } else {
      const m = modo.membro;
      setNome(m.nome);
      setEmail(m.email ?? '');
      setDocumento(m.documento ?? '');
      setCargo(m.cargo ?? '');
      setRoleIds(m.roles.map((r) => r.id));
      setSenha('');
      setGerarCodigo(false);
      setAtivo(m.ativo);
    }
  }, [modo]);

  function toggleRole(id: string) {
    setRoleIds((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );
  }

  async function salvar() {
    setSalvando(true);
    try {
      if (novo) {
        await onCriar({
          nome: nome.trim(),
          email: email.trim() || undefined,
          documento: documento.trim() || undefined,
          cargo: cargo.trim() || undefined,
          roleIds,
          senha: senha.trim() || undefined,
          gerarCodigo,
        });
      } else if (editar) {
        await onSalvar(editar.id, {
          cargo: cargo.trim() || undefined,
          roleIds,
          ativo,
        });
      }
      onClose();
    } finally {
      setSalvando(false);
    }
  }

  return (
    <WDrawer
      open={modo.tipo !== 'fechado'}
      onClose={onClose}
      title={novo ? 'novo membro' : nome}
      subtitle={
        novo
          ? 'adicione uma pessoa a este estabelecimento.'
          : 'edite cargo, funções e status.'
      }
      footer={
        <>
          <WButton kind="neutral" size="md" onClick={onClose}>
            cancelar
          </WButton>
          <WButton
            kind="primary"
            size="md"
            disabled={salvando}
            onClick={salvar}
          >
            {salvando ? 'salvando…' : novo ? 'criar' : 'salvar'}
          </WButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {novo && (
          <>
            <WInput
              label="nome"
              value={nome}
              onChange={setNome}
              placeholder="nome completo"
            />
            <WInput
              label="email"
              value={email}
              onChange={setEmail}
              placeholder="opcional — pra login no painel"
              type="email"
            />
            <WInput
              label="documento (CPF)"
              value={documento}
              onChange={setDocumento}
              placeholder="opcional — identidade do membro"
            />
          </>
        )}

        <WInput
          label="cargo"
          value={cargo}
          onChange={setCargo}
          placeholder="ex.: caixa, cozinha, gerente"
        />

        <div>
          <div
            style={{
              fontSize: 12,
              color: WT.ink2,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            funções
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {roles.map((r) => (
              <label
                key={r.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 10px',
                  border: `1px solid ${WT.line}`,
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 13,
                  color: WT.ink,
                }}
              >
                <input
                  type="checkbox"
                  checked={roleIds.includes(r.id)}
                  onChange={() => toggleRole(r.id)}
                  style={{ accentColor: WT.ink }}
                />
                <span style={{ fontWeight: 600 }}>{r.nome}</span>
                {r.sistema && (
                  <span
                    style={{
                      fontSize: 11,
                      color: WT.ink3,
                      marginLeft: 'auto',
                    }}
                  >
                    sistema
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        {novo && (
          <>
            <WInput
              label="senha inicial (opcional)"
              value={senha}
              onChange={setSenha}
              placeholder="≥ 6 chars — ele troca no 1º login"
              type="password"
            />
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                color: WT.ink2,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={gerarCodigo}
                onChange={() => setGerarCodigo((v) => !v)}
                style={{ accentColor: WT.ink }}
              />
              gerar código de acesso (login operacional pelo app)
            </label>
          </>
        )}

        {editar && (
          <>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                color: WT.ink2,
                cursor: 'pointer',
                marginTop: 4,
              }}
            >
              <input
                type="checkbox"
                checked={ativo}
                onChange={() => setAtivo((v) => !v)}
                style={{ accentColor: WT.ink }}
              />
              membro ativo
            </label>

            <div
              style={{
                marginTop: 12,
                paddingTop: 14,
                borderTop: `1px solid ${WT.line}`,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: WT.ink3,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  marginBottom: 8,
                }}
              >
                ações
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                }}
              >
                {editar.email && (
                  <WButton
                    kind="ghost"
                    size="sm"
                    icon="key"
                    onClick={() => onResetarSenha(editar.id)}
                  >
                    resetar senha
                  </WButton>
                )}
                <WButton
                  kind="ghost"
                  size="sm"
                  icon="key"
                  onClick={() => onResetarPin(editar.id)}
                >
                  resetar PIN
                </WButton>
                <WButton
                  kind="ghost"
                  size="sm"
                  icon="refresh"
                  onClick={() => onRegenerarCodigo(editar.id)}
                >
                  novo código de acesso
                </WButton>
                {editar.ativo && (
                  <WButton
                    kind="danger"
                    size="sm"
                    icon="x"
                    onClick={() => onDesativar(editar.id)}
                  >
                    desativar
                  </WButton>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </WDrawer>
  );
}

function AvisoBox({
  aviso,
  onFechar,
}: {
  aviso: Aviso;
  onFechar: () => void;
}) {
  return (
    <div
      style={{
        padding: '12px 14px',
        background: WT.surface,
        border: `1px solid ${WT.line}`,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
      }}
    >
      <WIcon name="info" size={16} color={WT.ink2} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            color: WT.ink,
            fontWeight: 600,
            marginBottom: 2,
          }}
        >
          {aviso.titulo}
        </div>
        {aviso.valor && (
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 18,
              color: WT.ink,
              padding: '6px 10px',
              background: WT.lineSoft,
              borderRadius: 6,
              margin: '4px 0',
              letterSpacing: 1,
              userSelect: 'all',
            }}
          >
            {aviso.valor}
          </div>
        )}
        <div style={{ fontSize: 12, color: WT.ink3 }}>{aviso.ajuda}</div>
      </div>
      {aviso.valor && (
        <WButton
          kind="ghost"
          size="sm"
          icon="copy"
          onClick={() => {
            navigator.clipboard?.writeText(aviso.valor);
          }}
        >
          copiar
        </WButton>
      )}
      <WButton kind="ghost" size="sm" icon="x" onClick={onFechar}>
        fechar
      </WButton>
    </div>
  );
}
