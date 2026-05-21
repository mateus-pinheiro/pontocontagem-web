'use client';

import { useEffect, useRef, useState } from 'react';
import { WT } from '@/lib/theme';
import { api, type Fornecedor } from '@/lib/api';
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
        <div style={{ padding: '0 32px 32px' }}>
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
        await api.criarFornecedor({
          nome: n,
          contato: contato.trim() || undefined,
          telefone: telefone.trim() || undefined,
          email: email.trim() || undefined,
          observacoes: observacoes.trim() || undefined,
        });
      } else if (f) {
        await api.atualizarFornecedor(f.id, {
          nome: n,
          contato: contato.trim() || null,
          telefone: telefone.trim() || null,
          email: email.trim() || null,
          observacoes: observacoes.trim() || null,
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
          : `${f?.itens ?? 0} ${f?.itens === 1 ? 'item' : 'itens'} vinculados`
      }
      width={460}
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}
        >
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
      </div>
    </WDrawer>
  );
}
