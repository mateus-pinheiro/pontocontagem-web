'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  api,
  clearAuth,
  getToken,
  getUsuario,
  setAuth,
  setSessionToken,
  temPermissao,
  type EstabelecimentoRef,
  type Permissao,
  type TokenCompleto,
  type Usuario,
} from './api';

export type EntrarResp =
  | { tipo: 'ok'; usuario: Usuario }
  | { tipo: 'escolher'; estabelecimentos: EstabelecimentoRef[] };

interface AuthCtx {
  usuario: Usuario | null;
  pronto: boolean; // já leu o localStorage
  entrar: (email: string, senha: string) => Promise<EntrarResp>;
  selecionarEstabelecimento: (id: string) => Promise<Usuario>;
  sair: () => void;
  /** true se o usuário tem TODAS as permissões listadas. */
  pode: (...p: Permissao[]) => boolean;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    if (getToken()) setUsuario(getUsuario());
    setPronto(true);
  }, []);

  const entrar = useCallback(
    async (email: string, senha: string): Promise<EntrarResp> => {
      const resp = await api.login(email, senha);
      // discrimina pelo shape do body: completo tem `token`+`usuario`;
      // sessão tem `sessionToken`+`estabelecimentos`+`precisaSelecionar`.
      if ('token' in resp) {
        const completo = resp as TokenCompleto;
        setAuth(completo.token, completo.usuario);
        setUsuario(completo.usuario);
        return { tipo: 'ok', usuario: completo.usuario };
      }
      setSessionToken(resp.sessionToken);
      return { tipo: 'escolher', estabelecimentos: resp.estabelecimentos };
    },
    [],
  );

  const selecionarEstabelecimento = useCallback(async (id: string) => {
    const resp = await api.selecionarEstabelecimento(id);
    setAuth(resp.token, resp.usuario);
    setUsuario(resp.usuario);
    return resp.usuario;
  }, []);

  const sair = useCallback(() => {
    clearAuth();
    setUsuario(null);
    window.location.href = '/login';
  }, []);

  const pode = useCallback(
    (...p: Permissao[]) => temPermissao(usuario, ...p),
    [usuario],
  );

  return (
    <Ctx.Provider
      value={{
        usuario,
        pronto,
        entrar,
        selecionarEstabelecimento,
        sair,
        pode,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth fora do AuthProvider');
  return c;
}
