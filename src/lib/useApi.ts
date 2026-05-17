'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError, peekCache } from './api';

interface State<T> {
  data: T | null;
  loading: boolean;
  erro: string | null;
}

/**
 * Busca dados da API com loading/erro/recarregar. `deps` dispara nova
 * busca quando muda (ex.: filtros).
 *
 * `cacheKey` (= o path do GET, ex.: '/dashboard') liga o modo SWR:
 * o dado em cache aparece **na hora** (sem spinner) enquanto uma
 * revalidação roda em background. Sem `cacheKey` o comportamento é o
 * de antes (spinner cheio até a resposta).
 */
export function useApi<T>(
  fn: () => Promise<T>,
  deps: unknown[] = [],
  cacheKey?: string,
): State<T> & { reload: () => void } {
  const [state, setState] = useState<State<T>>(() => {
    const c = cacheKey ? peekCache<T>(cacheKey) : null;
    return c
      ? { data: c.data, loading: false, erro: null }
      : { data: null, loading: true, erro: null };
  });
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const run = useCallback(() => {
    let vivo = true;
    const cached = cacheKey ? peekCache<T>(cacheKey) : null;
    if (cached) {
      // Mostra o cache imediatamente; revalida em silêncio.
      setState({ data: cached.data, loading: false, erro: null });
    } else {
      setState((s) => ({ ...s, loading: true, erro: null }));
    }
    fnRef
      .current()
      .then((data) => {
        if (vivo) setState({ data, loading: false, erro: null });
      })
      .catch((e) => {
        if (!vivo) return;
        setState((s) =>
          // Se já há dado (stale) na tela, mantém — a revalidação
          // falhou silenciosamente em vez de virar tela de erro.
          s.data
            ? s
            : {
                data: null,
                loading: false,
                erro:
                  e instanceof ApiError
                    ? e.message
                    : 'erro ao carregar. a API está rodando?',
              },
        );
      });
    return () => {
      vivo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, ...deps]);

  useEffect(() => run(), [run]);

  return { ...state, reload: run };
}
