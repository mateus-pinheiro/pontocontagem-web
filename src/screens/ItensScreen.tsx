'use client';

import { useEffect, useState } from 'react';
import { WT } from '@/lib/theme';
import {
  api,
  type CategoriaItem,
  type Item,
  type ItemDetalhe,
} from '@/lib/api';
import { useApi } from '@/lib/useApi';
import {
  CATEGORIA_LABEL,
  CATEGORIA_TONE,
  fmtDataDetalhe,
  fmtQtd,
} from '@/lib/format';
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

const CATS: CategoriaItem[] = ['BAR', 'COZINHA', 'LIMPEZA'];

export default function ItensScreen() {
  const T = WT;
  const { search } = useSearch();
  const [cat, setCat] = useState<'todas' | CategoriaItem>('todas');
  const [drawer, setDrawer] = useState<string | null>(null);
  const { data, loading, erro, reload } = useApi(() => api.itens(), []);

  const itens = data?.dados ?? [];
  const list = itens.filter((i) => {
    if (cat !== 'todas' && i.categoria !== cat) return false;
    if (search && !i.nome.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });
  const byCat = (c: CategoriaItem) =>
    itens.filter((i) => i.categoria === c).length;

  return (
    <>
      <WPageHeader
        breadcrumb="cadastros"
        title="itens"
        subtitle={`${itens.length} itens no catálogo`}
        actions={
          <WButton
            kind="primary"
            size="md"
            icon="plus"
            onClick={() => setDrawer('new')}
          >
            novo item
          </WButton>
        }
      />

      <WToolbar>
        <WSegmented
          value={cat}
          onChange={(v) => setCat(v as 'todas' | CategoriaItem)}
          options={[
            { value: 'todas', label: `todas (${itens.length})` },
            ...CATS.map((c) => ({
              value: c,
              label: `${CATEGORIA_LABEL[c]} (${byCat(c)})`,
            })),
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
                  <WTh width={120}>categoria</WTh>
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
                  <WTr key={i.id} onClick={() => setDrawer(i.id)}>
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
                      <WTag
                        tone={CATEGORIA_TONE[i.categoria] as never}
                        dot
                      >
                        {CATEGORIA_LABEL[i.categoria]}
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
                          <span
                            style={{ fontWeight: 600, color: T.ink }}
                          >
                            {fmtQtd(i.ultimoEstoque.quantidade)}
                          </span>
                          <span
                            style={{ color: T.ink3, marginLeft: 4 }}
                          >
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
                          setDrawer(i.id);
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

      {drawer && (
        <ItemDrawer
          itemId={drawer === 'new' ? null : drawer}
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

function ItemDrawer({
  itemId,
  onClose,
  onSaved,
}: {
  itemId: string | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const T = WT;
  const isNew = itemId === null;
  const [detalhe, setDetalhe] = useState<ItemDetalhe | null>(null);
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<CategoriaItem>('BAR');
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
        setCategoria(d.categoria);
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
    setSalvando(true);
    try {
      if (isNew) {
        await api.criarItem({ nome: nome.trim(), categoria, unidade });
      } else {
        await api.atualizarItem(itemId!, {
          nome: nome.trim(),
          categoria,
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
          ? CATEGORIA_LABEL[i.categoria]
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
            value={categoria}
            onChange={(v) => setCategoria(v as CategoriaItem)}
            options={[
              { value: 'BAR', label: 'bar' },
              { value: 'COZINHA', label: 'cozinha' },
              { value: 'LIMPEZA', label: 'limpeza' },
            ]}
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
