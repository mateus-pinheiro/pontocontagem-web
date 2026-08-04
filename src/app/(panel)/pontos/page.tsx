'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFlags } from '@/lib/flags';
import { WLoading } from '@/components/ui';
import PontosScreen from '@/screens/PontosScreen';

// O export estático publica /pontos/index.html mesmo com a flag desligada,
// então o guard tem que ser aqui no cliente. É visibilidade, não segurança —
// quem manda de verdade é o RBAC da API.
export default function Page() {
  const { ponto, pronto } = useFlags();
  const router = useRouter();

  useEffect(() => {
    if (pronto && !ponto) router.replace('/');
  }, [ponto, pronto, router]);

  if (!pronto || !ponto) return <WLoading texto="abrindo…" />;
  return <PontosScreen />;
}
