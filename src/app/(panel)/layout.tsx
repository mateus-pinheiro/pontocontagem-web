'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { PageShell } from '@/components/shell';
import { WLoading } from '@/components/ui';

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { usuario, pronto } = useAuth();
  const router = useRouter();
  const [alerts, setAlerts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (pronto && !usuario) router.replace('/login');
  }, [pronto, usuario, router]);

  useEffect(() => {
    if (!usuario) return;
    api
      .alertasResumo()
      .then(({ ponto, contagem, sync }) => {
        // mesma derivação de antes: badge "pontos" = ponto + sync
        // (tudo que não é contagem); "dashboard" = total.
        setAlerts({
          dashboard: ponto + contagem + sync || undefined,
          pontos: ponto + sync || undefined,
          contagens: contagem || undefined,
        } as Record<string, number>);
      })
      .catch(() => setAlerts({}));
  }, [usuario]);

  if (!pronto || !usuario) {
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
