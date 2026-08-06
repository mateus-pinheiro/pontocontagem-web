// Rotas do painel.
//
// O painel vive sob /web (pontocontagem.com.br/web/…) pra deixar a raiz do
// domínio livre pro site institucional e pras páginas legais — que a Apple e o
// Google guardam no cadastro do app e não devem mudar de lugar.
//
// As telas continuam falando em rotas lógicas ('/', '/itens'); só o `painel()`
// conhece o prefixo. Pra mover o painel de lugar, mexa só em BASE_PAINEL.

export const BASE_PAINEL = '/web';

/** Converte uma rota lógica do painel na URL real. `painel('/itens')` → '/web/itens'. */
export function painel(rota: string = '/'): string {
  return rota === '/' ? `${BASE_PAINEL}/` : `${BASE_PAINEL}${rota}`;
}

/** Rotas públicas, sempre na raiz do domínio. */
export const PUBLICAS = {
  termos: '/termos/',
  privacidade: '/privacidade/',
  suporte: '/suporte/',
  excluirConta: '/excluir-conta/',
} as const;
