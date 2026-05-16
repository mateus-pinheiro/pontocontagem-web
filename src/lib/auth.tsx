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
  type Usuario,
} from './api';

interface AuthCtx {
  usuario: Usuario | null;
  pronto: boolean; // já leu o localStorage
  entrar: (email: string, senha: string) => Promise<Usuario>;
  sair: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    if (getToken()) setUsuario(getUsuario());
    setPronto(true);
  }, []);

  const entrar = useCallback(async (email: string, senha: string) => {
    const resp = await api.loginGerente(email, senha);
    setAuth(resp.token, resp.usuario);
    setUsuario(resp.usuario);
    return resp.usuario;
  }, []);

  const sair = useCallback(() => {
    clearAuth();
    setUsuario(null);
    window.location.href = '/login';
  }, []);

  return (
    <Ctx.Provider value={{ usuario, pronto, entrar, sair }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth fora do AuthProvider');
  return c;
}
