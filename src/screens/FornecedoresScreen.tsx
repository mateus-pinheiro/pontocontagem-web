'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { WT } from '@/lib/theme';
import { api, type Fornecedor, type Item } from '@/lib/api';
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

type DrawerState =
  | { tipo: 'fechado' }
  | { tipo: 'novo' }
  | { tipo: 'editar'; fornecedor: Fornecedor };

export default function FornecedoresScreen() {
  const T = WT;
  const { data, loading, erro, reload } = useApi(() => api.fornecedores(), []);
  const [drawer, setDrawer] = useState<DrawerState>({ tipo: 'fechado' });

  const fornecedores = data ?? [];
  const ativos = fornecedores.filter((f) => f.ativo).length;

  return (
    <>
      <WPageHeader
        breadcrumb="cadastros"
        title="fornecedores"
        subtitle={`${fornecedores.length} no total · ${ativos} ativos`}
        actions={
          <WButton
            kind="primary"
            size="md"
            icon="plus"
            onClick={() => setDrawer({ tipo: 'novo' })}
          >
            novo fornecedor
          </WButton>
        }
      />

      {loading && <WLoading />}
      {erro && <WErro mensagem={erro} onRetry={reload} />}

      {data && (
        <div className="w-page">
          <WCard padding={0}>
            <WTable>
              <thead>
                <tr>
                  <WTh>nome</WTh>
                  <WTh width={180}>contato</WTh>
                  <WTh width={160}>telefone</WTh>
                  <WTh width={120} align="right">
                    itens
                  </WTh>
                  <WTh width={120} align="right">
                    status
                  </WTh>
                  <WTh align="right" width={56} />
                </tr>
              </thead>
              <tbody>
                {fornecedores.map((f) => (
                  <WTr
                    key={f.id}
                    onClick={() =>
                      setDrawer({ tipo: 'editar', fornecedor: f })
                    }
                  >
                    <WTd>
                      <div
                        style={{
                          fontWeight: 600,
                          color: T.ink,
                          letterSpacing: -0.1,
                        }}
                      >
                        {f.nome}
                      </div>
                      {f.email && (
                        <div
                          style={{
                            fontSize: 12,
                            color: T.ink3,
                            marginTop: 2,
                          }}
                        >
                          {f.email}
                        </div>
                      )}
                    </WTd>
                    <WTd style={{ color: T.ink2, fontSize: 13 }}>
                      {f.contato || '—'}
                    </WTd>
                    <WTd
                      style={{
                        color: T.ink2,
                        fontFamily: T.fontMono,
                        fontSize: 13,
                      }}
                    >
                      {f.telefone || '—'}
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
                      {f.itens}
                    </WTd>
                    <WTd align="right">
                      <WTag tone={f.ativo ? 'green' : 'neutral'} size="xs">
                        {f.ativo ? 'ativo' : 'inativo'}
                      </WTag>
                    </WTd>
                    <WTd align="right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDrawer({ tipo: 'editar', fornecedor: f });
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
            {fornecedores.length === 0 && (
              <WEmpty
                icon="people"
                title="nenhum fornecedor ainda"
                subtitle="cadastre os fornecedores pra atrelar aos itens."
              />
            )}
          </WCard>
        </div>
      )}

      {drawer.tipo !== 'fechado' && (
        <FornecedorDrawer
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

function FornecedorDrawer({
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
  const f = modo.tipo === 'editar' ? modo.fornecedor : null;

  const [nome, setNome] = useState(f?.nome ?? '');
  const [contato, setContato] = useState(f?.contato ?? '');
  const [telefone, setTelefone] = useState(f?.telefone ?? '');
  const [email, setEmail] = useState(f?.email ?? '');
  const [observacoes, setObservacoes] = useState(f?.observacoes ?? '');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // Catálogo inteiro pra escolher o que este fornecedor atende.
  const { data: catalogo, loading: carregandoItens } = useApi(
    () => api.itens(),
    [],
  );
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [vinculosCarregados, setVinculosCarregados] = useState(isNew);
  const [busca, setBusca] = useState('');
  const [soSelecionados, setSoSelecionados] = useState(false);

  useEffect(() => {
    inputRef.current?.querySelector('input')?.focus();
  }, []);

  // Vínculos atuais do fornecedor (só no modo edição).
  useEffect(() => {
    if (!f) return;
    let vivo = true;
    api
      .fornecedor(f.id)
      .then((d) => {
        if (!vivo) return;
        setSelecionados(new Set(d.itensVinculados.map((i) => i.id)));
        setVinculosCarregados(true);
      })
      .catch((e) => {
        if (!vivo) return;
        setErro(e instanceof Error ? e.message : 'erro ao carregar os itens');
      });
    return () => {
      vivo = false;
    };
  }, [f]);

  const itens = useMemo(() => catalogo?.dados ?? [], [catalogo]);
  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return itens.filter((i) => {
      if (soSelecionados && !selecionados.has(i.id)) return false;
      if (!termo) return true;
      return (
        i.nome.toLowerCase().includes(termo) ||
        i.categoria.nome.toLowerCase().includes(termo) ||
        (i.categoria.setor?.nome ?? '').toLowerCase().includes(termo)
      );
    });
  }, [itens, busca, soSelecionados, selecionados]);

  function alternar(id: string) {
    setSelecionados((cur) => {
      const proximo = new Set(cur);
      if (proximo.has(id)) proximo.delete(id);
      else proximo.add(id);
      return proximo;
    });
  }

  function marcarVisiveis(marcar: boolean) {
    setSelecionados((cur) => {
      const proximo = new Set(cur);
      for (const i of visiveis) {
        if (marcar) proximo.add(i.id);
        else proximo.delete(i.id);
      }
      return proximo;
    });
  }

  async function salvar() {
    setErro(null);
    const n = nome.trim();
    if (n.length < 2) {
      setErro('o nome precisa de pelo menos 2 letras.');
      return;
    }
    setSalvando(true);
    const itemIds = Array.from(selecionados);
    try {
      if (isNew) {
        const criado = await api.criarFornecedor({
          nome: n,
          contato: contato.trim() || undefined,
          telefone: telefone.trim() || undefined,
          email: email.trim() || undefined,
          observacoes: observacoes.trim() || undefined,
        });
        if (itemIds.length > 0) {
          await api.atualizarFornecedor(criado.id, { itemIds });
        }
      } else if (f) {
        await api.atualizarFornecedor(f.id, {
          nome: n,
          contato: contato.trim() || null,
          telefone: telefone.trim() || null,
          email: email.trim() || null,
          observacoes: observacoes.trim() || null,
          // Só manda os vínculos se eles já chegaram — senão um salvamento
          // rápido apagaria tudo mandando uma lista vazia.
          ...(vinculosCarregados ? { itemIds } : {}),
        });
      }
      onSaved();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'erro ao salvar');
      setSalvando(false);
    }
  }

  async function alternarStatus() {
    if (!f) return;
    setErro(null);
    setSalvando(true);
    try {
      await api.atualizarFornecedor(f.id, { ativo: !f.ativo });
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
      title={isNew ? 'novo fornecedor' : f?.nome ?? 'fornecedor'}
      subtitle={
        isNew
          ? 'cadastro do estabelecimento'
          : `${selecionados.size} ${
              selecionados.size === 1 ? 'item' : 'itens'
            } vinculados`
      }
      width={520}
      footer={
        <>
          {f && (
            <WButton
              kind={f.ativo ? 'softDanger' : 'neutral'}
              size="md"
              icon={f.ativo ? 'trash' : 'refresh'}
              onClick={alternarStatus}
              disabled={salvando}
            >
              {f.ativo ? 'desativar' : 'reativar'}
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
            {salvando ? 'salvando…' : isNew ? 'criar fornecedor' : 'salvar'}
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
            placeholder="ex: Distribuidora ABC"
          />
        </div>
        <div className="w-grid-2">
          <WInput
            label="contato"
            value={contato}
            onChange={setContato}
            placeholder="nome do vendedor"
          />
          <WInput
            label="telefone"
            value={telefone}
            onChange={setTelefone}
            placeholder="(11) 99999-0000"
          />
        </div>
        <WInput
          label="email"
          value={email}
          onChange={setEmail}
          placeholder="vendas@fornecedor.com"
          type="email"
        />
        <label style={{ display: 'block', fontFamily: T.font }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: T.ink2,
              marginBottom: 6,
              letterSpacing: -0.1,
            }}
          >
            observações <span style={{ color: T.ink3, fontWeight: 500 }}>(opcional)</span>
          </div>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="condições de entrega, prazos, observações gerais…"
            maxLength={500}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              minHeight: 72,
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
        </label>

        <div style={{ height: 1, background: T.lineSoft, margin: '2px 0' }} />

        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: T.ink2,
                letterSpacing: -0.1,
              }}
            >
              itens deste fornecedor{' '}
              <span style={{ color: T.ink3, fontWeight: 500 }}>
                ({selecionados.size} de {itens.length})
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <MiniBotao
                onClick={() => marcarVisiveis(true)}
                disabled={visiveis.length === 0}
              >
                marcar todos
              </MiniBotao>
              <MiniBotao
                onClick={() => marcarVisiveis(false)}
                disabled={visiveis.length === 0}
              >
                limpar
              </MiniBotao>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <WInput
              value={busca}
              onChange={setBusca}
              placeholder="buscar item, categoria ou setor…"
              icon="search"
              size="sm"
              style={{ flex: 1 }}
            />
            <MiniBotao
              onClick={() => setSoSelecionados((v) => !v)}
              ativo={soSelecionados}
            >
              só marcados
            </MiniBotao>
          </div>

          {carregandoItens || !vinculosCarregados ? (
            <div
              style={{
                fontSize: 13,
                color: T.ink3,
                fontWeight: 500,
                padding: '14px 12px',
                border: `1px dashed ${T.line}`,
                borderRadius: 9,
              }}
            >
              carregando catálogo…
            </div>
          ) : itens.length === 0 ? (
            <div
              style={{
                fontSize: 13,
                color: T.ink3,
                fontWeight: 500,
                padding: '14px 12px',
                border: `1px dashed ${T.line}`,
                borderRadius: 9,
              }}
            >
              cadastre itens em /itens pra vincular aqui.
            </div>
          ) : (
            <div
              style={{
                border: `1px solid ${T.line}`,
                borderRadius: 11,
                overflow: 'hidden',
                background: T.surface2,
                maxHeight: 320,
                overflowY: 'auto',
              }}
            >
              {visiveis.length === 0 && (
                <div
                  style={{
                    padding: '14px 12px',
                    fontSize: 13,
                    color: T.ink3,
                    fontWeight: 500,
                  }}
                >
                  nenhum item nesse filtro.
                </div>
              )}
              {visiveis.map((i, idx) => (
                <ItemLinha
                  key={i.id}
                  item={i}
                  marcado={selecionados.has(i.id)}
                  onToggle={() => alternar(i.id)}
                  ultimo={idx === visiveis.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </WDrawer>
  );
}

function ItemLinha({
  item,
  marcado,
  onToggle,
  ultimo,
}: {
  item: Item;
  marcado: boolean;
  onToggle: () => void;
  ultimo: boolean;
}) {
  const T = WT;
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 12px',
        cursor: 'pointer',
        background: marcado ? T.surface : 'transparent',
        borderBottom: ultimo ? 'none' : `1px solid ${T.lineSoft}`,
      }}
    >
      <input
        type="checkbox"
        checked={marcado}
        onChange={onToggle}
        style={{ accentColor: T.ink, width: 15, height: 15, flexShrink: 0 }}
      />
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
          {item.nome}
        </div>
        <div
          style={{
            fontSize: 11,
            color: T.ink3,
            marginTop: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item.categoria.setor ? `${item.categoria.setor.nome} · ` : ''}
          {item.categoria.nome}
        </div>
      </div>
      <WTag tone={item.categoria.cor as TagTone} size="xs">
        {item.unidade}
      </WTag>
    </label>
  );
}

function MiniBotao({
  children,
  onClick,
  disabled,
  ativo,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  ativo?: boolean;
}) {
  const T = WT;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        height: 32,
        padding: '0 10px',
        background: ativo ? T.ink : T.surface2,
        color: ativo ? T.surface : T.ink2,
        border: `1px solid ${ativo ? T.ink : T.line}`,
        borderRadius: 8,
        fontFamily: T.font,
        fontSize: 12,
        fontWeight: 600,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}
