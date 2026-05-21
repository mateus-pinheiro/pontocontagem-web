'use client';

import { useEffect, useRef, useState } from 'react';
import { WT } from '@/lib/theme';
import { api, type CorCategoria, type Setor } from '@/lib/api';
import { useApi } from '@/lib/useApi';
import {
  WButton,
  WCard,
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
  WTr,
} from '@/components/ui';

type TagTone = 'neutral' | 'terra' | 'green' | 'blue' | 'amber';

const CORES: { value: CorCategoria; label: string }[] = [
  { value: 'terra', label: 'terra' },
  { value: 'green', label: 'verde' },
  { value: 'blue', label: 'azul' },
  { value: 'amber', label: 'âmbar' },
  { value: 'neutral', label: 'neutro' },
];

type DrawerState =
  | { tipo: 'fechado' }
  | { tipo: 'novo' }
  | { tipo: 'editar'; setor: Setor };

export default function SetoresScreen() {
  const T = WT;
  const { data, loading, erro, reload } = useApi(() => api.setores(), []);
  const [drawer, setDrawer] = useState<DrawerState>({ tipo: 'fechado' });

  const setores = data ?? [];
  const ativos = setores.filter((s) => s.ativo).length;

  return (
    <>
      <WPageHeader
        breadcrumb="cadastros"
        title="setores"
        subtitle={`${setores.length} no total · ${ativos} ativos`}
        actions={
          <WButton
            kind="primary"
            size="md"
            icon="plus"
            onClick={() => setDrawer({ tipo: 'novo' })}
          >
            novo setor
          </WButton>
        }
      />

      {loading && <WLoading />}
      {erro && <WErro mensagem={erro} onRetry={reload} />}

      {data && (
        <div style={{ padding: '0 32px 32px' }}>
          <WCard padding={0}>
            <WTable>
              <thead>
                <tr>
                  <WTh>nome</WTh>
                  <WTh width={140}>cor</WTh>
                  <WTh width={140} align="right">
                    categorias
                  </WTh>
                  <WTh width={120} align="right">
                    status
                  </WTh>
                  <WTh align="right" width={56} />
                </tr>
              </thead>
              <tbody>
                {setores.map((s) => (
                  <WTr
                    key={s.id}
                    onClick={() => setDrawer({ tipo: 'editar', setor: s })}
                  >
                    <WTd>
                      <div
                        style={{
                          fontWeight: 600,
                          color: T.ink,
                          letterSpacing: -0.1,
                        }}
                      >
                        {s.nome}
                      </div>
                    </WTd>
                    <WTd>
                      <WTag tone={s.cor as TagTone} dot>
                        {s.cor}
                      </WTag>
                    </WTd>
                    <WTd
                      align="right"
                      style={{
                        color: T.ink2,
                        fontFamily: T.fontMono,
                        fontSize: 13,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {s.categorias}
                    </WTd>
                    <WTd align="right">
                      <WTag tone={s.ativo ? 'green' : 'neutral'} size="xs">
                        {s.ativo ? 'ativo' : 'inativo'}
                      </WTag>
                    </WTd>
                    <WTd align="right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDrawer({ tipo: 'editar', setor: s });
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
            {setores.length === 0 && (
              <WEmpty
                icon="box"
                title="nenhum setor ainda"
                subtitle="crie o primeiro setor (ex: bar, cozinha, limpeza)."
              />
            )}
          </WCard>
        </div>
      )}

      {drawer.tipo !== 'fechado' && (
        <SetorDrawer
          modo={drawer}
          onClose={() => setDrawer({ tipo: 'fechado' })}
          onSaved={() => {
            setDrawer({ tipo: 'fechado' });
            reload();
          }}
        />
      )}
    </>
  );
}

function SetorDrawer({
  modo,
  onClose,
  onSaved,
}: {
  modo: Exclude<DrawerState, { tipo: 'fechado' }>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const T = WT;
  const isNew = modo.tipo === 'novo';
  const setor = modo.tipo === 'editar' ? modo.setor : null;

  const [nome, setNome] = useState(setor?.nome ?? '');
  const [cor, setCor] = useState<CorCategoria>(setor?.cor ?? 'neutral');
  const [ordem, setOrdem] = useState<number>(setor?.ordem ?? 0);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.querySelector('input')?.focus();
  }, []);

  async function salvar() {
    setErro(null);
    const n = nome.trim();
    if (n.length < 2) {
      setErro('o nome precisa de pelo menos 2 letras.');
      return;
    }
    setSalvando(true);
    try {
      if (isNew) {
        await api.criarSetor({ nome: n, cor, ordem });
      } else if (setor) {
        await api.atualizarSetor(setor.id, { nome: n, cor, ordem });
      }
      onSaved();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'erro ao salvar');
      setSalvando(false);
    }
  }

  async function desativar() {
    if (!setor) return;
    setErro(null);
    setSalvando(true);
    try {
      await api.atualizarSetor(setor.id, { ativo: !setor.ativo });
      onSaved();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'erro ao mudar status');
      setSalvando(false);
    }
  }

  return (
    <WDrawer
      open
      onClose={onClose}
      title={isNew ? 'novo setor' : setor?.nome ?? 'setor'}
      subtitle={
        isNew
          ? 'compartimento do estabelecimento'
          : `${setor?.categorias ?? 0} ${setor?.categorias === 1 ? 'categoria' : 'categorias'}`
      }
      width={420}
      footer={
        <>
          {setor && (
            <WButton
              kind={setor.ativo ? 'softDanger' : 'neutral'}
              size="md"
              icon={setor.ativo ? 'trash' : 'refresh'}
              onClick={desativar}
              disabled={salvando}
            >
              {setor.ativo ? 'desativar' : 'reativar'}
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
            {salvando ? 'salvando…' : isNew ? 'criar setor' : 'salvar'}
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
        <div ref={inputRef}>
          <WInput
            label="nome"
            value={nome}
            onChange={setNome}
            placeholder="ex: bar, cozinha, limpeza…"
          />
        </div>
        <WInput
          label="ordem de exibição"
          value={String(ordem)}
          onChange={(v) => setOrdem(Number(v.replace(/[^0-9]/g, '') || 0))}
          placeholder="0"
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
            cor
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CORES.map((c) => {
              const ativo = c.value === cor;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCor(c.value)}
                  style={{
                    border: `1px solid ${ativo ? T.ink : T.line}`,
                    background: ativo ? T.surface : 'transparent',
                    padding: '6px 10px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: T.font,
                    fontSize: 13,
                    fontWeight: 600,
                    color: T.ink,
                  }}
                >
                  <WTag tone={c.value as TagTone} dot size="xs">
                    {c.label}
                  </WTag>
                </button>
              );
            })}
          </div>
        </div>
        <div
          style={{
            fontSize: 12,
            color: T.ink3,
            fontWeight: 500,
            lineHeight: 1.5,
          }}
        >
          o setor agrupa categorias de itens. para desativar um setor é
          preciso desativar as categorias dele primeiro.
        </div>
      </div>
    </WDrawer>
  );
}
