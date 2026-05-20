'use client';

import { useCallback, useEffect, useState } from 'react';
import { WT } from '@/lib/theme';
import {
  api,
  ApiError,
  TODAS_PERMISSOES,
  type Permissao,
  type Role,
} from '@/lib/api';
import {
  WButton,
  WDrawer,
  WEmpty,
  WErro,
  WInput,
  WLoading,
  WPageHeader,
  WTag,
  WTable,
  WTd,
  WTh,
  WToolbar,
  WTr,
} from '@/components/ui';

type ModoDrawer =
  | { tipo: 'fechado' }
  | { tipo: 'novo' }
  | { tipo: 'editar'; role: Role };

const PERMISSAO_LABEL: Record<Permissao, string> = {
  USUARIO_GERENCIAR: 'gerenciar membros',
  ROLE_GERENCIAR: 'gerenciar funções',
  ESTABELECIMENTO_CRIAR: 'criar estabelecimentos',
  ESTABELECIMENTO_EDITAR: 'editar estabelecimento',
  ITEM_GERENCIAR: 'gerenciar itens',
  LISTA_GERENCIAR: 'gerenciar listas',
  CONTAGEM_CRIAR: 'criar contagens',
  CONTAGEM_FINALIZAR: 'reabrir/cancelar contagens',
  CONTAGEM_ATRIBUIR: 'atribuir contagens',
  CONTAGEM_CONTAR: 'contar (app)',
  PONTO_BATER: 'bater ponto (app)',
  PONTO_CORRIGIR: 'corrigir pontos',
  RELATORIO_VER: 'ver relatórios',
  DASHBOARD_VER: 'ver painel',
};

export default function RolesScreen() {
  const T = WT;
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [catalogo, setCatalogo] = useState<Permissao[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<ModoDrawer>({ tipo: 'fechado' });

  const carregar = useCallback(async () => {
    try {
      const [r, c] = await Promise.all([
        api.roles(),
        api.catalogoPermissoes(),
      ]);
      setRoles(r);
      setCatalogo(c);
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'erro ao carregar');
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function executar(p: Promise<unknown>) {
    setErro(null);
    try {
      await p;
      await carregar();
      setDrawer({ tipo: 'fechado' });
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'erro ao executar ação');
    }
  }

  if (erro && !roles) {
    return (
      <WErro
        mensagem={erro}
        onRetry={() => {
          carregar();
        }}
      />
    );
  }
  if (!roles || !catalogo) {
    return <WLoading texto="carregando funções…" />;
  }

  return (
    <>
      <WPageHeader
        title="funções"
        subtitle="defina o que cada papel pode fazer neste estabelecimento."
        actions={
          <WButton
            kind="primary"
            size="md"
            icon="plus"
            onClick={() => setDrawer({ tipo: 'novo' })}
          >
            nova função
          </WButton>
        }
      />

      {erro && (
        <WToolbar>
          <div style={{ color: T.danger, fontSize: 13, fontWeight: 600 }}>
            {erro}
          </div>
        </WToolbar>
      )}

      <div style={{ padding: '0 32px' }}>
        {roles.length === 0 ? (
          <WEmpty
            icon="shield"
            title="sem funções ainda"
            subtitle="crie a primeira função pra atribuir aos membros."
          />
        ) : (
          <WTable>
            <thead>
              <WTr>
                <WTh>nome</WTh>
                <WTh>permissões</WTh>
                <WTh width={100} align="right">
                  membros
                </WTh>
                <WTh width={120} align="right" />
              </WTr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <WTr key={r.id}>
                  <WTd>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{r.nome}</span>
                      {r.sistema && (
                        <WTag tone="terra" size="xs">
                          sistema
                        </WTag>
                      )}
                    </div>
                  </WTd>
                  <WTd>
                    <div
                      style={{
                        fontSize: 12,
                        color: T.ink3,
                      }}
                    >
                      {r.permissoes.length} permissão
                      {r.permissoes.length === 1 ? '' : 'es'} —{' '}
                      {r.permissoes
                        .slice(0, 3)
                        .map((p) => PERMISSAO_LABEL[p])
                        .join(', ')}
                      {r.permissoes.length > 3 && '…'}
                    </div>
                  </WTd>
                  <WTd align="right">{r.membros ?? 0}</WTd>
                  <WTd align="right">
                    {!r.sistema && (
                      <WButton
                        kind="ghost"
                        size="sm"
                        icon="settings"
                        onClick={() =>
                          setDrawer({ tipo: 'editar', role: r })
                        }
                      >
                        editar
                      </WButton>
                    )}
                  </WTd>
                </WTr>
              ))}
            </tbody>
          </WTable>
        )}
      </div>

      <DrawerRole
        modo={drawer}
        catalogo={catalogo}
        onClose={() => setDrawer({ tipo: 'fechado' })}
        onCriar={(body) => executar(api.criarRole(body))}
        onSalvar={(id, body) => executar(api.atualizarRole(id, body))}
        onRemover={(id) => executar(api.removerRole(id))}
      />
    </>
  );
}

function DrawerRole({
  modo,
  catalogo,
  onClose,
  onCriar,
  onSalvar,
  onRemover,
}: {
  modo: ModoDrawer;
  catalogo: Permissao[];
  onClose: () => void;
  onCriar: (body: {
    nome: string;
    permissoes: Permissao[];
  }) => Promise<void>;
  onSalvar: (
    id: string,
    body: { nome?: string; permissoes?: Permissao[] },
  ) => Promise<void>;
  onRemover: (id: string) => Promise<void>;
}) {
  const novo = modo.tipo === 'novo';
  const editar = modo.tipo === 'editar' ? modo.role : null;

  const [nome, setNome] = useState('');
  const [perms, setPerms] = useState<Permissao[]>([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (modo.tipo === 'fechado') return;
    if (modo.tipo === 'novo') {
      setNome('');
      setPerms([]);
    } else {
      setNome(modo.role.nome);
      setPerms([...modo.role.permissoes]);
    }
  }, [modo]);

  function toggle(p: Permissao) {
    setPerms((cur) =>
      cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p],
    );
  }

  async function salvar() {
    setSalvando(true);
    try {
      if (novo) {
        await onCriar({ nome: nome.trim(), permissoes: perms });
      } else if (editar) {
        await onSalvar(editar.id, { nome: nome.trim(), permissoes: perms });
      }
    } finally {
      setSalvando(false);
    }
  }

  const cat = catalogo.length ? catalogo : TODAS_PERMISSOES;

  return (
    <WDrawer
      open={modo.tipo !== 'fechado'}
      onClose={onClose}
      title={novo ? 'nova função' : (editar?.nome ?? '')}
      subtitle={
        novo
          ? 'dê um nome e escolha as permissões.'
          : 'edite nome e permissões. funções do sistema não são editáveis.'
      }
      footer={
        <>
          {editar && !editar.sistema && (
            <WButton
              kind="danger"
              size="md"
              onClick={() => onRemover(editar.id)}
            >
              excluir
            </WButton>
          )}
          <div style={{ flex: 1 }} />
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
        <WInput
          label="nome"
          value={nome}
          onChange={setNome}
          placeholder="ex.: Caixa, Estoquista"
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
            permissões
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 6,
            }}
          >
            {cat.map((p) => (
              <label
                key={p}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 10px',
                  border: `1px solid ${WT.line}`,
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 12,
                  color: WT.ink,
                }}
              >
                <input
                  type="checkbox"
                  checked={perms.includes(p)}
                  onChange={() => toggle(p)}
                  style={{ accentColor: WT.ink }}
                />
                <span>{PERMISSAO_LABEL[p]}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </WDrawer>
  );
}
