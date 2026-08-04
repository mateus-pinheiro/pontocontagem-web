'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getFirebaseApp } from './firebase';

/** Chave do parâmetro no Firebase Remote Config. */
export const FLAG_PONTO = 'ponto_habilitado';

export type FlagKey = 'ponto';

interface FlagsCtx {
  /** Área de ponto (bater ponto, correções, horas) visível. */
  ponto: boolean;
  /** O fetch do Remote Config terminou — com sucesso OU com falha. */
  pronto: boolean;
}

/** Defaults: tudo desligado. Se o Remote Config não responder, é isso que vale. */
const DESLIGADO: FlagsCtx = { ponto: false, pronto: false };

const Ctx = createContext<FlagsCtx | null>(null);

/**
 * Feature flags servidas pelo Firebase Remote Config. Mesma forma do
 * [AuthProvider]: contexto + `pronto` pra quem precisa esperar o bootstrap.
 *
 * Tudo roda dentro do useEffect (nunca no módulo) porque o Remote Config
 * precisa de window/IndexedDB e o `next build` pré-renderiza estas páginas.
 */
export function FlagsProvider({ children }: { children: React.ReactNode }) {
  const [flags, setFlags] = useState<FlagsCtx>(DESLIGADO);

  useEffect(() => {
    let vivo = true;
    (async () => {
      let ponto = false;
      try {
        const app = getFirebaseApp();
        const { getRemoteConfig, fetchAndActivate, getBoolean, isSupported } =
          await import('firebase/remote-config');
        // isSupported() cobre navegador com IndexedDB bloqueado (aba anônima).
        if (!app || !(await isSupported())) {
          throw new Error('remote config indisponível');
        }
        const rc = getRemoteConfig(app);
        rc.defaultConfig = { [FLAG_PONTO]: false };
        rc.settings.fetchTimeoutMillis = 8_000;
        // O default do SDK é 12h — lento demais pra um toggle de lançamento.
        rc.settings.minimumFetchIntervalMillis =
          process.env.NODE_ENV === 'production' ? 3_600_000 : 0;
        await fetchAndActivate(rc);
        ponto = getBoolean(rc, FLAG_PONTO);
      } catch {
        // Offline, env var faltando, fetch bloqueado: fica desligado.
        ponto = false;
      }
      if (vivo) setFlags({ ponto, pronto: true });
    })();
    return () => {
      vivo = false;
    };
  }, []);

  return <Ctx.Provider value={flags}>{children}</Ctx.Provider>;
}

export function useFlags(): FlagsCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useFlags fora do FlagsProvider');
  return c;
}

export function useFlag(k: FlagKey): boolean {
  return useFlags()[k];
}
