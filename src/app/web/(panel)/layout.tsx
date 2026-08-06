'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useFlags } from '@/lib/flags';
import { api } from '@/lib/api';
import { PageShell } from '@/components/shell';
import { painel } from '@/lib/rotas';
import { WLoading } from '@/components/ui';

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { usuario, pronto } = useAuth();
  const { ponto, pronto: flagsProntas } = useFlags();
  const router = useRouter();
  const [alerts, setAlerts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (pronto && !usuario) router.replace(painel('/login'));
  }, [pronto, usuario, router]);

  useEffect(() => {
    if (!usuario) return;
    api
      .alertasResumo()
      .then(({ ponto: p, contagem: c, sync: s }) => {
        // badge "pontos" = ponto + sync (tudo que não é contagem);
        // "dashboard" = total. Com o ponto desligado, só contagem conta.
        setAlerts({
          dashboard: (ponto ? p + c + s : c) || undefined,
          ...(ponto ? { pontos: p + s || undefined } : {}),
          contagens: c || undefined,
        } as Record<string, number>);
      })
      .catch(() => setAlerts({}));
  }, [usuario, ponto]);

  // Espera as flags junto com a sessão: sem isso o painel pinta sem "pontos" e
  // depois ganha o item quando a flag resolve.
  if (!pronto || !flagsProntas || !usuario) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <WLoading texto="abrindo o painel…" />
      </div>
    );
  }

  return <PageShell alerts={alerts}>{children}</PageShell>;
}
