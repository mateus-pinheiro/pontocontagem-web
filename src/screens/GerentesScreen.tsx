'use client';

import { useState } from 'react';
import { WT } from '@/lib/theme';
import { api, type Gerente } from '@/lib/api';
import { useApi } from '@/lib/useApi';
import { useAuth } from '@/lib/auth';
import { fmtPontoRel } from '@/lib/format';
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
  WTable,
  WTag,
  WTd,
  WTh,
  WTr,
} from '@/components/ui';

export default function GerentesScreen() {
  const T = WT;
  const { usuario } = useAuth();
  const [drawer, setDrawer] = useState<string | null>(null);
  const { data, loading, erro, reload } = useApi(
    () => api.gerentes(),
    [],
  );

  const gerentes = data ?? [];
  const ativos = gerentes.filter((g) => g.ativo).length;
  const editing =
    drawer && drawer !== 'new'
      ? gerentes.find((g) => g.id === drawer) || null
      : null;

  return (
    <>
      <WPageHeader
        breadcrumb="cadastros · segurança"
        title="gerentes"
        subtitle={`${ativos} ${
          ativos === 1 ? 'gerente ativo' : 'gerentes ativos'
        } no Tasca da Esquina`}
        actions={
          <WButton
            kind="primary"
            size="md"
            icon="plus"
            onClick={() => setDrawer('new')}
          >
            novo gerente
          </WButton>
        }
      />

      <div style={{ padding: '0 32px 14px' }}>
        <div
          style={{
            padding: 14,
            background: T.blueSoft,
            borderRadius: 11,
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
          }}
        >
          <WIcon name="shield" size={18} color={T.blue} />
          <div
            style={{
              flex: 1,
              fontSize: 13,
              color: T.ink2,
              lineHeight: 1.5,
            }}
          >
            <strong style={{ color: T.blue }}>
              regras de segurança
            </strong>{' '}
            — gerentes podem cadastrar funcionários, corrigir pontos, ver
            relatórios. O sistema mantém sempre ao menos 1 gerente ativo;
            você não pode se desativar sozinho.
          </div>
        </div>
      </div>

      {loading && <WLoading />}
      {erro && <WErro mensagem={erro} onRetry={reload} />}

      {data && (
        <div style={{ padding: '0 32px 32px' }}>
          <WCard padding={0}>
            <WTable>
              <thead>
                <tr>
                  <WTh>nome</WTh>
                  <WTh>email</WTh>
                  <WTh>último acesso</WTh>
                  <WTh>status</WTh>
                  <WTh align="right" width={200}>
                    ações
                  </WTh>
                </tr>
              </thead>
              <tbody>
                {gerentes.map((g) => {
                  const eu = usuario?.sub === g.id;
                  return (
                    <WTr key={g.id} onClick={() => setDrawer(g.id)}>
                      <WTd nowrap>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                          }}
                        >
                          <WAvatar name={g.nome} size={32} />
                          <div
                            style={{
                              fontWeight: 600,
                              color: T.ink,
                              letterSpacing: -0.1,
                              display: 'flex',
                              gap: 8,
                              alignItems: 'center',
                            }}
                          >
                            {g.nome}
                            {eu && (
                              <WTag tone="blue" size="xs">
                                você
                              </WTag>
                            )}
                            {g.deveTrocarSenha && (
                              <WTag tone="amber" size="xs">
                                troca pendente
                              </WTag>
                            )}
                          </div>
                        </div>
                      </WTd>
                      <WTd
                        nowrap
                        style={{
                          color: T.ink2,
                          fontFamily: T.fontMono,
                          fontSize: 13,
                        }}
                      >
                        {g.email}
                      </WTd>
                      <WTd
                        nowrap
                        style={{ color: T.ink2, fontSize: 13 }}
                      >
                        {fmtPontoRel(g.ultimoAcesso)}
                      </WTd>
                      <WTd>
                        <WTag
                          tone={g.ativo ? 'green' : 'neutral'}
                          dot
                        >
                          {g.ativo ? 'ativo' : 'inativo'}
                        </WTag>
                      </WTd>
                      <WTd align="right">
                        <div
                          style={{ display: 'inline-flex', gap: 4 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ResetSenhaBtn id={g.id} />
                          {!eu && g.ativo && (
                            <DesativarBtn
                              id={g.id}
                              onDone={reload}
                            />
                          )}
                        </div>
                      </WTd>
                    </WTr>
                  );
                })}
              </tbody>
            </WTable>
          </WCard>
        </div>
      )}

      {drawer && (
        <GerenteDrawer
          gerente={editing}
          isNew={drawer === 'new'}
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

function ResetSenhaBtn({ id }: { id: string }) {
  const [temp, setTemp] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  return (
    <>
      <WButton
        kind="ghost"
        size="xs"
        icon="key"
        disabled={carregando}
        onClick={async () => {
          setCarregando(true);
          try {
            const r = await api.resetarSenhaGerente(id);
            setTemp(r.senhaTemporaria);
          } catch (e) {
            alert(e instanceof Error ? e.message : 'erro');
          }
          setCarregando(false);
        }}
      >
        resetar senha
      </WButton>
      {temp && (
        <WDrawer
          open
          onClose={() => setTemp(null)}
          title="senha temporária"
          width={400}
          footer={
            <>
              <div style={{ flex: 1 }} />
              <WButton
                kind="primary"
                size="md"
                onClick={() => setTemp(null)}
              >
                entendi
              </WButton>
            </>
          }
        >
          <div
            style={{ fontSize: 14, color: WT.ink2, lineHeight: 1.5 }}
          >
            entregue esta senha ao gerente. ele troca obrigatoriamente
            no próximo login.
            <div
              style={{
                marginTop: 14,
                padding: '14px 16px',
                background: WT.lineSoft,
                borderRadius: 10,
                fontFamily: WT.fontMono,
                fontSize: 22,
                fontWeight: 600,
                color: WT.ink,
                textAlign: 'center',
                letterSpacing: 2,
              }}
            >
              {temp}
            </div>
          </div>
        </WDrawer>
      )}
    </>
  );
}

function DesativarBtn({
  id,
  onDone,
}: {
  id: string;
  onDone: () => void;
}) {
  const [carregando, setCarregando] = useState(false);
  return (
    <WButton
      kind="ghost"
      size="xs"
      icon="exit"
      disabled={carregando}
      onClick={async () => {
        setCarregando(true);
        try {
          await api.desativarGerente(id);
          onDone();
        } catch (e) {
          alert(e instanceof Error ? e.message : 'erro');
          setCarregando(false);
        }
      }}
    >
      desativar
    </WButton>
  );
}

function GerenteDrawer({
  gerente,
  isNew,
  onClose,
  onSaved,
}: {
  gerente: Gerente | null;
  isNew: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const T = WT;
  const [nome, setNome] = useState(gerente?.nome || '');
  const [email, setEmail] = useState(gerente?.email || '');
  const [senha, setSenha] = useState('');
  const [ativo, setAtivo] = useState(gerente?.ativo ?? true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function salvar() {
    setErro(null);
    if (nome.trim().length < 2) return setErro('informe o nome.');
    if (isNew) {
      if (!email.includes('@')) return setErro('email inválido.');
      if (senha.length < 8)
        return setErro('a senha inicial tem no mínimo 8 caracteres.');
    }
    setSalvando(true);
    try {
      if (isNew) {
        await api.criarGerente({
          nome: nome.trim(),
          email: email.trim(),
          senha,
        });
      } else if (gerente) {
        await api.atualizarGerente(gerente.id, {
          nome: nome.trim(),
          ativo,
        });
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
      title={isNew ? 'novo gerente' : 'editar gerente'}
      subtitle={
        isNew ? 'envie acesso ao painel pra outra pessoa' : gerente?.email
      }
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
          placeholder="ex: Ana Paula Cruz"
          autoFocus={isNew}
        />
        <WInput
          label="email"
          value={email}
          onChange={setEmail}
          placeholder="ana@tasca.com.br"
          type="email"
          hint={
            isNew ? 'usado pra entrar no painel' : 'o email não muda'
          }
        />
        {isNew && (
          <WInput
            label="senha inicial"
            value={senha}
            onChange={setSenha}
            placeholder="mínimo 8 caracteres"
            type="password"
            hint="ele troca no primeiro acesso"
          />
        )}
        {!isNew && gerente && (
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 0',
              borderTop: `1px solid ${T.lineSoft}`,
            }}
          >
            <input
              type="checkbox"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
              style={{ accentColor: T.ink, width: 16, height: 16 }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: T.ink,
                  letterSpacing: -0.1,
                }}
              >
                gerente ativo
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: T.ink3,
                  marginTop: 1,
                  fontWeight: 500,
                }}
              >
                o sistema mantém sempre ao menos 1 gerente ativo.
              </div>
            </div>
          </label>
        )}
      </div>
    </WDrawer>
  );
}
