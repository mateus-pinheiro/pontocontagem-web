'use client';

import { useEffect, useMemo, useState } from 'react';
import { WT } from '@/lib/theme';
import { api, type Funcionario, type Item, type Lista } from '@/lib/api';
import { useApi } from '@/lib/useApi';
import { CATEGORIA_TONE } from '@/lib/format';
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
} from '@/components/ui';

export default function ListasScreen() {
  const T = WT;
  const { data: listas, loading, erro, reload } = useApi(
    () => api.listas(),
    [],
    '/listas-contagem',
  );
  const { data: itensData } = useApi(() => api.itens(), []);
  const { data: funcsData, reload: reloadFuncs } = useApi(
    () => api.funcionarios(),
    [],
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<
    null | 'nova' | 'renomear' | 'addItem' | 'pessoas'
  >(null);

  const todasListas = listas ?? [];
  const catalogo = itensData?.dados ?? [];
  const funcionarios = funcsData?.dados ?? [];

  useEffect(() => {
    if (!activeId && todasListas.length) setActiveId(todasListas[0].id);
  }, [todasListas, activeId]);

  const lista = todasListas.find((l) => l.id === activeId) || null;
  const pessoas = funcionarios.filter((f) =>
    f.listas.some((l) => l.id === activeId),
  );

  async function salvarItens(novaOrdem: string[]) {
    if (!lista) return;
    await api.atualizarLista(lista.id, { itemIds: novaOrdem });
    reload();
  }

  return (
    <>
      <WPageHeader
        breadcrumb="cadastros"
        title="listas de contagem"
        subtitle="templates reutilizáveis. quando você cria uma contagem, escolhe uma lista dessas."
        actions={
          <WButton
            kind="primary"
            size="md"
            icon="plus"
            onClick={() => setDrawer('nova')}
          >
            nova lista
          </WButton>
        }
      />

      {loading && <WLoading />}
      {erro && <WErro mensagem={erro} onRetry={reload} />}

      {listas && (
        <div
          style={{
            padding: '0 32px 32px',
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: 18,
            alignItems: 'flex-start',
          }}
        >
          {/* Left — templates */}
          <WCard padding={0} style={{ position: 'sticky', top: 0 }}>
            <div
              style={{
                padding: '12px 14px',
                borderBottom: `1px solid ${T.line}`,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: T.ink3,
                  fontWeight: 700,
                  letterSpacing: 0.4,
                  textTransform: 'uppercase',
                }}
              >
                {todasListas.length} listas
              </div>
            </div>
            <div style={{ padding: 6 }}>
              {todasListas.map((l) => {
                const ativo = l.id === activeId;
                const tone =
                  l.itens[0] &&
                  CATEGORIA_TONE[l.itens[0].item.categoria];
                return (
                  <button
                    key={l.id}
                    onClick={() => setActiveId(l.id)}
                    style={{
                      width: '100%',
                      padding: '12px 12px',
                      borderRadius: 9,
                      background: ativo ? T.ink : 'transparent',
                      color: ativo ? '#fff' : T.ink,
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: T.font,
                      transition: 'background .12s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 2,
                    }}
                    onMouseEnter={(e) => {
                      if (!ativo)
                        e.currentTarget.style.background = T.lineSoft;
                    }}
                    onMouseLeave={(e) => {
                      if (!ativo)
                        e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        flexShrink: 0,
                        background: ativo
                          ? 'rgba(255,255,255,0.16)'
                          : tone === 'terra'
                          ? T.terraSoft
                          : tone === 'green'
                          ? T.greenSoft
                          : tone === 'blue'
                          ? T.blueSoft
                          : T.lineSoft,
                        color: ativo
                          ? '#fff'
                          : tone === 'terra'
                          ? T.terraInk
                          : tone === 'green'
                          ? T.greenInk
                          : tone === 'blue'
                          ? T.blue
                          : T.ink2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <WIcon name="list" size={15} color="currentColor" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          letterSpacing: -0.1,
                        }}
                      >
                        {l.nome}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          marginTop: 1,
                          fontWeight: 500,
                          color: ativo
                            ? 'rgba(255,255,255,0.6)'
                            : T.ink3,
                        }}
                      >
                        {l.totalItens} itens
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </WCard>

          {/* Right — editor */}
          {lista ? (
            <WCard padding={0}>
              <div
                style={{
                  padding: '18px 22px',
                  borderBottom: `1px solid ${T.line}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 16,
                }}
              >
                <div style={{ flex: 1 }}>
                  <h2
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      letterSpacing: -0.4,
                      margin: 0,
                      color: T.ink,
                    }}
                  >
                    {lista.nome}
                  </h2>
                  <div
                    style={{
                      fontSize: 13,
                      color: T.ink2,
                      marginTop: 4,
                      fontWeight: 500,
                    }}
                  >
                    criada por {lista.criadoPor.nome} ·{' '}
                    {lista.totalItens} itens
                  </div>
                </div>
                <WButton
                  kind="neutral"
                  size="sm"
                  icon="edit"
                  onClick={() => setDrawer('renomear')}
                >
                  renomear
                </WButton>
              </div>

              {/* Quem pode contar */}
              <div
                style={{
                  padding: '14px 22px',
                  borderBottom: `1px solid ${T.line}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: T.ink3,
                      fontWeight: 700,
                      letterSpacing: 0.4,
                      textTransform: 'uppercase',
                    }}
                  >
                    quem pode contar
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      marginTop: 8,
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ display: 'flex' }}>
                      {pessoas.map((f, i) => (
                        <div
                          key={f.id}
                          style={{ marginLeft: i === 0 ? 0 : -8 }}
                          title={f.nome}
                        >
                          <WAvatar name={f.nome} size={28} />
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: T.ink2,
                        marginLeft: 10,
                        fontWeight: 500,
                      }}
                    >
                      {pessoas.length === 0
                        ? 'ninguém atribuído'
                        : pessoas
                            .map((f) => f.nome.split(' ')[0])
                            .join(', ')}
                    </div>
                  </div>
                </div>
                <WButton
                  kind="neutral"
                  size="sm"
                  icon="plus"
                  onClick={() => setDrawer('pessoas')}
                >
                  atribuir pessoas
                </WButton>
              </div>

              {/* Itens */}
              <div
                style={{
                  padding: '14px 22px',
                  borderBottom: `1px solid ${T.line}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    fontSize: 12,
                    color: T.ink3,
                    fontWeight: 700,
                    letterSpacing: 0.4,
                    textTransform: 'uppercase',
                  }}
                >
                  ordem dos itens · arraste pra reordenar
                </div>
                <WButton
                  kind="primary"
                  size="sm"
                  icon="plus"
                  onClick={() => setDrawer('addItem')}
                >
                  adicionar item
                </WButton>
              </div>
              <ItensReordenaveis
                lista={lista}
                onReordenar={salvarItens}
                onRemover={(itemId) =>
                  salvarItens(
                    lista.itens
                      .map((li) => li.item.id)
                      .filter((id) => id !== itemId),
                  )
                }
              />
            </WCard>
          ) : (
            <WCard>
              <div
                style={{
                  padding: '40px 0',
                  textAlign: 'center',
                  color: T.ink3,
                  fontWeight: 500,
                }}
              >
                crie uma lista pra começar.
              </div>
            </WCard>
          )}
        </div>
      )}

      {drawer === 'nova' && (
        <NovaListaDrawer
          catalogo={catalogo}
          onClose={() => setDrawer(null)}
          onSaved={() => {
            setDrawer(null);
            reload();
          }}
        />
      )}
      {drawer === 'renomear' && lista && (
        <RenomearDrawer
          lista={lista}
          onClose={() => setDrawer(null)}
          onSaved={() => {
            setDrawer(null);
            reload();
          }}
        />
      )}
      {drawer === 'addItem' && lista && (
        <AddItemDrawer
          lista={lista}
          catalogo={catalogo}
          onClose={() => setDrawer(null)}
          onSaved={(ids) => {
            setDrawer(null);
            salvarItens(ids);
          }}
        />
      )}
      {drawer === 'pessoas' && lista && (
        <PessoasDrawer
          listaId={lista.id}
          funcionarios={funcionarios}
          onClose={() => setDrawer(null)}
          onSaved={() => {
            setDrawer(null);
            reloadFuncs();
          }}
        />
      )}
    </>
  );
}

function ItensReordenaveis({
  lista,
  onReordenar,
  onRemover,
}: {
  lista: Lista;
  onReordenar: (ids: string[]) => void;
  onRemover: (itemId: string) => void;
}) {
  const T = WT;
  const [ordem, setOrdem] = useState(lista.itens.map((li) => li.item.id));
  const [arrastando, setArrastando] = useState<number | null>(null);

  useEffect(() => {
    setOrdem(lista.itens.map((li) => li.item.id));
  }, [lista]);

  const porId = useMemo(
    () => new Map(lista.itens.map((li) => [li.item.id, li.item])),
    [lista],
  );

  function drop(destino: number) {
    if (arrastando === null || arrastando === destino) return;
    const nova = [...ordem];
    const [m] = nova.splice(arrastando, 1);
    nova.splice(destino, 0, m);
    setOrdem(nova);
    setArrastando(null);
    onReordenar(nova);
  }

  return (
    <div style={{ padding: '4px 12px 16px' }}>
      {ordem.map((id, idx) => {
        const it = porId.get(id);
        if (!it) return null;
        return (
          <div
            key={id}
            draggable
            onDragStart={() => setArrastando(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => drop(idx)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 10px',
              borderRadius: 8,
              cursor: 'grab',
              opacity: arrastando === idx ? 0.4 : 1,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = T.lineSoft)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'transparent')
            }
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: T.ink3,
              }}
            >
              <WIcon name="grip" size={18} color={T.ink3} />
            </div>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: T.lineSoft,
                color: T.ink2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                flexShrink: 0,
              }}
            >
              {idx + 1}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: T.ink,
                  letterSpacing: -0.1,
                }}
              >
                {it.nome}
              </div>
            </div>
            <div
              style={{
                fontSize: 12,
                color: T.ink3,
                fontFamily: T.fontMono,
              }}
            >
              {it.unidade}
            </div>
            <button
              onClick={() => onRemover(id)}
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
                color: T.ink3,
              }}
            >
              <WIcon name="trash" size={15} color={T.ink3} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function NovaListaDrawer({
  catalogo,
  onClose,
  onSaved,
}: {
  catalogo: Item[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const T = WT;
  const [nome, setNome] = useState('');
  const [sel, setSel] = useState<string[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function salvar() {
    setErro(null);
    if (nome.trim().length < 2) return setErro('dê um nome à lista.');
    if (sel.length === 0) return setErro('escolha pelo menos 1 item.');
    setSalvando(true);
    try {
      await api.criarLista({ nome: nome.trim(), itemIds: sel });
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
      title="nova lista"
      subtitle="dê um nome e escolha os itens"
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
            criar lista
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
          label="nome da lista"
          value={nome}
          onChange={setNome}
          placeholder="ex: estoque do bar"
          autoFocus
        />
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: T.ink2,
              marginBottom: 8,
            }}
          >
            itens ({sel.length} selecionados)
          </div>
          <div
            style={{
              border: `1px solid ${T.line}`,
              borderRadius: 9,
              padding: 4,
              background: T.surface2,
              maxHeight: 360,
              overflow: 'auto',
            }}
          >
            {catalogo.map((i) => {
              const checked = sel.includes(i.id);
              return (
                <label
                  key={i.id}
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
                          ? s.filter((x) => x !== i.id)
                          : [...s, i.id],
                      )
                    }
                    style={{
                      accentColor: T.ink,
                      width: 15,
                      height: 15,
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      fontSize: 13,
                      fontWeight: 600,
                      color: T.ink,
                      letterSpacing: -0.1,
                    }}
                  >
                    {i.nome}
                  </div>
                  <div style={{ fontSize: 12, color: T.ink3 }}>
                    {i.unidade}
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

function RenomearDrawer({
  lista,
  onClose,
  onSaved,
}: {
  lista: Lista;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [nome, setNome] = useState(lista.nome);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  return (
    <WDrawer
      open
      onClose={onClose}
      title="renomear lista"
      width={400}
      footer={
        <>
          <div style={{ flex: 1 }} />
          <WButton kind="neutral" size="md" onClick={onClose}>
            cancelar
          </WButton>
          <WButton
            kind="primary"
            size="md"
            disabled={salvando}
            onClick={async () => {
              setErro(null);
              setSalvando(true);
              try {
                await api.atualizarLista(lista.id, { nome: nome.trim() });
                onSaved();
              } catch (e) {
                setErro(e instanceof Error ? e.message : 'erro');
                setSalvando(false);
              }
            }}
          >
            salvar
          </WButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {erro && (
          <div
            style={{
              padding: '10px 12px',
              background: WT.dangerSoft,
              borderRadius: 8,
              fontSize: 13,
              color: WT.danger,
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
          autoFocus
        />
      </div>
    </WDrawer>
  );
}

function AddItemDrawer({
  lista,
  catalogo,
  onClose,
  onSaved,
}: {
  lista: Lista;
  catalogo: Item[];
  onClose: () => void;
  onSaved: (ids: string[]) => void;
}) {
  const T = WT;
  const jaTem = new Set(lista.itens.map((li) => li.item.id));
  const disponiveis = catalogo.filter((i) => !jaTem.has(i.id));
  const [sel, setSel] = useState<string[]>([]);

  return (
    <WDrawer
      open
      onClose={onClose}
      title="adicionar itens"
      subtitle={`em ${lista.nome}`}
      footer={
        <>
          <div style={{ flex: 1 }} />
          <WButton kind="neutral" size="md" onClick={onClose}>
            cancelar
          </WButton>
          <WButton
            kind="primary"
            size="md"
            disabled={sel.length === 0}
            onClick={() =>
              onSaved([...lista.itens.map((li) => li.item.id), ...sel])
            }
          >
            adicionar ({sel.length})
          </WButton>
        </>
      }
    >
      <div
        style={{
          border: `1px solid ${T.line}`,
          borderRadius: 9,
          padding: 4,
          background: T.surface2,
        }}
      >
        {disponiveis.length === 0 && (
          <div
            style={{
              padding: 16,
              fontSize: 13,
              color: T.ink3,
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            todos os itens do catálogo já estão na lista.
          </div>
        )}
        {disponiveis.map((i) => {
          const checked = sel.includes(i.id);
          return (
            <label
              key={i.id}
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
                      ? s.filter((x) => x !== i.id)
                      : [...s, i.id],
                  )
                }
                style={{ accentColor: T.ink, width: 15, height: 15 }}
              />
              <div
                style={{
                  flex: 1,
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.ink,
                  letterSpacing: -0.1,
                }}
              >
                {i.nome}
              </div>
              <div style={{ fontSize: 12, color: T.ink3 }}>
                {i.unidade}
              </div>
            </label>
          );
        })}
      </div>
    </WDrawer>
  );
}

function PessoasDrawer({
  listaId,
  funcionarios,
  onClose,
  onSaved,
}: {
  listaId: string;
  funcionarios: Funcionario[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const T = WT;
  const ativos = funcionarios.filter((f) => f.ativo);
  const [sel, setSel] = useState<Set<string>>(
    new Set(
      ativos
        .filter((f) => f.listas.some((l) => l.id === listaId))
        .map((f) => f.id),
    ),
  );
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function salvar() {
    setSalvando(true);
    setErro(null);
    try {
      // Persiste só quem mudou (adiciona/remove a lista do funcionário).
      for (const f of ativos) {
        const tinha = f.listas.some((l) => l.id === listaId);
        const tem = sel.has(f.id);
        if (tinha === tem) continue;
        const ids = f.listas.map((l) => l.id);
        const novos = tem
          ? [...ids, listaId]
          : ids.filter((id) => id !== listaId);
        await api.atualizarFuncionario(f.id, { listaIds: novos });
      }
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
      title="quem pode contar"
      subtitle="marque os funcionários que podem fazer esta lista"
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
            salvar
          </WButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
        {ativos.map((f) => {
          const checked = sel.has(f.id);
          return (
            <label
              key={f.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                border: `1px solid ${checked ? T.ink : T.line}`,
                borderRadius: 9,
                background: checked ? T.lineSoft : T.surface2,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() =>
                  setSel((s) => {
                    const n = new Set(s);
                    if (n.has(f.id)) n.delete(f.id);
                    else n.add(f.id);
                    return n;
                  })
                }
                style={{ accentColor: T.ink, width: 16, height: 16 }}
              />
              <WAvatar name={f.nome} size={28} />
              <div
                style={{
                  flex: 1,
                  fontSize: 14,
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
    </WDrawer>
  );
}
