'use client';

import { useEffect, useMemo, useState } from 'react';
import { WT } from '@/lib/theme';
import {
  api,
  type ContagemDetalhe,
  type ContagemResumo,
  type Lista,
  type Membro,
} from '@/lib/api';
import { useApi } from '@/lib/useApi';
import { fmtDataContagem, fmtQtd, hojeISO } from '@/lib/format';
import {
  WAvatar,
  WButton,
  WCard,
  WDrawer,
  WErro,
  WIcon,
  WInput,
  WLoading,
  WPageHeader,
  WTable,
  WTag,
  WTd,
  WTh,
  WTr,
} from '@/components/ui';

export default function ContagensScreen() {
  const T = WT;
  const [drawer, setDrawer] = useState<string | null>(null); // 'new' | id
  const { data, loading, erro, reload } = useApi(
    () => api.contagens(),
    [],
  );
  const { data: listasData } = useApi(() => api.listas(), []);
  const { data: funcsData } = useApi(() => api.membros(), []);

  const contagens = data ?? [];
  const listas = listasData ?? [];
  const funcionarios = funcsData ?? [];
  const totalDoTemplate = useMemo(
    () => new Map(listas.map((l) => [l.id, l.totalItens])),
    [listas],
  );

  const hoje = contagens.filter((c) => c.status !== 'FINALIZADA');
  const passadas = contagens.filter((c) => c.status === 'FINALIZADA');

  return (
    <>
      <WPageHeader
        breadcrumb="operação"
        title="contagens"
        subtitle="atribua, acompanhe e revise contagens de estoque"
        actions={
          <WButton
            kind="primary"
            size="md"
            icon="plus"
            onClick={() => setDrawer('new')}
          >
            nova contagem
          </WButton>
        }
      />

      {loading && <WLoading />}
      {erro && <WErro mensagem={erro} onRetry={reload} />}

      {data && (
        <div style={{ padding: '0 32px 32px' }}>
          {/* Hoje */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: 13,
                color: T.ink3,
                fontWeight: 700,
                letterSpacing: 0.4,
                textTransform: 'uppercase',
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>em aberto</span>
              <WTag tone="neutral" size="xs">
                {hoje.length}
              </WTag>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
              }}
            >
              {hoje.map((c) => (
                <ContagemCard
                  key={c.id}
                  c={c}
                  total={totalDoTemplate.get(c.template.id) ?? 0}
                  onClick={() => setDrawer(c.id)}
                />
              ))}
              <button
                onClick={() => setDrawer('new')}
                style={{
                  background: 'transparent',
                  border: `1.5px dashed ${T.line}`,
                  borderRadius: 14,
                  padding: '20px',
                  cursor: 'pointer',
                  minHeight: 132,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontFamily: T.font,
                  color: T.ink2,
                  transition: 'border-color .12s, background .12s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = T.ink3;
                  e.currentTarget.style.background = T.lineSoft;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = T.line;
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <WIcon name="plus" size={22} color={T.ink2} />
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: -0.1,
                  }}
                >
                  nova contagem
                </div>
              </button>
            </div>
          </div>

          {/* Histórico */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: T.ink3,
                  fontWeight: 700,
                  letterSpacing: 0.4,
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>histórico</span>
                <WTag tone="neutral" size="xs">
                  {passadas.length}
                </WTag>
              </div>
            </div>
            <WCard padding={0}>
              <WTable>
                <thead>
                  <tr>
                    <WTh>lista</WTh>
                    <WTh>data</WTh>
                    <WTh>finalizada em</WTh>
                    <WTh>itens</WTh>
                    <WTh>status</WTh>
                    <WTh align="right" width={80}>
                      ações
                    </WTh>
                  </tr>
                </thead>
                <tbody>
                  {passadas.map((c) => (
                    <WTr key={c.id} onClick={() => setDrawer(c.id)}>
                      <WTd nowrap>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 8,
                              background: T.lineSoft,
                              color: T.ink2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <WIcon
                              name="clipboard"
                              size={14}
                              color={T.ink2}
                            />
                          </div>
                          <div
                            style={{
                              fontWeight: 600,
                              color: T.ink,
                              letterSpacing: -0.1,
                            }}
                          >
                            {c.template.nome}
                          </div>
                        </div>
                      </WTd>
                      <WTd nowrap style={{ color: T.ink2 }}>
                        {fmtDataContagem(c.data)}
                      </WTd>
                      <WTd nowrap style={{ color: T.ink2 }}>
                        {c.finalizadaEm
                          ? fmtDataContagem(c.finalizadaEm)
                          : '—'}
                      </WTd>
                      <WTd
                        style={{
                          fontVariantNumeric: 'tabular-nums',
                          color: T.ink,
                          fontWeight: 600,
                        }}
                      >
                        {c.itensContados}/
                        {totalDoTemplate.get(c.template.id) ??
                          c.itensContados}
                      </WTd>
                      <WTd>
                        <WTag tone="green" dot>
                          finalizada
                        </WTag>
                      </WTd>
                      <WTd align="right">
                        <div
                          style={{ display: 'inline-flex', gap: 4 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <WButton
                            kind="ghost"
                            size="xs"
                            icon="eye"
                            onClick={() => setDrawer(c.id)}
                          >
                            ver
                          </WButton>
                        </div>
                      </WTd>
                    </WTr>
                  ))}
                </tbody>
              </WTable>
              {passadas.length === 0 && (
                <div
                  style={{
                    padding: '40px 0',
                    textAlign: 'center',
                    color: T.ink3,
                    fontWeight: 500,
                    fontSize: 14,
                  }}
                >
                  nenhuma contagem finalizada ainda.
                </div>
              )}
            </WCard>
          </div>
        </div>
      )}

      {drawer === 'new' && (
        <NovaContagemDrawer
          listas={listas}
          funcionarios={funcionarios}
          onClose={() => setDrawer(null)}
          onSaved={() => {
            setDrawer(null);
            reload();
          }}
        />
      )}
      {drawer && drawer !== 'new' && (
        <ContagemDetailDrawer
          contagemId={drawer}
          onClose={() => setDrawer(null)}
          onChanged={() => {
            setDrawer(null);
            reload();
          }}
        />
      )}
    </>
  );
}

function ContagemCard({
  c,
  total,
  onClick,
}: {
  c: ContagemResumo;
  total: number;
  onClick: () => void;
}) {
  const T = WT;
  const done = c.itensContados;
  const pct = total > 0 ? (done / total) * 100 : 0;
  const aberta = done === 0;
  return (
    <div
      onClick={onClick}
      style={{
        background: T.surface,
        border: `1px solid ${T.line}`,
        borderRadius: 14,
        padding: 16,
        cursor: 'pointer',
        transition:
          'border-color .12s, transform .12s, box-shadow .12s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = T.ink3;
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow =
          '0 8px 18px rgba(20,18,15,0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = T.line;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 11,
            background: aberta ? T.lineSoft : T.terraSoft,
            color: aberta ? T.ink2 : T.terraInk,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <WIcon name="clipboard" size={20} color="currentColor" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: T.ink,
              letterSpacing: -0.2,
            }}
          >
            {c.template.nome}
          </div>
          <div
            style={{
              fontSize: 12,
              color: T.ink2,
              marginTop: 1,
              fontWeight: 500,
            }}
          >
            {fmtDataContagem(c.data)}
          </div>
        </div>
        <WTag tone={aberta ? 'neutral' : 'terra'} size="xs" dot>
          {aberta ? 'aberta' : 'em andamento'}
        </WTag>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 12,
          color: T.ink2,
          fontWeight: 500,
          marginBottom: 8,
        }}
      >
        <WIcon name="people" size={14} color={T.ink3} />
        <span>
          {c.totalFuncionarios}{' '}
          {c.totalFuncionarios === 1 ? 'pessoa' : 'pessoas'}
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 6,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: T.ink,
            letterSpacing: -0.5,
          }}
        >
          {done}
        </span>
        <span style={{ fontSize: 13, color: T.ink3, fontWeight: 500 }}>
          de {total} itens
        </span>
      </div>
      <div
        style={{
          marginTop: 8,
          height: 4,
          background: T.lineSoft,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: aberta ? T.ink3 : T.terra,
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
}

function MetricTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent: 'green' | 'terra' | null;
}) {
  const T = WT;
  const bg =
    accent === 'green'
      ? T.greenSoft
      : accent === 'terra'
      ? T.terraSoft
      : T.lineSoft;
  const fg =
    accent === 'green'
      ? T.greenInk
      : accent === 'terra'
      ? T.terraInk
      : T.ink2;
  return (
    <div
      style={{
        padding: '12px 14px',
        background: accent ? bg : T.surface2,
        border: `1px solid ${accent ? 'transparent' : T.line}`,
        borderRadius: 10,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: fg,
          fontWeight: 700,
          letterSpacing: 0.4,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 600,
          color: accent ? fg : T.ink,
          letterSpacing: -0.5,
          marginTop: 4,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function NovaContagemDrawer({
  listas,
  funcionarios,
  onClose,
  onSaved,
}: {
  listas: Lista[];
  funcionarios: Membro[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const T = WT;
  const [templateId, setTemplateId] = useState(listas[0]?.id || '');
  const [data, setData] = useState(hojeISO());
  const [sel, setSel] = useState<string[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // (F1.3c) sem atribuição lista→pessoa; qualquer membro ativo pode contar.
  const candidatos = funcionarios.filter((f) => f.ativo);

  async function salvar() {
    setErro(null);
    if (!templateId) return setErro('escolha um template.');
    if (sel.length === 0)
      return setErro('atribua pelo menos 1 funcionário.');
    setSalvando(true);
    try {
      await api.criarContagem({
        templateId,
        data,
        membershipIds: sel,
      });
      onSaved();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'erro ao criar');
      setSalvando(false);
    }
  }

  return (
    <WDrawer
      open
      onClose={onClose}
      title="nova contagem"
      subtitle="escolha a lista, a data e quem vai contar"
      footer={
        <>
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
            criar e atribuir
          </WButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: T.ink2,
              marginBottom: 8,
            }}
          >
            template
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
          >
            {listas.map((l) => (
              <label
                key={l.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  border: `1px solid ${
                    l.id === templateId ? T.ink : T.line
                  }`,
                  borderRadius: 9,
                  background:
                    l.id === templateId ? T.lineSoft : T.surface2,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="tmpl"
                  checked={l.id === templateId}
                  onChange={() => {
                    setTemplateId(l.id);
                    setSel([]);
                  }}
                  style={{ accentColor: T.ink }}
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
            ))}
          </div>
        </div>
        <label style={{ display: 'block', fontFamily: T.font }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: T.ink2,
              marginBottom: 6,
            }}
          >
            data
          </div>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            style={{
              width: '100%',
              height: 38,
              background: T.surface2,
              border: `1px solid ${T.line}`,
              borderRadius: 8,
              padding: '0 12px',
              fontFamily: T.font,
              fontSize: 14,
              color: T.ink,
              outline: 'none',
            }}
          />
        </label>
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: T.ink2,
              marginBottom: 8,
            }}
          >
            atribuir para
          </div>
          <div
            style={{
              border: `1px solid ${T.line}`,
              borderRadius: 9,
              padding: 4,
              background: T.surface2,
              maxHeight: 240,
              overflow: 'auto',
            }}
          >
            {candidatos.length === 0 && (
              <div
                style={{
                  padding: 14,
                  fontSize: 13,
                  color: T.ink3,
                  fontWeight: 500,
                }}
              >
                ninguém habilitado nessa lista. atribua a lista a alguém
                em funcionários.
              </div>
            )}
            {candidatos.map((f) => {
              const checked = sel.includes(f.id);
              return (
                <label
                  key={f.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 7,
                    cursor: 'pointer',
                    background: checked ? T.lineSoft : 'transparent',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setSel((s) =>
                        checked
                          ? s.filter((x) => x !== f.id)
                          : [...s, f.id],
                      )
                    }
                    style={{
                      accentColor: T.ink,
                      width: 15,
                      height: 15,
                    }}
                  />
                  <WAvatar name={f.nome} size={26} />
                  <div
                    style={{
                      flex: 1,
                      fontSize: 13,
                      fontWeight: 600,
                      color: T.ink,
                      letterSpacing: -0.1,
                    }}
                  >
                    {f.nome}
                  </div>
                  <div style={{ fontSize: 12, color: T.ink3 }}>
                    {f.cargo || ''}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </WDrawer>
  );
}

function ContagemDetailDrawer({
  contagemId,
  onClose,
  onChanged,
}: {
  contagemId: string;
  onClose: () => void;
  onChanged: () => void;
}) {
  const T = WT;
  const [c, setC] = useState<ContagemDetalhe | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [agindo, setAgindo] = useState(false);

  useEffect(() => {
    api
      .contagem(contagemId)
      .then(setC)
      .catch((e) =>
        setErro(e instanceof Error ? e.message : 'erro ao carregar'),
      );
  }, [contagemId]);

  if (!c) {
    return (
      <WDrawer open onClose={onClose} title="contagem" width={520}>
        {erro ? (
          <div style={{ color: T.danger, fontWeight: 600 }}>{erro}</div>
        ) : (
          <WLoading />
        )}
      </WDrawer>
    );
  }

  const contados = c.itens.filter((i) => i.quantidade !== null);
  const finalizada = c.status === 'FINALIZADA';

  async function reabrir() {
    setAgindo(true);
    try {
      await api.reabrirContagem(c!.id);
      onChanged();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'erro ao reabrir');
      setAgindo(false);
    }
  }
  async function cancelar() {
    setAgindo(true);
    try {
      await api.cancelarContagem(c!.id);
      onChanged();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'erro ao cancelar');
      setAgindo(false);
    }
  }

  return (
    <WDrawer
      open
      onClose={onClose}
      width={520}
      title={`contagem de ${c.template.nome}`}
      subtitle={`${fmtDataContagem(c.data)} · ${
        finalizada
          ? `finalizada ${
              c.finalizadaEm ? fmtDataContagem(c.finalizadaEm) : ''
            }`
          : 'em aberto'
      }`}
      footer={
        finalizada ? (
          <>
            <WButton
              kind="softDanger"
              size="md"
              icon="refresh"
              onClick={reabrir}
              disabled={agindo}
            >
              reabrir contagem
            </WButton>
            <div style={{ flex: 1 }} />
            <WButton kind="primary" size="md" onClick={onClose}>
              fechar
            </WButton>
          </>
        ) : (
          <>
            <WButton
              kind="softDanger"
              size="md"
              icon="trash"
              onClick={cancelar}
              disabled={agindo}
            >
              cancelar contagem
            </WButton>
            <div style={{ flex: 1 }} />
            <WButton kind="primary" size="md" onClick={onClose}>
              fechar
            </WButton>
          </>
        )
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
          }}
        >
          <MetricTile
            label="contados"
            value={contados.length}
            accent="green"
          />
          <MetricTile label="total" value={c.itens.length} accent={null} />
          <MetricTile
            label="pessoas"
            value={c.atribuidos.length}
            accent={null}
          />
        </div>

        <div>
          <div
            style={{
              fontSize: 12,
              color: T.ink3,
              fontWeight: 700,
              letterSpacing: 0.4,
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            quem foi atribuído
          </div>
          <div
            style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
          >
            {c.atribuidos.map((a) => (
              <div
                key={a.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '4px 12px 4px 4px',
                  background: T.surface2,
                  border: `1px solid ${T.line}`,
                  borderRadius: 100,
                }}
              >
                <WAvatar name={a.nome} size={24} />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: T.ink,
                    letterSpacing: -0.1,
                  }}
                >
                  {a.nome.split(' ').slice(0, 2).join(' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: 12,
              color: T.ink3,
              fontWeight: 700,
              letterSpacing: 0.4,
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            itens contados
          </div>
          <div
            style={{
              border: `1px solid ${T.line}`,
              borderRadius: 11,
              overflow: 'hidden',
              background: T.surface2,
            }}
          >
            {c.itens.map((it, i) => (
              <div
                key={it.item.id}
                style={{
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  borderBottom:
                    i < c.itens.length - 1
                      ? `1px solid ${T.lineSoft}`
                      : 'none',
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    background: T.lineSoft,
                    color: T.ink2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: T.ink,
                      letterSpacing: -0.1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {it.item.nome}
                  </div>
                </div>
                {it.quantidade !== null ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 4,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: T.ink,
                      }}
                    >
                      {fmtQtd(it.quantidade)}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: T.ink3,
                        fontWeight: 600,
                      }}
                    >
                      {it.item.unidade}
                    </span>
                  </div>
                ) : (
                  <span
                    style={{
                      fontSize: 12,
                      color: T.ink4,
                      fontWeight: 600,
                    }}
                  >
                    não contado
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </WDrawer>
  );
}
