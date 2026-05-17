'use client';

import { useRouter } from 'next/navigation';
import { WT } from '@/lib/theme';
import { api, type Dashboard } from '@/lib/api';
import { useApi } from '@/lib/useApi';
import { fmtDataLonga } from '@/lib/format';
import {
  WAvatar,
  WButton,
  WCard,
  WErro,
  WIcon,
  WLoading,
  WPageHeader,
  WStat,
  WTag,
} from '@/components/ui';

export default function DashboardScreen() {
  const T = WT;
  const router = useRouter();
  const { data, loading, erro, reload } = useApi<Dashboard>(
    () => api.dashboard(),
    [],
  );

  const nome =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('vp_usuario') || '{}')?.nome?.split(
          ' ',
        )[0] || 'gerente'
      : 'gerente';

  return (
    <>
      <WPageHeader
        breadcrumb={`painel · ${fmtDataLonga()}`}
        title={`olá, ${nome}`}
        subtitle="aqui é o resumo do que está rolando agora no Pitéu."
        actions={
          <>
            <WButton
              kind="neutral"
              size="md"
              icon="refresh"
              onClick={reload}
            >
              atualizar
            </WButton>
            <WButton
              kind="primary"
              size="md"
              icon="plus"
              onClick={() => router.push('/contagens')}
            >
              nova contagem
            </WButton>
          </>
        }
      />

      {loading && <WLoading />}
      {erro && <WErro mensagem={erro} onRetry={reload} />}

      {data && (
        <div style={{ padding: '0 32px 32px' }}>
          {/* Stat row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 14,
              marginBottom: 18,
            }}
          >
            <WStat
              icon="people"
              accent="green"
              label="trabalhando agora"
              value={data.stats.trabalhandoAgora}
              sub={`de ${data.stats.ativosHoje} ativos hoje`}
            />
            <WStat
              icon="pause"
              accent="amber"
              label="em pausa"
              value={data.stats.emPausa}
              sub={data.stats.emPausaResumo || '—'}
            />
            <WStat
              icon="clipboard"
              accent="terra"
              label="contagens em andamento"
              value={data.stats.contagensAndamento}
              sub={data.stats.contagensResumo}
            />
            <WStat
              icon="warn"
              accent="amber"
              label="precisam de atenção"
              value={data.stats.precisamAtencao}
              sub={`${
                data.alertas.filter((a) => a.tipo !== 'contagem').length
              } pontos · ${
                data.alertas.filter((a) => a.tipo === 'contagem').length
              } contagem`}
            />
          </div>

          {/* Main grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: 18,
            }}
          >
            {/* Left col */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
              }}
            >
              {/* Trabalhando agora */}
              <WCard padding={0}>
                <div
                  style={{
                    padding: '16px 20px',
                    borderBottom: `1px solid ${T.line}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
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
                      trabalhando agora
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: T.ink3,
                        marginTop: 2,
                        fontWeight: 500,
                      }}
                    >
                      {data.trabalhando.length} pessoas no salão e cozinha
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/funcionarios')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: T.ink2,
                      fontFamily: T.font,
                      fontSize: 13,
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    ver todos{' '}
                    <WIcon name="chevronRight" size={14} color={T.ink2} />
                  </button>
                </div>
                <div style={{ padding: '4px 8px 8px' }}>
                  {data.trabalhando.length === 0 && (
                    <div
                      style={{
                        padding: '20px 12px',
                        color: T.ink3,
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      ninguém com ponto aberto agora.
                    </div>
                  )}
                  {data.trabalhando.map((f) => (
                    <div
                      key={f.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 12px',
                        borderRadius: 9,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = T.lineSoft)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = 'transparent')
                      }
                    >
                      <WAvatar name={f.nome} size={36} photo />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: T.ink,
                            letterSpacing: -0.15,
                          }}
                        >
                          {f.nome}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: T.ink2,
                            marginTop: 1,
                            fontWeight: 500,
                          }}
                        >
                          {f.cargo || '—'}
                        </div>
                      </div>
                      <WTag
                        tone={f.status === 'em pausa' ? 'amber' : 'green'}
                        dot
                      >
                        {f.status === 'em pausa'
                          ? 'em pausa'
                          : 'trabalhando'}
                      </WTag>
                      <div
                        style={{
                          fontSize: 13,
                          color: T.ink2,
                          fontVariantNumeric: 'tabular-nums',
                          fontWeight: 500,
                          minWidth: 70,
                          textAlign: 'right',
                        }}
                      >
                        {f.desde
                          ? `desde ${new Date(f.desde).toLocaleTimeString(
                              'pt-BR',
                              { hour: '2-digit', minute: '2-digit' },
                            )}`
                          : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </WCard>

              {/* Contagens de hoje */}
              <WCard padding={0}>
                <div
                  style={{
                    padding: '16px 20px',
                    borderBottom: `1px solid ${T.line}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
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
                      contagens de hoje
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: T.ink3,
                        marginTop: 2,
                        fontWeight: 500,
                      }}
                    >
                      {data.contagensHoje.length} em andamento
                    </div>
                  </div>
                  <WButton
                    kind="neutral"
                    size="sm"
                    icon="plus"
                    onClick={() => router.push('/contagens')}
                  >
                    nova
                  </WButton>
                </div>
                <div
                  style={{
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  {data.contagensHoje.length === 0 && (
                    <div
                      style={{
                        padding: '10px 4px',
                        color: T.ink3,
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      nenhuma contagem aberta.
                    </div>
                  )}
                  {data.contagensHoje.map((c) => {
                    const pct =
                      c.total > 0 ? (c.contados / c.total) * 100 : 0;
                    const aberta = c.contados === 0;
                    return (
                      <div
                        key={c.id}
                        style={{
                          padding: 14,
                          border: `1px solid ${T.line}`,
                          borderRadius: 11,
                          background: T.surface2,
                          cursor: 'pointer',
                          transition:
                            'border-color .12s, box-shadow .12s',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.borderColor = T.ink3)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.borderColor = T.line)
                        }
                        onClick={() => router.push('/contagens')}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: 10,
                              background: aberta
                                ? T.lineSoft
                                : T.terraSoft,
                              color: aberta ? T.ink2 : T.terraInk,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <WIcon
                              name="clipboard"
                              size={18}
                              color="currentColor"
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 15,
                                  fontWeight: 600,
                                  color: T.ink,
                                  letterSpacing: -0.2,
                                }}
                              >
                                {c.nome}
                              </div>
                              <WTag
                                tone={aberta ? 'neutral' : 'terra'}
                                size="xs"
                                dot
                              >
                                {aberta ? 'aberta' : 'em andamento'}
                              </WTag>
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: T.ink2,
                                marginTop: 2,
                                fontWeight: 500,
                              }}
                            >
                              atribuída para{' '}
                              {c.atribuidos
                                .map((a) => a.nome.split(' ')[0])
                                .join(', ') || '—'}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: T.ink,
                                fontVariantNumeric: 'tabular-nums',
                              }}
                            >
                              {c.contados}/{c.total}
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: T.ink3,
                                marginTop: 1,
                                fontWeight: 500,
                              }}
                            >
                              contados
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            marginTop: 12,
                            height: 5,
                            background: T.lineSoft,
                            borderRadius: 3,
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${pct}%`,
                              background: aberta ? T.ink3 : T.terra,
                              borderRadius: 3,
                              transition: 'width .3s',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </WCard>
            </div>

            {/* Right col */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
              }}
            >
              {/* Alertas */}
              <WCard padding={0}>
                <div
                  style={{
                    padding: '16px 20px',
                    borderBottom: `1px solid ${T.line}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <WIcon name="bell" size={16} color={T.amber} />
                  <div
                    style={{
                      flex: 1,
                      fontSize: 15,
                      fontWeight: 600,
                      color: T.ink,
                      letterSpacing: -0.2,
                    }}
                  >
                    precisam de atenção
                  </div>
                  <WTag tone="amber" size="xs">
                    {data.alertas.length}
                  </WTag>
                </div>
                <div>
                  {data.alertas.length === 0 && (
                    <div
                      style={{
                        padding: '16px 20px',
                        color: T.ink3,
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      tudo certo por aqui. nada pendente.
                    </div>
                  )}
                  {data.alertas.map((a, i) => (
                    <div
                      key={a.id}
                      style={{
                        padding: '12px 20px',
                        borderBottom:
                          i < data.alertas.length - 1
                            ? `1px solid ${T.lineSoft}`
                            : 'none',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 7,
                          flexShrink: 0,
                          background:
                            a.tom === 'amber'
                              ? T.amberSoft
                              : a.tom === 'terra'
                              ? T.terraSoft
                              : T.lineSoft,
                          color:
                            a.tom === 'amber'
                              ? T.amber
                              : a.tom === 'terra'
                              ? T.terra
                              : T.ink2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: 1,
                        }}
                      >
                        <WIcon
                          name={
                            a.tipo === 'ponto'
                              ? 'clock'
                              : a.tipo === 'contagem'
                              ? 'clipboard'
                              : 'cloud'
                          }
                          size={13}
                          color="currentColor"
                        />
                      </div>
                      <div
                        style={{
                          flex: 1,
                          fontSize: 13,
                          color: T.ink,
                          lineHeight: 1.4,
                        }}
                      >
                        {a.texto}
                        <div
                          style={{
                            marginTop: 6,
                            display: 'flex',
                            gap: 6,
                          }}
                        >
                          <button
                            onClick={() =>
                              router.push(
                                a.tipo === 'contagem'
                                  ? '/contagens'
                                  : '/pontos',
                              )
                            }
                            style={{
                              background: 'transparent',
                              border: `1px solid ${T.line}`,
                              borderRadius: 6,
                              padding: '3px 9px',
                              fontSize: 12,
                              color: T.ink2,
                              cursor: 'pointer',
                              fontFamily: T.font,
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            ver detalhes
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </WCard>

              {/* Mini chart */}
              <WCard padding={0}>
                <div style={{ padding: '16px 20px 8px' }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: T.ink,
                      letterSpacing: -0.2,
                    }}
                  >
                    horas trabalhadas
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: T.ink3,
                      marginTop: 2,
                      fontWeight: 500,
                    }}
                  >
                    semana atual · total{' '}
                    <span style={{ color: T.ink, fontWeight: 700 }}>
                      {data.horasSemanaTotal.toFixed(1).replace('.', ',')}h
                    </span>
                  </div>
                </div>
                <MiniBarChart data={data.horasSemana} />
                <div style={{ padding: '4px 20px 16px' }}>
                  <button
                    onClick={() => router.push('/relatorios')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: T.ink2,
                      fontFamily: T.font,
                      fontSize: 13,
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: 0,
                    }}
                  >
                    ver relatório completo{' '}
                    <WIcon
                      name="chevronRight"
                      size={14}
                      color={T.ink2}
                    />
                  </button>
                </div>
              </WCard>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MiniBarChart({ data }: { data: { dia: string; valor: number }[] }) {
  const T = WT;
  const max = Math.max(...data.map((d) => d.valor), 1);
  const hojeDia = [
    'dom',
    'seg',
    'ter',
    'qua',
    'qui',
    'sex',
    'sáb',
  ][new Date().getDay()];
  return (
    <div style={{ padding: '14px 20px 8px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 8,
          height: 96,
        }}
      >
        {data.map((d) => {
          const pct = (d.valor / max) * 100;
          const today = d.dia === hojeDia;
          return (
            <div
              key={d.dia}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                height: '100%',
              }}
            >
              <div
                style={{
                  flex: 1,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'flex-end',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${Math.max(pct, d.valor > 0 ? 4 : 0)}%`,
                    background: today ? T.ink : T.line,
                    borderRadius: 4,
                    transition: 'height .3s',
                    position: 'relative',
                  }}
                >
                  {today && (
                    <div
                      style={{
                        position: 'absolute',
                        top: -22,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: 11,
                        fontWeight: 700,
                        color: T.ink,
                        fontVariantNumeric: 'tabular-nums',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {d.valor.toFixed(1)}h
                    </div>
                  )}
                </div>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: today ? T.ink : T.ink3,
                  fontWeight: today ? 700 : 500,
                }}
              >
                {d.dia}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
