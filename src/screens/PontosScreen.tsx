'use client';

import { useMemo, useState } from 'react';
import { WT } from '@/lib/theme';
import { api, type Ponto, type TipoPonto } from '@/lib/api';
import { useApi } from '@/lib/useApi';
import {
  fmtDataContagem,
  fmtHora,
  TIPO_PONTO_LABEL,
} from '@/lib/format';
import { useSearch } from '@/components/shell';
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
  WSegmented,
  WSelect,
  WTable,
  WTag,
  WTd,
  WTh,
  WToolbar,
  WTr,
} from '@/components/ui';

const TIPO_META: Record<TipoPonto, { tone: 'green' | 'neutral'; icon: string }> =
  {
    ENTRADA: { tone: 'green', icon: 'enter' },
    INICIO_PAUSA: { tone: 'neutral', icon: 'pause' },
    FIM_PAUSA: { tone: 'green', icon: 'play' },
    SAIDA: { tone: 'neutral', icon: 'exit' },
  };

function intervalo(scope: string) {
  const d = new Date();
  const fmt = (x: Date) =>
    `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(x.getDate()).padStart(2, '0')}`;
  const ate = fmt(d);
  if (scope === 'hoje') return { de: fmt(d), ate };
  const de = new Date(d);
  de.setDate(d.getDate() - (scope === 'semana' ? 6 : 29));
  return { de: fmt(de), ate };
}

export default function PontosScreen() {
  const T = WT;
  const { search } = useSearch();
  const [scope, setScope] = useState('hoje');
  const [funcFilter, setFuncFilter] = useState('todos');
  const [edit, setEdit] = useState<string | null>(null);

  const { de, ate } = useMemo(() => intervalo(scope), [scope]);
  const { data, loading, erro, reload } = useApi(
    () =>
      api.pontos({
        de,
        ate,
        membershipId:
          funcFilter === 'todos' ? undefined : funcFilter,
      }),
    [de, ate, funcFilter],
  );
  const { data: funcsData } = useApi(() => api.membros(), []);
  const funcionarios = funcsData?.filter((m) => m.ativo) ?? [];
  const nomePor = useMemo(
    () => new Map(funcionarios.map((m) => [m.id, m.nome])),
    [funcionarios],
  );

  const pontos = (data ?? []).filter((p) => {
    const nome = nomePor.get(p.funcionario.id) ?? '';
    return !search || nome.toLowerCase().includes(search.toLowerCase());
  });
  const editando = edit ? pontos.find((p) => p.id === edit) || null : null;

  return (
    <>
      <WPageHeader
        breadcrumb="operação"
        title="pontos"
        subtitle="todos os registros do restaurante. clique numa linha pra corrigir."
        actions={
          <WButton
            kind="neutral"
            size="md"
            icon="refresh"
            onClick={reload}
          >
            atualizar
          </WButton>
        }
      />

      <WToolbar>
        <WSegmented
          value={scope}
          onChange={setScope}
          options={[
            { value: 'hoje', label: 'hoje' },
            { value: 'semana', label: 'esta semana' },
            { value: 'mes', label: 'este mês' },
          ]}
        />
        <div style={{ minWidth: 220 }}>
          <WSelect
            size="sm"
            value={funcFilter}
            onChange={setFuncFilter}
            options={[
              { value: 'todos', label: 'todos os funcionários' },
              ...funcionarios.map((f) => ({
                value: f.id,
                label: f.nome,
              })),
            ]}
          />
        </div>
        <div style={{ flex: 1 }} />
        <WButton kind="ghost" size="sm" icon="filter">
          mais filtros
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
                  <WTh width={32} />
                  <WTh>funcionário</WTh>
                  <WTh>data</WTh>
                  <WTh>hora</WTh>
                  <WTh>tipo</WTh>
                  <WTh>status</WTh>
                  <WTh align="right" width={56} />
                </tr>
              </thead>
              <tbody>
                {pontos.map((p) => {
                  const meta = TIPO_META[p.tipo];
                  return (
                    <WTr key={p.id} onClick={() => setEdit(p.id)}>
                      <WTd>
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background:
                              meta.tone === 'green'
                                ? T.greenSoft
                                : T.lineSoft,
                            color:
                              meta.tone === 'green'
                                ? T.greenInk
                                : T.ink2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <WIcon
                            name={meta.icon}
                            size={14}
                            color="currentColor"
                          />
                        </div>
                      </WTd>
                      <WTd nowrap>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                          }}
                        >
                          <WAvatar
                            name={nomePor.get(p.funcionario.id) ?? '—'}
                            size={26}
                          />
                          <span
                            style={{
                              fontWeight: 600,
                              color: T.ink,
                              letterSpacing: -0.1,
                            }}
                          >
                            {nomePor.get(p.funcionario.id) ?? '—'}
                          </span>
                        </div>
                      </WTd>
                      <WTd
                        nowrap
                        style={{
                          color: T.ink2,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {fmtDataContagem(p.registradoEm)}
                      </WTd>
                      <WTd
                        nowrap
                        style={{
                          fontVariantNumeric: 'tabular-nums',
                          fontWeight: 600,
                          color: T.ink,
                          fontFamily: T.fontMono,
                        }}
                      >
                        {fmtHora(p.registradoEm)}
                        {p.corrigido && p.valorAnterior && (
                          <span
                            style={{
                              fontSize: 11,
                              color: T.ink3,
                              marginLeft: 6,
                              textDecoration: 'line-through',
                            }}
                          >
                            {fmtHora(p.valorAnterior)}
                          </span>
                        )}
                      </WTd>
                      <WTd
                        style={{ color: T.ink, fontWeight: 500 }}
                      >
                        {TIPO_PONTO_LABEL[p.tipo]}
                      </WTd>
                      <WTd>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {!p.sincronizado && (
                            <WTag tone="amber" size="xs" dot>
                              pendente sync
                            </WTag>
                          )}
                          {p.corrigido && (
                            <WTag tone="blue" size="xs">
                              corrigido
                            </WTag>
                          )}
                          {p.suspeito && (
                            <WTag tone="danger" size="xs" dot>
                              relógio suspeito
                            </WTag>
                          )}
                          {p.sincronizado &&
                            !p.corrigido &&
                            !p.suspeito && (
                              <WTag tone="green" size="xs" dot>
                                ok
                              </WTag>
                            )}
                        </div>
                      </WTd>
                      <WTd align="right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEdit(p.id);
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
                          <WIcon
                            name="edit"
                            size={15}
                            color={T.ink3}
                          />
                        </button>
                      </WTd>
                    </WTr>
                  );
                })}
              </tbody>
            </WTable>
            {pontos.length === 0 && (
              <div
                style={{
                  padding: '40px 0',
                  textAlign: 'center',
                  color: T.ink3,
                  fontWeight: 500,
                  fontSize: 14,
                }}
              >
                nenhum ponto nesse período.
              </div>
            )}
          </WCard>
        </div>
      )}

      {editando && (
        <CorrigirPontoDrawer
          ponto={editando}
          nome={nomePor.get(editando.funcionario.id) ?? '—'}
          onClose={() => setEdit(null)}
          onSaved={() => {
            setEdit(null);
            reload();
          }}
        />
      )}
    </>
  );
}

function CorrigirPontoDrawer({
  ponto,
  nome,
  onClose,
  onSaved,
}: {
  ponto: Ponto;
  nome: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const T = WT;
  const d = new Date(ponto.registradoEm);
  const pad = (n: number) => String(n).padStart(2, '0');
  const [data, setData] = useState(
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
  );
  const [hora, setHora] = useState(
    `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  );
  const [justificativa, setJustificativa] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function salvar() {
    setErro(null);
    if (justificativa.trim().length < 3)
      return setErro('explique o motivo da correção.');
    const novo = new Date(`${data}T${hora}:00`);
    if (isNaN(novo.getTime())) return setErro('data/hora inválida.');
    setSalvando(true);
    try {
      await api.corrigirPonto(ponto.id, {
        registradoEm: novo.toISOString(),
        justificativa: justificativa.trim(),
      });
      onSaved();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'erro ao salvar');
      setSalvando(false);
    }
  }

  const campo: React.CSSProperties = {
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
  };

  return (
    <WDrawer
      open
      onClose={onClose}
      title="corrigir ponto"
      subtitle={`${nome} · ${TIPO_PONTO_LABEL[ponto.tipo]}`}
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
            salvar correção
          </WButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {ponto.corrigido && (
          <div
            style={{
              padding: 12,
              background: T.blueSoft,
              borderRadius: 10,
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
            }}
          >
            <WIcon name="info" size={16} color={T.blue} />
            <div
              style={{ fontSize: 13, color: T.ink2, lineHeight: 1.45 }}
            >
              <strong style={{ color: T.blue }}>
                já foi corrigido
              </strong>{' '}
              — valor original{' '}
              {ponto.valorAnterior
                ? fmtHora(ponto.valorAnterior)
                : '—'}
              {ponto.justificativa
                ? `. motivo anterior: ${ponto.justificativa}`
                : ''}
              .
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}
        >
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
              style={campo}
            />
          </label>
          <label style={{ display: 'block', fontFamily: T.font }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: T.ink2,
                marginBottom: 6,
              }}
            >
              hora
            </div>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              style={campo}
            />
          </label>
        </div>
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: T.ink2,
              marginBottom: 6,
            }}
          >
            justificativa
          </div>
          <textarea
            value={justificativa}
            onChange={(e) => setJustificativa(e.target.value)}
            placeholder="ex: funcionário esqueceu de bater o ponto na saída"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              minHeight: 88,
              padding: '10px 12px',
              background: T.surface2,
              border: `1px solid ${T.line}`,
              borderRadius: 8,
              fontFamily: T.font,
              fontSize: 14,
              color: T.ink,
              outline: 'none',
              resize: 'vertical',
            }}
          />
          <div
            style={{
              fontSize: 12,
              color: T.ink3,
              marginTop: 6,
              fontWeight: 500,
            }}
          >
            o valor original fica salvo no histórico do ponto.
          </div>
        </div>
      </div>
    </WDrawer>
  );
}
