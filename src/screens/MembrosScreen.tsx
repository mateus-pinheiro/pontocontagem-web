'use client';

import { useCallback, useEffect, useState } from 'react';
import { WT } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import { api, ApiError, type Membro, type Role } from '@/lib/api';
import { labelRole } from '@/lib/format';
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

const PAINEL_NOMES = new Set(['ADMIN', 'Gerente']);
const COLAB_NOME = 'Colaborador';

export default function MembrosScreen() {
  const T = WT;
  const { usuario } = useAuth();
  const [membros, setMembros] = useState<Membro[] | null>(null);
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<ModoDrawer>({ tipo: 'fechado' });
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [modalCodigo, setModalCodigo] = useState<{
    codigo: string;
    nome: string;
  } | null>(null);

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
          <div style={{ overflowX: 'auto' }}>
            <WTable>
              <thead>
                <WTr>
                  <WTh>nome</WTh>
                  <WTh width={130}>documento</WTh>
                  <WTh width={200}>email</WTh>
                  <WTh width={90}>senha</WTh>
                  <WTh width={100}>código</WTh>
                  <WTh width={80}>PIN</WTh>
                  <WTh width={170}>funções</WTh>
                  <WTh width={80} align="right">
                    status
                  </WTh>
                  <WTh width={100} align="right" />
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
                          {m.documento || (
                            <span style={{ color: T.ink4 }}>—</span>
                          )}
                        </div>
                      </WTd>
                      <WTd>
                        <div style={{ fontSize: 13 }}>
                          {m.email || (
                            <span style={{ color: T.ink4 }}>—</span>
                          )}
                        </div>
                      </WTd>
                      <WTd>
                        {m.temSenha ? (
                          <WTag tone="green" size="xs">
                            definida
                          </WTag>
                        ) : (
                          <span style={{ color: T.ink4 }}>—</span>
                        )}
                      </WTd>
                      <WTd>
                        {m.codigoAcesso ? (
                          <span
                            style={{
                              fontFamily: T.fontMono,
                              fontSize: 12,
                              letterSpacing: 1,
                              color: T.terraInk,
                              fontWeight: 600,
                              userSelect: 'all',
                            }}
                          >
                            {m.codigoAcesso}
                          </span>
                        ) : (
                          <span style={{ color: T.ink4 }}>—</span>
                        )}
                      </WTd>
                      <WTd>
                        {m.temPin ? (
                          <WTag tone="green" size="xs">
                            definido
                          </WTag>
                        ) : (
                          <span style={{ color: T.ink4 }}>—</span>
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
                              {labelRole(r.nome)}
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
          </div>
        )}
      </div>

      <DrawerMembro
        modo={drawer}
        roles={roles}
        onClose={() => setDrawer({ tipo: 'fechado' })}
        onCriar={async (body) => {
          setErro(null);
          try {
            const r = await api.criarMembro(body);
            await carregar();
            if (r.codigoAcesso) {
              setModalCodigo({ codigo: r.codigoAcesso, nome: r.nome });
            } else {
              setAviso({
                titulo: 'membro criado',
                valor: '',
                ajuda: 'cadastrado com sucesso.',
              });
            }
          } catch (e) {
            setErro(
              e instanceof ApiError ? e.message : 'erro ao executar ação',
            );
            throw e;
          }
        }}
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

      {modalCodigo && (
        <ModalCodigo
          codigo={modalCodigo.codigo}
          nome={modalCodigo.nome}
          onFechar={() => setModalCodigo(null)}
        />
      )}
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
  const [ativo, setAtivo] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erros, setErros] = useState<
    Partial<
      Record<'roles' | 'nome' | 'documento' | 'cargo' | 'email' | 'senha', string>
    >
  >({});
  const [shake, setShake] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const rolesSel = roles.filter((r) => roleIds.includes(r.id));
  const temPainel = rolesSel.some((r) => PAINEL_NOMES.has(r.nome));
  const temColab = rolesSel.some((r) => r.nome === COLAB_NOME);

  useEffect(() => {
    if (modo.tipo === 'fechado') return;
    setErros({});
    setShake(false);
    setSucesso(false);
    if (modo.tipo === 'novo') {
      setNome('');
      setEmail('');
      setDocumento('');
      setCargo('');
      setRoleIds([]);
      setSenha('');
      setAtivo(true);
    } else {
      const m = modo.membro;
      setNome(m.nome);
      setEmail(m.email ?? '');
      setDocumento(m.documento ?? '');
      setCargo(m.cargo ?? '');
      setRoleIds(m.roles.map((r) => r.id));
      setSenha('');
      setAtivo(m.ativo);
    }
  }, [modo]);

  function toggleRole(id: string) {
    setRoleIds((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );
  }

  function validarNovo() {
    const e: typeof erros = {};
    if (roleIds.length === 0) e.roles = 'escolha pelo menos uma função';
    if (!nome.trim()) e.nome = 'obrigatório';
    if (!documento.trim()) e.documento = 'obrigatório';
    if (!cargo.trim()) e.cargo = 'obrigatório';
    if (temPainel) {
      if (!email.trim() || !/.+@.+\..+/.test(email.trim()))
        e.email = 'email válido obrigatório';
      if (senha.length < 6) e.senha = 'mínimo 6 caracteres';
    }
    return e;
  }

  async function salvar() {
    if (novo) {
      const e = validarNovo();
      if (Object.keys(e).length > 0) {
        setErros(e);
        setShake(true);
        setTimeout(() => setShake(false), 450);
        return;
      }
      setErros({});
    }
    setSalvando(true);
    try {
      if (novo) {
        await onCriar({
          nome: nome.trim(),
          email: temPainel ? email.trim() : undefined,
          documento: documento.trim() || undefined,
          cargo: cargo.trim() || undefined,
          roleIds,
          senha: temPainel ? senha : undefined,
          gerarCodigo: temColab,
        });
        setSucesso(true);
        setTimeout(() => {
          setSucesso(false);
          onClose();
        }, 700);
      } else if (editar) {
        await onSalvar(editar.id, {
          cargo: cargo.trim() || undefined,
          roleIds,
          ativo,
        });
        onClose();
      }
    } catch {
      // erro já tratado no parent (setErro). drawer continua aberto.
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
            disabled={salvando || sucesso}
            onClick={salvar}
            style={
              shake
                ? {
                    animation: 'wShake .4s',
                    boxShadow: `0 0 0 2px ${WT.danger}`,
                  }
                : sucesso
                  ? {
                      boxShadow: `0 0 0 2px ${WT.green}`,
                      background: `linear-gradient(90deg, ${WT.green} 0%, ${WT.greenSoft} 50%, ${WT.green} 100%)`,
                      backgroundSize: '200% 100%',
                      animation: 'wShimmer 1.2s linear infinite',
                      color: '#fff',
                    }
                  : undefined
            }
          >
            {sucesso
              ? 'pronto!'
              : salvando
                ? 'salvando…'
                : novo
                  ? 'criar'
                  : 'salvar'}
          </WButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              padding: erros.roles ? 6 : 0,
              border: erros.roles
                ? `1px solid ${WT.danger}`
                : '1px solid transparent',
              borderRadius: 8,
            }}
          >
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
                <span style={{ fontWeight: 600 }}>{labelRole(r.nome)}</span>
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
          {erros.roles && (
            <div
              style={{
                color: WT.danger,
                fontSize: 12,
                marginTop: 4,
                fontWeight: 500,
              }}
            >
              {erros.roles}
            </div>
          )}
        </div>

        {novo && (
          <>
            <WInput
              label="nome"
              value={nome}
              onChange={setNome}
              placeholder="nome completo"
              error={erros.nome}
            />
            <WInput
              label="documento (CPF)"
              value={documento}
              onChange={setDocumento}
              placeholder="000.000.000-00"
              error={erros.documento}
            />
          </>
        )}

        <WInput
          label="cargo"
          value={cargo}
          onChange={setCargo}
          placeholder="ex.: caixa, cozinha, gerente"
          error={novo ? erros.cargo : undefined}
        />

        {novo && temPainel && (
          <>
            <WInput
              label="email"
              value={email}
              onChange={setEmail}
              placeholder="seu@email.com"
              type="email"
              error={erros.email}
            />
            <WInput
              label="senha inicial"
              value={senha}
              onChange={setSenha}
              placeholder="≥ 6 caracteres — troca no 1º login"
              type="password"
              error={erros.senha}
            />
          </>
        )}

        {novo && temColab && (
          <div
            style={{
              fontSize: 12,
              color: WT.ink3,
              padding: '8px 10px',
              background: WT.lineSoft,
              borderRadius: 8,
              lineHeight: 1.4,
            }}
          >
            um código de acesso será gerado automaticamente para login no app
            (o membro define o PIN no primeiro acesso).
          </div>
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

function ModalCodigo({
  codigo,
  nome,
  onFechar,
}: {
  codigo: string;
  nome: string;
  onFechar: () => void;
}) {
  const [copiado, setCopiado] = useState(false);
  return (
    <div
      onClick={onFechar}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20,18,15,0.42)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        animation: 'wfade .2s',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: WT.surface,
          borderRadius: 14,
          padding: 24,
          width: 380,
          maxWidth: '90vw',
          boxShadow: '0 20px 60px rgba(0,0,0,.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: WT.ink,
              letterSpacing: -0.2,
            }}
          >
            código de acesso de {nome}
          </div>
          <div
            style={{
              fontSize: 12,
              color: WT.ink3,
              marginTop: 4,
              lineHeight: 1.4,
            }}
          >
            compartilhe com o membro. ele vai usar esse código + criar um PIN no
            primeiro acesso pelo app.
          </div>
        </div>
        <div
          style={{
            fontFamily: WT.fontMono,
            fontSize: 24,
            letterSpacing: 3,
            padding: '14px 16px',
            background: WT.lineSoft,
            borderRadius: 10,
            textAlign: 'center',
            userSelect: 'all',
            color: WT.ink,
            fontWeight: 600,
          }}
        >
          {codigo}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <WButton
            kind={copiado ? 'success' : 'primary'}
            size="md"
            icon={copiado ? 'check' : 'copy'}
            fullWidth
            onClick={() => {
              navigator.clipboard?.writeText(codigo);
              setCopiado(true);
              setTimeout(() => setCopiado(false), 1800);
            }}
          >
            {copiado ? 'copiado!' : 'copiar código'}
          </WButton>
          <WButton kind="neutral" size="md" onClick={onFechar}>
            fechar
          </WButton>
        </div>
      </div>
    </div>
  );
}
