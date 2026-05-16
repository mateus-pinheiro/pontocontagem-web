'use client';

import { useEffect, useState } from 'react';
import { WT } from '@/lib/theme';
import { api, type Funcionario, type Lista } from '@/lib/api';
import { useApi } from '@/lib/useApi';
import { fmtPontoRel } from '@/lib/format';
import { useSearch } from '@/components/shell';
import {
  WAvatar,
  WButton,
  WCard,
  WDrawer,
  WEmpty,
  WErro,
  WIcon,
  WInput,
  WLoading,
  WPageHeader,
  WSegmented,
  WTable,
  WTag,
  WTd,
  WTh,
  WToolbar,
  WTr,
} from '@/components/ui';

export default function FuncionariosScreen() {
  const T = WT;
  const { search } = useSearch();
  const [filter, setFilter] = useState('ativos');
  const [drawer, setDrawer] = useState<string | null>(null); // 'new' | id
  const { data, loading, erro, reload } = useApi(
    () => api.funcionarios(),
    [],
  );
  const { data: listasData } = useApi(() => api.listas(), []);

  const todos = data?.dados ?? [];
  const listas = listasData ?? [];

  const list = todos.filter((f) => {
    if (filter === 'ativos' && !f.ativo) return false;
    if (filter === 'inativos' && f.ativo) return false;
    if (search && !f.nome.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const ativos = todos.filter((f) => f.ativo).length;
  const inativos = todos.length - ativos;
  const editing =
    drawer && drawer !== 'new'
      ? todos.find((f) => f.id === drawer) || null
      : null;

  return (
    <>
      <WPageHeader
        breadcrumb="cadastros"
        title="funcionários"
        subtitle={`${ativos} ativos no Tasca da Esquina`}
        actions={
          <WButton
            kind="primary"
            size="md"
            icon="plus"
            onClick={() => setDrawer('new')}
          >
            novo funcionário
          </WButton>
        }
      />

      <WToolbar>
        <WSegmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'ativos', label: `ativos (${ativos})` },
            { value: 'inativos', label: `inativos (${inativos})` },
            { value: 'todos', label: 'todos' },
          ]}
        />
        <div style={{ flex: 1 }} />
        <WButton kind="ghost" size="sm" icon="filter">
          filtros
        </WButton>
      </WToolbar>

      {loading && <WLoading />}
      {erro && <WErro mensagem={erro} onRetry={reload} />}

      {data && (
        <div style={{ padding: '0 32px 32px' }}>
          <WCard padding={0}>
            <WTable>
              <thead>
                <tr>
                  <WTh>nome</WTh>
                  <WTh>cargo</WTh>
                  <WTh>listas atribuídas</WTh>
                  <WTh>último ponto</WTh>
                  <WTh>status</WTh>
                  <WTh align="right" width={56} />
                </tr>
              </thead>
              <tbody>
                {list.map((f) => (
                  <WTr key={f.id} onClick={() => setDrawer(f.id)}>
                    <WTd nowrap>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <WAvatar name={f.nome} size={32} />
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              color: T.ink,
                              letterSpacing: -0.1,
                            }}
                          >
                            {f.nome}
                          </div>
                          {!f.ativo && (
                            <div
                              style={{
                                fontSize: 11,
                                color: T.ink3,
                                fontWeight: 500,
                                marginTop: 1,
                              }}
                            >
                              inativo
                            </div>
                          )}
                        </div>
                      </div>
                    </WTd>
                    <WTd style={{ color: T.ink2 }}>{f.cargo || '—'}</WTd>
                    <WTd>
                      {f.listas.length === 0 ? (
                        <span style={{ color: T.ink3, fontSize: 13 }}>
                          —
                        </span>
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            gap: 4,
                            flexWrap: 'wrap',
                          }}
                        >
                          {f.listas.map((l) => (
                            <WTag key={l.id} tone="neutral" size="xs">
                              {l.nome}
                            </WTag>
                          ))}
                        </div>
                      )}
                    </WTd>
                    <WTd
                      nowrap
                      style={{
                        color: T.ink2,
                        fontSize: 13,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {fmtPontoRel(f.ultimoPonto?.registradoEm)}
                    </WTd>
                    <WTd nowrap>
                      {f.status === 'trabalhando' && (
                        <WTag tone="green" dot>
                          trabalhando
                        </WTag>
                      )}
                      {f.status === 'em pausa' && (
                        <WTag tone="amber" dot>
                          em pausa
                        </WTag>
                      )}
                      {f.status === 'fora' && (
                        <WTag tone="neutral" dot>
                          fora
                        </WTag>
                      )}
                      {f.status === 'inativo' && (
                        <WTag tone="neutral">inativo</WTag>
                      )}
                    </WTd>
                    <WTd align="right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDrawer(f.id);
                        }}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 7,
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <WIcon name="moreH" size={16} color={T.ink3} />
                      </button>
                    </WTd>
                  </WTr>
                ))}
              </tbody>
            </WTable>
            {list.length === 0 && (
              <WEmpty
                icon="people"
                title="nenhum funcionário encontrado"
                subtitle="ajuste o filtro ou cadastre alguém novo."
                action={
                  <WButton
                    kind="primary"
                    size="md"
                    icon="plus"
                    onClick={() => setDrawer('new')}
                  >
                    novo funcionário
                  </WButton>
                }
              />
            )}
          </WCard>
        </div>
      )}

      {drawer && (
        <FuncionarioDrawer
          funcionario={editing}
          isNew={drawer === 'new'}
          listas={listas}
          onClose={() => setDrawer(null)}
          onSaved={() => {
            setDrawer(null);
            reload();
          }}
        />
      )}
    </>
  );
}

function FuncionarioDrawer({
  funcionario,
  isNew,
  listas,
  onClose,
  onSaved,
}: {
  funcionario: Funcionario | null;
  isNew: boolean;
  listas: Lista[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const T = WT;
  const [nome, setNome] = useState(funcionario?.nome || '');
  const [cargo, setCargo] = useState(funcionario?.cargo || '');
  const [listaIds, setListaIds] = useState<string[]>(
    funcionario?.listas.map((l) => l.id) || [],
  );
  const [ativo, setAtivo] = useState(funcionario?.ativo ?? true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    setNome(funcionario?.nome || '');
    setCargo(funcionario?.cargo || '');
    setListaIds(funcionario?.listas.map((l) => l.id) || []);
    setAtivo(funcionario?.ativo ?? true);
  }, [funcionario]);

  function toggle(id: string) {
    setListaIds((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  }

  async function salvar() {
    setErro(null);
    if (nome.trim().length < 2) {
      setErro('o nome precisa de pelo menos 2 letras.');
      return;
    }
    setSalvando(true);
    try {
      if (isNew) {
        await api.criarFuncionario({
          nome: nome.trim(),
          cargo: cargo.trim() || undefined,
          listaIds,
        });
      } else if (funcionario) {
        await api.atualizarFuncionario(funcionario.id, {
          nome: nome.trim(),
          cargo: cargo.trim() || undefined,
          ativo,
          listaIds,
        });
      }
      onSaved();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'erro ao salvar');
      setSalvando(false);
    }
  }

  async function desativar() {
    if (!funcionario) return;
    setSalvando(true);
    setErro(null);
    try {
      await api.atualizarFuncionario(funcionario.id, { ativo: false });
      onSaved();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'erro ao desativar');
      setSalvando(false);
    }
  }

  async function resetarPin() {
    if (!funcionario) return;
    setErro(null);
    try {
      const r = await api.resetarPin(funcionario.id);
      setMsg(r.mensagem);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'erro ao resetar PIN');
    }
  }

  return (
    <WDrawer
      open
      onClose={onClose}
      title={isNew ? 'novo funcionário' : nome || 'funcionário'}
      subtitle={
        isNew
          ? 'preencha os dados pra cadastrar'
          : 'edite os dados ou veja o histórico'
      }
      footer={
        <>
          {!isNew && funcionario?.ativo && (
            <WButton
              kind="softDanger"
              size="md"
              icon="trash"
              onClick={desativar}
              disabled={salvando}
            >
              desativar
            </WButton>
          )}
          <div style={{ flex: 1 }} />
          <WButton kind="neutral" size="md" onClick={onClose}>
            cancelar
          </WButton>
          <WButton
            kind="primary"
            size="md"
            onClick={salvar}
            disabled={salvando}
          >
            {salvando ? 'salvando…' : 'salvar'}
          </WButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {!isNew && funcionario && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '8px 4px',
            }}
          >
            <WAvatar name={nome || '?'} size={64} photo />
            <div style={{ flex: 1 }}>
              <WTag
                tone={
                  funcionario.pinDefinido ? 'green' : 'amber'
                }
                size="sm"
                dot
              >
                {funcionario.pinDefinido
                  ? 'PIN configurado'
                  : 'sem PIN ainda'}
              </WTag>
              <div
                style={{
                  fontSize: 12,
                  color: T.ink3,
                  marginTop: 6,
                  fontWeight: 500,
                }}
              >
                cadastrado em{' '}
                {new Date(funcionario.criadoEm).toLocaleDateString(
                  'pt-BR',
                )}
              </div>
            </div>
          </div>
        )}

        {erro && (
          <div
            style={{
              padding: '10px 12px',
              background: T.dangerSoft,
              borderRadius: 8,
              fontSize: 13,
              color: T.danger,
              fontWeight: 600,
            }}
          >
            {erro}
          </div>
        )}
        {msg && (
          <div
            style={{
              padding: '10px 12px',
              background: T.greenSoft,
              borderRadius: 8,
              fontSize: 13,
              color: T.greenInk,
              fontWeight: 600,
            }}
          >
            {msg}
          </div>
        )}

        <WInput
          label="nome completo"
          value={nome}
          onChange={setNome}
          placeholder="ex: Maria Aparecida"
          autoFocus={isNew}
        />
        <WInput
          label="cargo"
          value={cargo}
          onChange={setCargo}
          placeholder="ex: garçom, cozinheiro"
        />

        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: T.ink2,
              marginBottom: 8,
              letterSpacing: -0.1,
            }}
          >
            listas de contagem que pode fazer
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            {listas.length === 0 && (
              <div
                style={{ fontSize: 13, color: T.ink3, fontWeight: 500 }}
              >
                nenhuma lista cadastrada ainda.
              </div>
            )}
            {listas.map((l) => {
              const checked = listaIds.includes(l.id);
              return (
                <label
                  key={l.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    border: `1px solid ${checked ? T.ink : T.line}`,
                    borderRadius: 9,
                    background: checked ? T.lineSoft : T.surface2,
                    cursor: 'pointer',
                    transition: 'border-color .12s',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(l.id)}
                    style={{
                      accentColor: T.ink,
                      width: 16,
                      height: 16,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: T.ink,
                        letterSpacing: -0.1,
                      }}
                    >
                      {l.nome}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: T.ink3,
                        marginTop: 1,
                        fontWeight: 500,
                      }}
                    >
                      {l.totalItens} itens
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {!isNew && funcionario && (
          <div
            style={{
              padding: 14,
              background: T.amberSoft,
              borderRadius: 10,
              display: 'flex',
              gap: 10,
            }}
          >
            <WIcon name="key" size={18} color={T.amber} />
            <div
              style={{
                flex: 1,
                fontSize: 13,
                color: T.ink2,
                lineHeight: 1.45,
              }}
            >
              <strong style={{ color: T.amber }}>
                resetar PIN do aparelho
              </strong>
              <div style={{ marginTop: 4, color: T.ink2 }}>
                na próxima abertura do app, o funcionário cria um PIN
                novo.
              </div>
              <button
                onClick={resetarPin}
                style={{
                  marginTop: 8,
                  background: T.amber,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 7,
                  padding: '6px 12px',
                  fontFamily: T.font,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                resetar PIN
              </button>
            </div>
          </div>
        )}

        {!isNew && (
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 0',
              borderTop: `1px solid ${T.lineSoft}`,
            }}
          >
            <input
              type="checkbox"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
              style={{ accentColor: T.ink, width: 16, height: 16 }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: T.ink,
                  letterSpacing: -0.1,
                }}
              >
                funcionário ativo
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: T.ink3,
                  marginTop: 1,
                  fontWeight: 500,
                }}
              >
                ao desativar, ele some da lista no app mas mantém
                histórico aqui.
              </div>
            </div>
          </label>
        )}
      </div>
    </WDrawer>
  );
}
