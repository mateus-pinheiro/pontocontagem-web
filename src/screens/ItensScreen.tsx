'use client';

import { useEffect, useRef, useState } from 'react';
import { WT } from '@/lib/theme';
import {
  api,
  type Categoria,
  type CorCategoria,
  type Item,
  type ItemDetalhe,
} from '@/lib/api';
import { useApi } from '@/lib/useApi';
import { fmtDataDetalhe, fmtQtd } from '@/lib/format';
import { useSearch } from '@/components/shell';
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
  WSegmented,
  WSelect,
  WTable,
  WTag,
  WTd,
  WTh,
  WToolbar,
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

export default function ItensScreen() {
  const T = WT;
  const { search } = useSearch();
  const [catId, setCatId] = useState<'todas' | string>('todas');
  const [drawer, setDrawer] = useState<
    null | { tipo: 'item'; itemId: string | null } | { tipo: 'categoria' }
  >(null);
  const [pulseNova, setPulseNova] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const {
    data,
    loading,
    erro,
    reload: reloadItens,
  } = useApi(() => api.itens(), []);
  const { data: categorias, reload: reloadCats } = useApi(
    () => api.categorias(),
    [],
  );

  const itens = data?.dados ?? [];
  const cats = categorias ?? [];
  const catsAtivas = cats.filter((c) => c.ativo);

  const list = itens.filter((i) => {
    if (catId !== 'todas' && i.categoria.id !== catId) return false;
    if (search && !i.nome.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });
  const byCat = (id: string) =>
    itens.filter((i) => i.categoria.id === id).length;

  function pedirCategoriaAntes() {
    setAviso(
      'crie pelo menos uma categoria antes de cadastrar itens.',
    );
    setPulseNova(true);
    window.setTimeout(() => setPulseNova(false), 2400);
  }

  function abrirNovoItem() {
    if (catsAtivas.length === 0) {
      pedirCategoriaAntes();
      return;
    }
    setAviso(null);
    setDrawer({ tipo: 'item', itemId: null });
  }

  return (
    <>
      <style>{pulseKeyframes}</style>
      <WPageHeader
        breadcrumb="cadastros"
        title="itens"
        subtitle={`${itens.length} itens · ${cats.length} categorias`}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <div
              style={{
                borderRadius: 9,
                ...(pulseNova
                  ? { animation: 'wPulse 1.2s ease-out 2' }
                  : {}),
              }}
            >
              <WButton
                kind="neutral"
                size="md"
                icon="plus"
                onClick={() => setDrawer({ tipo: 'categoria' })}
              >
                nova categoria
              </WButton>
            </div>
            <WButton
              kind="primary"
              size="md"
              icon="plus"
              onClick={abrirNovoItem}
            >
              novo item
            </WButton>
          </div>
        }
      />

      <WToolbar>
        <WSegmented
          value={catId}
          onChange={(v) => setCatId(v as 'todas' | string)}
          options={[
            { value: 'todas', label: `todas (${itens.length})` },
            ...catsAtivas.map((c) => ({
              value: c.id,
              label: `${c.nome} (${byCat(c.id)})`,
            })),
          ]}
        />
      </WToolbar>

      {aviso && (
        <div style={{ padding: '0 32px 12px' }}>
          <div
            style={{
              padding: '10px 14px',
              background: T.amberSoft,
              border: `1px solid ${T.amber}`,
              borderRadius: 9,
              fontSize: 13,
              color: T.amber,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <WIcon name="info" size={14} color={T.amber} />
            {aviso}
          </div>
        </div>
      )}

      {loading && <WLoading />}
      {erro && <WErro mensagem={erro} onRetry={reloadItens} />}

      {data && (
        <div style={{ padding: '0 32px 32px' }}>
          <WCard padding={0}>
            <WTable>
              <thead>
                <tr>
                  <WTh>nome</WTh>
                  <WTh width={140}>categoria</WTh>
                  <WTh width={100} align="right">
                    unidade
                  </WTh>
                  <WTh width={160} align="right">
                    último contado
                  </WTh>
                  <WTh align="right" width={56} />
                </tr>
              </thead>
              <tbody>
                {list.map((i) => (
                  <WTr
                    key={i.id}
                    onClick={() =>
                      setDrawer({ tipo: 'item', itemId: i.id })
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
                        {i.nome}
                      </div>
                    </WTd>
                    <WTd>
                      <WTag tone={i.categoria.cor as TagTone} dot>
                        {i.categoria.nome}
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
                      {i.unidade}
                    </WTd>
                    <WTd
                      align="right"
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {i.ultimoEstoque ? (
                        <>
                          <span style={{ fontWeight: 600, color: T.ink }}>
                            {fmtQtd(i.ultimoEstoque.quantidade)}
                          </span>
                          <span style={{ color: T.ink3, marginLeft: 4 }}>
                            {i.unidade}
                          </span>
                        </>
                      ) : (
                        <span style={{ color: T.ink3 }}>—</span>
                      )}
                    </WTd>
                    <WTd align="right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDrawer({ tipo: 'item', itemId: i.id });
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
                icon="box"
                title="nenhum item nessa categoria"
                subtitle="adicione um item novo ou troque o filtro."
              />
            )}
          </WCard>
        </div>
      )}

      {drawer?.tipo === 'item' && (
        <ItemDrawer
          itemId={drawer.itemId}
          categorias={catsAtivas}
          onClose={() => setDrawer(null)}
          onSaved={() => {
            setDrawer(null);
            reloadItens();
          }}
        />
      )}
      {drawer?.tipo === 'categoria' && (
        <CategoriaDrawer
          onClose={() => setDrawer(null)}
          onSaved={() => {
            setDrawer(null);
            setAviso(null);
            reloadCats();
          }}
        />
      )}
    </>
  );
}

const pulseKeyframes = `@keyframes wPulse {
  0%   { box-shadow: 0 0 0 0   rgba(217,119,87,0.55); }
  60%  { box-shadow: 0 0 0 10px rgba(217,119,87,0); }
  100% { box-shadow: 0 0 0 0   rgba(217,119,87,0); }
}`;

function ItemDrawer({
  itemId,
  categorias,
  onClose,
  onSaved,
}: {
  itemId: string | null;
  categorias: Categoria[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const T = WT;
  const isNew = itemId === null;
  const [detalhe, setDetalhe] = useState<ItemDetalhe | null>(null);
  const [nome, setNome] = useState('');
  const [categoriaId, setCategoriaId] = useState<string>(
    categorias[0]?.id ?? '',
  );
  const [unidade, setUnidade] = useState('un');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) return;
    api
      .item(itemId!)
      .then((d) => {
        setDetalhe(d);
        setNome(d.nome);
        setCategoriaId(d.categoria.id);
        setUnidade(d.unidade);
      })
      .catch((e) =>
        setErro(e instanceof Error ? e.message : 'erro ao carregar'),
      );
  }, [itemId, isNew]);

  async function salvar() {
    setErro(null);
    if (nome.trim().length < 2) {
      setErro('o nome precisa de pelo menos 2 letras.');
      return;
    }
    if (!categoriaId) {
      setErro('escolha uma categoria.');
      return;
    }
    setSalvando(true);
    try {
      if (isNew) {
        await api.criarItem({ nome: nome.trim(), categoriaId, unidade });
      } else {
        await api.atualizarItem(itemId!, {
          nome: nome.trim(),
          categoriaId,
          unidade,
        });
      }
      onSaved();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'erro ao salvar');
      setSalvando(false);
    }
  }

  async function desativar() {
    if (isNew) return;
    setSalvando(true);
    try {
      await api.atualizarItem(itemId!, { ativo: false });
      onSaved();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'erro ao desativar');
      setSalvando(false);
    }
  }

  const i = detalhe;

  return (
    <WDrawer
      open
      onClose={onClose}
      title={isNew ? 'novo item' : nome || 'item'}
      subtitle={
        isNew
          ? 'adicione ao catálogo'
          : i
          ? i.categoria.nome
          : 'carregando…'
      }
      footer={
        <>
          {!isNew && (
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
        <WInput
          label="nome"
          value={nome}
          onChange={setNome}
          placeholder="ex: Coca-Cola lata 350ml"
          autoFocus={isNew}
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}
        >
          <WSelect
            label="categoria"
            value={categoriaId}
            onChange={setCategoriaId}
            options={categorias.map((c) => ({
              value: c.id,
              label: c.nome,
            }))}
          />
          <WSelect
            label="unidade"
            value={unidade}
            onChange={setUnidade}
            options={[
              { value: 'un', label: 'unidades (un)' },
              { value: 'kg', label: 'quilogramas (kg)' },
              { value: 'L', label: 'litros (L)' },
              { value: 'g', label: 'gramas (g)' },
              { value: 'ml', label: 'mililitros (ml)' },
            ]}
          />
        </div>

        {!isNew && i && (
          <>
            <div
              style={{
                height: 1,
                background: T.lineSoft,
                margin: '6px 0',
              }}
            />
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.ink2,
                  marginBottom: 10,
                }}
              >
                aparece em
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {i.apareceEm.length === 0 && (
                  <div
                    style={{
                      fontSize: 13,
                      color: T.ink3,
                      fontWeight: 500,
                    }}
                  >
                    ainda não está em nenhuma lista.
                  </div>
                )}
                {i.apareceEm.map((l) => (
                  <div
                    key={l.id}
                    style={{
                      padding: '10px 12px',
                      border: `1px solid ${T.line}`,
                      borderRadius: 9,
                      background: T.surface2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <WIcon name="list" size={16} color={T.ink2} />
                    <div
                      style={{
                        flex: 1,
                        fontSize: 14,
                        fontWeight: 600,
                        color: T.ink,
                        letterSpacing: -0.1,
                      }}
                    >
                      {l.nome}
                    </div>
                    <div style={{ fontSize: 12, color: T.ink3 }}>
                      {l.itens} itens
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.ink2,
                  marginBottom: 10,
                }}
              >
                último estoque
              </div>
              {i.ultimoEstoque ? (
                <div
                  style={{
                    padding: 14,
                    background: T.surface,
                    border: `1px solid ${T.line}`,
                    borderRadius: 11,
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 600,
                      color: T.ink,
                      letterSpacing: -0.8,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {fmtQtd(i.ultimoEstoque.quantidade)}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: T.terra,
                    }}
                  >
                    {i.unidade}
                  </div>
                  <div style={{ flex: 1 }} />
                  <div
                    style={{
                      fontSize: 12,
                      color: T.ink3,
                      fontWeight: 500,
                      textAlign: 'right',
                    }}
                  >
                    {fmtDataDetalhe(i.ultimoEstoque.registradoEm)}
                    <br />
                    contado por {i.ultimoEstoque.contadoPor.nome}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    fontSize: 13,
                    color: T.ink3,
                    fontWeight: 500,
                  }}
                >
                  nunca foi contado ainda.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </WDrawer>
  );
}

function CategoriaDrawer({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const T = WT;
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState<CorCategoria>('neutral');
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
      await api.criarCategoria({ nome: n, cor });
      onSaved();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'erro ao salvar');
      setSalvando(false);
    }
  }

  return (
    <WDrawer
      open
      onClose={onClose}
      title="nova categoria"
      subtitle="só para este estabelecimento"
      width={420}
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
            {salvando ? 'criando…' : 'criar categoria'}
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
            placeholder="ex: hortifruti, açougue, padaria…"
          />
        </div>
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
          a categoria fica disponível só neste estabelecimento. as 3 padrão
          (bar/cozinha/limpeza) já vêm criadas.
        </div>
      </div>
    </WDrawer>
  );
}
