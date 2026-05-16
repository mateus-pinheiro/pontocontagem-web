'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from './api';

interface State<T> {
  data: T | null;
  loading: boolean;
  erro: string | null;
}

/**
 * Busca dados da API com loading/erro/recarregar. `deps` dispara nova
 * busca quando muda (ex.: filtros).
 */
export function useApi<T>(
  fn: () => Promise<T>,
  deps: unknown[] = [],
): State<T> & { reload: () => void } {
  const [state, setState] = useState<State<T>>({
    data: null,
    loading: true,
    erro: null,
  });
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const run = useCallback(() => {
    let vivo = true;
    setState((s) => ({ ...s, loading: true, erro: null }));
    fnRef
      .current()
      .then((data) => {
        if (vivo) setState({ data, loading: false, erro: null });
      })
      .catch((e) => {
        if (vivo)
          setState({
            data: null,
            loading: false,
            erro:
              e instanceof ApiError
                ? e.message
                : 'erro ao carregar. a API está rodando?',
          });
      });
    return () => {
      vivo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => run(), [run]);

  return { ...state, reload: run };
}
