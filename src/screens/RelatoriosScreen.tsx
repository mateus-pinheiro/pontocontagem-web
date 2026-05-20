'use client';

import { useState } from 'react';
import { WT } from '@/lib/theme';
import { api } from '@/lib/api';
import { useApi } from '@/lib/useApi';
import { fmtNum, fmtQtd } from '@/lib/format';
import {
  WAvatar,
  WButton,
  WCard,
  WErro,
  WLoading,
  WPageHeader,
  WSelect,
  WStat,
  WTag,
} from '@/components/ui';

export default function RelatoriosScreen() {
  const T = WT;
  const [period, setPeriod] = useState('semana');
  const { data, loading, erro, reload } = useApi(
    () => api.relatorios(period),
    [period],
  );

  const maxHoras = Math.max(
    1,
    ...(data?.porFuncionario.map((r) => r.horas) ?? [1]),
  );

  return (
    <>
      <WPageHeader
        breadcrumb="análise"
        title="relatórios"
        subtitle="horas trabalhadas, estoque atual e tendências"
        actions={
          <>
            <WSelect
              size="md"
              value={period}
              onChange={setPeriod}
              options={[
                { value: 'semana', label: 'esta semana' },
                { value: 'semanaAnt', label: 'semana passada' },
                { value: 'mes', label: 'este mês' },
              ]}
            />
            <WButton
              kind="neutral"
              size="md"
              icon="refresh"
              onClick={reload}
            >
              atualizar
            </WButton>
          </>
        }
      />

      {loading && <WLoading />}
      {erro && <WErro mensagem={erro} onRetry={reload} />}

      {data && (
        <div
          style={{
            padding: '0 32px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 14,
            }}
          >
            <WStat
              icon="clock"
              accent="green"
              label="horas totais"
              value={`${fmtNum(data.stats.horasTotais)}h`}
              sub={`${data.stats.funcionariosAtivos} funcionários`}
            />
            <WStat
              icon="people"
              accent="blue"
              label="dias trabalhados"
              value={data.stats.diasTrabalhados}
              sub="soma de todos"
            />
            <WStat
              icon="pause"
              accent="amber"
              label="horas em pausa"
              value={`${fmtNum(data.stats.horasPausa)}h`}
              sub={`${data.stats.pctPausa}% do total`}
            />
            <WStat
              icon="clipboard"
              accent="terra"
              label="contagens fechadas"
              value={data.stats.contagensFechadas}
              sub="no período"
            />
          </div>

          {/* Horas por funcionário */}
          <WCard padding={0}>
            <div
              style={{
                padding: '16px 20px',
                borderBottom: `1px solid ${T.line}`,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: T.ink,
                    letterSpacing: -0.2,
                  }}
                >
                  horas por funcionário
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: T.ink3,
                    marginTop: 2,
                    fontWeight: 500,
                  }}
                >
                  ordenado do maior pro menor
                </div>
              </div>
            </div>
            <div style={{ padding: '14px 20px' }}>
              {data.porFuncionario.length === 0 && (
                <div
                  style={{
                    padding: '20px 0',
                    color: T.ink3,
                    fontWeight: 500,
                    fontSize: 14,
                  }}
                >
                  ninguém registrou ponto no período.
                </div>
              )}
              {data.porFuncionario.map((r) => (
                <div
                  key={r.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '200px 1fr 120px 90px',
                    gap: 14,
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: `1px solid ${T.lineSoft}`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <WAvatar name={r.nome} size={28} />
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: T.ink,
                        letterSpacing: -0.1,
                      }}
                    >
                      {r.nome}
                    </span>
                  </div>
                  <div style={{ position: 'relative', height: 18 }}>
                    <div
                      style={{
                        height: 18,
                        width: `${(r.horas / maxHoras) * 100}%`,
                        background: T.ink,
                        borderRadius: 4,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                    />
                    <div
                      style={{
                        height: 18,
                        width: `${(r.pausa / maxHoras) * 100}%`,
                        background: T.amber,
                        borderRadius: '0 4px 4px 0',
                        position: 'absolute',
                        top: 0,
                        left: `${(r.horas / maxHoras) * 100}%`,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: T.ink,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {fmtNum(r.horas)}
                    <span
                      style={{ color: T.ink3, fontWeight: 500 }}
                    >
                      h
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: T.ink3,
                      fontWeight: 500,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {r.dias}d · {fmtNum(r.pausa)}h pausa
                  </div>
                </div>
              ))}
              <div
                style={{
                  display: 'flex',
                  gap: 18,
                  marginTop: 14,
                  fontSize: 12,
                  color: T.ink2,
                  fontWeight: 500,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      background: T.ink,
                      borderRadius: 3,
                    }}
                  />
                  trabalhado
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      background: T.amber,
                      borderRadius: 3,
                    }}
                  />
                  em pausa
                </div>
              </div>
            </div>
          </WCard>

          {/* Estoque atual */}
          <WCard padding={0}>
            <div
              style={{
                padding: '16px 20px',
                borderBottom: `1px solid ${T.line}`,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: T.ink,
                    letterSpacing: -0.2,
                  }}
                >
                  estoque atual
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: T.ink3,
                    marginTop: 2,
                    fontWeight: 500,
                  }}
                >
                  último valor contado de cada item
                </div>
              </div>
            </div>
            <div
              style={{
                padding: 16,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 10,
              }}
            >
              {data.estoqueAtual.length === 0 && (
                <div
                  style={{
                    gridColumn: '1 / -1',
                    padding: '20px 0',
                    color: T.ink3,
                    fontWeight: 500,
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  nenhuma contagem registrada ainda.
                </div>
              )}
              {data.estoqueAtual.slice(0, 12).map((i) => (
                <div
                  key={i.id}
                  style={{
                    padding: '12px 14px',
                    border: `1px solid ${T.line}`,
                    borderRadius: 10,
                    background: T.surface2,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <WTag
                      tone={(i.categoria.cor ?? 'neutral') as never}
                      size="xs"
                    >
                      {i.categoria.nome}
                    </WTag>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: T.ink,
                      marginTop: 6,
                      letterSpacing: -0.1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {i.nome}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 4,
                      marginTop: 4,
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
                      {fmtQtd(i.ultimoEstoque)}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: T.terra,
                        fontWeight: 600,
                      }}
                    >
                      {i.unidade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </WCard>
        </div>
      )}
    </>
  );
}
