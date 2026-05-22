'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { WT } from '@/lib/theme';
import {
  api,
  type Categoria,
  type CorCategoria,
  type Fornecedor,
  type ItemDetalhe,
  type Setor,
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

type DrawerState =
  | null
  | { tipo: 'item'; itemId: string | null }
  | { tipo: 'categoria' };

export default function ItensScreen() {
  const T = WT;
  const { search } = useSearch();
  const [setorId, setSetorId] = useState<'todos' | string>('todos');
  const [drawer, setDrawer] = useState<DrawerState>(null);
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
  const { data: setores, reload: reloadSetores } = useApi(
    () => api.setores(),
    [],
  );
  const { data: fornecedores } = useApi(() => api.fornecedores(), []);

  const itens = data?.dados ?? [];
  const cats = categorias ?? [];
  const setoresAll = setores ?? [];
  const setoresAtivos = setoresAll.filter((s) => s.ativo);
  const catsAtivas = cats.filter((c) => c.ativo);

  const list = itens.filter((i) => {
    if (setorId !== 'todos' && i.categoria.setor?.id !== setorId) return false;
    if (search && !i.nome.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const bySetor = (id: string) =>
    itens.filter((i) => i.categoria.setor?.id === id).length;

  function pedirSetorAntes() {
    setAviso('crie pelo menos um setor antes de cadastrar categorias.');
  }

  function pedirCategoriaAntes() {
    setAviso(
      'crie pelo menos uma categoria antes de cadastrar itens.',
    );
    setPulseNova(true);
    window.setTimeout(() => setPulseNova(false), 2400);
  }

  function abrirNovoItem() {
    if (setoresAtivos.length === 0) {
      pedirSetorAntes();
      return;
    }
    if (catsAtivas.length === 0) {
      pedirCategoriaAntes();
      return;
    }
    setAviso(null);
    setDrawer({ tipo: 'item', itemId: null });
  }

  function abrirNovaCategoria() {
    if (setoresAtivos.length === 0) {
      pedirSetorAntes();
      return;
    }
    setAviso(null);
    setDrawer({ tipo: 'categoria' });
  }

  return (
    <>
      <style>{pulseKeyframes}</style>
      <WPageHeader
        breadcrumb="cadastros"
        title="itens"
        subtitle={`${itens.length} itens · ${cats.length} categorias · ${setoresAll.length} setores`}
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
                onClick={abrirNovaCategoria}
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
          value={setorId}
          onChange={(v) => setSetorId(v as 'todos' | string)}
          options={[
            { value: 'todos', label: `todos (${itens.length})` },
            ...setoresAtivos.map((s) => ({
              value: s.id,
              label: `${s.nome} (${bySetor(s.id)})`,
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
                  <WTh width={220}>categoria</WTh>
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
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          flexWrap: 'wrap',
                        }}
                      >
                        {i.categoria.setor && (
                          <span
                            style={{
                              fontSize: 11,
                              color: T.ink3,
                              fontWeight: 600,
                              letterSpacing: 0.2,
                              textTransform: 'uppercase',
                            }}
                          >
                            {i.categoria.setor.nome}
                          </span>
                        )}
                        <WTag tone={i.categoria.cor as TagTone} dot>
                          {i.categoria.parent
                            ? `${i.categoria.parent.nome} › ${i.categoria.nome}`
                            : i.categoria.nome}
                        </WTag>
                      </div>
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
                title="nenhum item nesse filtro"
                subtitle="adicione um item novo ou troque o filtro."
              />
            )}
          </WCard>
        </div>
      )}

      {drawer?.tipo === 'item' && (
        <ItemDrawer
          itemId={drawer.itemId}
          setores={setoresAtivos}
          categorias={catsAtivas}
          fornecedores={(fornecedores ?? []).filter((f) => f.ativo)}
          onClose={() => setDrawer(null)}
          onSaved={() => {
            setDrawer(null);
            reloadItens();
          }}
        />
      )}
      {drawer?.tipo === 'categoria' && (
        <CategoriaDrawer
          setores={setoresAtivos}
          categorias={catsAtivas}
          onClose={() => setDrawer(null)}
          onSaved={() => {
            setDrawer(null);
            setAviso(null);
            reloadCats();
            reloadSetores();
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

function rotuloCategoria(c: { nome: string; parent?: { nome: string } | null }) {
  return c.parent ? `${c.parent.nome} › ${c.nome}` : c.nome;
}

type VinculoForn = { fornecedorId: string; principal: boolean; codigo: string };

function ItemDrawer({
  itemId,
  setores,
  categorias,
  fornecedores,
  onClose,
  onSaved,
}: {
  itemId: string | null;
  setores: Setor[];
  categorias: Categoria[];
  fornecedores: Fornecedor[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const T = WT;
  const isNew = itemId === null;
  const [detalhe, setDetalhe] = useState<ItemDetalhe | null>(null);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [setorId, setSetorId] = useState<string>(setores[0]?.id ?? '');
  const [categoriaId, setCategoriaId] = useState<string>('');
  const [unidade, setUnidade] = useState('un');
  const [vinculos, setVinculos] = useState<VinculoForn[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const opcoesCategoria = useMemo(
    () => categorias.filter((c) => c.setorId === setorId),
    [categorias, setorId],
  );

  useEffect(() => {
    if (isNew) {
      // ao criar: seleciona a primeira categoria do setor escolhido
      if (
        opcoesCategoria.length > 0 &&
        !opcoesCategoria.some((c) => c.id === categoriaId)
      ) {
        setCategoriaId(opcoesCategoria[0].id);
      }
      return;
    }
    api
      .item(itemId!)
      .then((d) => {
        setDetalhe(d);
        setNome(d.nome);
        setDescricao(d.descricao ?? '');
        setSetorId(d.categoria.setor?.id ?? setores[0]?.id ?? '');
        setCategoriaId(d.categoria.id);
        setUnidade(d.unidade);
        setVinculos(
          (d.fornecedores ?? []).map((v) => ({
            fornecedorId: v.fornecedor.id,
            principal: v.principal,
            codigo: v.codigo ?? '',
          })),
        );
      })
      .catch((e) =>
        setErro(e instanceof Error ? e.message : 'erro ao carregar'),
      );
  }, [itemId, isNew, opcoesCategoria]);

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
    const d = descricao.trim();
    const fornPayload = vinculos.map((v) => ({
      fornecedorId: v.fornecedorId,
      principal: v.principal,
      ...(v.codigo.trim() ? { codigo: v.codigo.trim() } : {}),
    }));
    try {
      if (isNew) {
        await api.criarItem({
          nome: nome.trim(),
          ...(d ? { descricao: d } : {}),
          categoriaId,
          unidade,
          ...(fornPayload.length > 0 ? { fornecedores: fornPayload } : {}),
        });
      } else {
        await api.atualizarItem(itemId!, {
          nome: nome.trim(),
          descricao: d.length > 0 ? d : null,
          categoriaId,
          unidade,
          fornecedores: fornPayload,
        });
      }
      onSaved();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'erro ao salvar');
      setSalvando(false);
    }
  }

  function addFornecedor(id: string) {
    if (vinculos.some((v) => v.fornecedorId === id)) return;
    setVinculos((cur) => [
      ...cur,
      { fornecedorId: id, principal: cur.length === 0, codigo: '' },
    ]);
  }
  function removeFornecedor(id: string) {
    setVinculos((cur) => cur.filter((v) => v.fornecedorId !== id));
  }
  function marcarPrincipal(id: string) {
    setVinculos((cur) =>
      cur.map((v) => ({ ...v, principal: v.fornecedorId === id })),
    );
  }
  function setCodigo(id: string, codigo: string) {
    setVinculos((cur) =>
      cur.map((v) => (v.fornecedorId === id ? { ...v, codigo } : v)),
    );
  }
  const disponiveis = fornecedores.filter(
    (f) => !vinculos.some((v) => v.fornecedorId === f.id),
  );
  const nomeForn = (id: string) =>
    fornecedores.find((f) => f.id === id)?.nome ?? '(removido)';

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
          ? `${i.categoria.setor?.nome ?? ''}${i.categoria.setor ? ' · ' : ''}${rotuloCategoria(i.categoria)}`
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
            descrição <span style={{ color: T.ink3, fontWeight: 500 }}>(opcional)</span>
          </div>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="detalhes do item: marca, fornecedor, observações…"
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}
        >
          <WSelect
            label="setor"
            value={setorId}
            onChange={setSetorId}
            options={setores.map((s) => ({ value: s.id, label: s.nome }))}
          />
          <WSelect
            label="categoria"
            value={categoriaId}
            onChange={setCategoriaId}
            options={
              opcoesCategoria.length === 0
                ? [{ value: '', label: '— sem categorias nesse setor —' }]
                : opcoesCategoria.map((c) => ({
                    value: c.id,
                    label: rotuloCategoria(c),
                  }))
            }
          />
        </div>
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

        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
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
              fornecedores{' '}
              <span style={{ color: T.ink3, fontWeight: 500 }}>(opcional)</span>
            </div>
            {disponiveis.length > 0 && (
              <select
                value=""
                onChange={(e) => e.target.value && addFornecedor(e.target.value)}
                style={{
                  height: 28,
                  padding: '0 8px',
                  background: T.surface2,
                  border: `1px solid ${T.line}`,
                  borderRadius: 8,
                  fontFamily: T.font,
                  fontSize: 12,
                  color: T.ink2,
                  cursor: 'pointer',
                }}
              >
                <option value="">+ adicionar fornecedor</option>
                {disponiveis.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nome}
                  </option>
                ))}
              </select>
            )}
          </div>
          {vinculos.length === 0 ? (
            <div
              style={{
                fontSize: 13,
                color: T.ink3,
                fontWeight: 500,
                padding: '10px 12px',
                border: `1px dashed ${T.line}`,
                borderRadius: 9,
              }}
            >
              {fornecedores.length === 0
                ? 'cadastre fornecedores em /fornecedores pra atrelar aqui.'
                : 'nenhum fornecedor vinculado a este item.'}
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              {vinculos.map((v) => (
                <div
                  key={v.fornecedorId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    border: `1px solid ${
                      v.principal ? T.ink : T.line
                    }`,
                    background: v.principal ? T.surface : T.surface2,
                    borderRadius: 9,
                  }}
                >
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 600,
                      color: T.ink,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <input
                      type="radio"
                      name={`principal-${itemId ?? 'novo'}`}
                      checked={v.principal}
                      onChange={() => marcarPrincipal(v.fornecedorId)}
                      style={{ accentColor: T.ink }}
                    />
                    <span
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {nomeForn(v.fornecedorId)}
                    </span>
                    {v.principal && (
                      <WTag tone="terra" size="xs">
                        principal
                      </WTag>
                    )}
                  </label>
                  <input
                    type="text"
                    value={v.codigo}
                    onChange={(e) => setCodigo(v.fornecedorId, e.target.value)}
                    placeholder="código"
                    style={{
                      width: 110,
                      height: 28,
                      padding: '0 8px',
                      background: T.surface2,
                      border: `1px solid ${T.line}`,
                      borderRadius: 6,
                      fontFamily: T.fontMono,
                      fontSize: 12,
                      color: T.ink,
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={() => removeFornecedor(v.fornecedorId)}
                    title="remover"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <WIcon name="close" size={14} color={T.ink3} />
                  </button>
                </div>
              ))}
            </div>
          )}
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
  setores,
  categorias,
  onClose,
  onSaved,
}: {
  setores: Setor[];
  categorias: Categoria[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const T = WT;
  const [nome, setNome] = useState('');
  const [setorId, setSetorId] = useState<string>(setores[0]?.id ?? '');
  const [parentId, setParentId] = useState<string>('');
  const [cor, setCor] = useState<CorCategoria>('neutral');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.querySelector('input')?.focus();
  }, []);

  // Só categorias raiz do mesmo setor podem ser "pai".
  const possiveisPais = useMemo(
    () =>
      categorias.filter((c) => c.setorId === setorId && c.parentId === null),
    [categorias, setorId],
  );

  // Se o setor muda e o parent escolhido não pertence mais, limpa.
  useEffect(() => {
    if (parentId && !possiveisPais.some((p) => p.id === parentId)) {
      setParentId('');
    }
  }, [setorId, parentId, possiveisPais]);

  async function salvar() {
    setErro(null);
    const n = nome.trim();
    if (n.length < 2) {
      setErro('o nome precisa de pelo menos 2 letras.');
      return;
    }
    if (!setorId) {
      setErro('escolha um setor.');
      return;
    }
    setSalvando(true);
    try {
      await api.criarCategoria({
        nome: n,
        setorId,
        cor,
        ...(parentId ? { parentId } : {}),
      });
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
      subtitle="dentro de um setor; pode virar subcategoria de outra raiz"
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
            placeholder="ex: bebidas, hortifruti, cervejas…"
          />
        </div>
        <WSelect
          label="setor"
          value={setorId}
          onChange={setSetorId}
          options={
            setores.length === 0
              ? [{ value: '', label: '— nenhum setor ativo —' }]
              : setores.map((s) => ({ value: s.id, label: s.nome }))
          }
        />
        <WSelect
          label="é subcategoria de (opcional)"
          value={parentId}
          onChange={setParentId}
          options={[
            { value: '', label: '— categoria raiz do setor —' },
            ...possiveisPais.map((p) => ({ value: p.id, label: p.nome })),
          ]}
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
          a categoria fica disponível só neste estabelecimento. para criar uma
          subcategoria escolha um pai no campo acima.
        </div>
      </div>
    </WDrawer>
  );
}
