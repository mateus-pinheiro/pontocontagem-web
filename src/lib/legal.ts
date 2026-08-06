// Dados usados nos documentos legais (termos, privacidade, suporte,
// exclusão de conta). Tudo que muda de titular pra titular mora aqui —
// as páginas só consomem essas constantes.
//
// O domínio das páginas públicas é pontocontagem.com.br; o painel fica sob
// /web (ver lib/rotas.ts).

export const LEGAL = {
  /** Nome comercial do produto. */
  produto: 'Ponto Contagem',
  /** Titular / controlador dos dados (pessoa física). */
  titular: 'Mateus França Pinheiro',
  /**
   * CPF do titular, só dígitos. Deixe '' pra omitir a menção nos documentos.
   * A formatação é feita por `cpfFormatado()` — não precisa pontuar aqui.
   */
  cpf: '45864610801',
  /** Contato único de suporte, privacidade e exercício de direitos LGPD. */
  email: 'mateus.franca.pinheiro@gmail.com',
  /** Identificadores das lojas. */
  bundleId: 'br.com.pontocontagem.app',
  /** Última revisão dos documentos (exibida no topo de cada página). */
  atualizadoEm: '6 de agosto de 2026',
  /** Prazo de resposta prometido no suporte e nos pedidos de exclusão. */
  prazoResposta: '5 dias úteis',
  /** Retenção após o pedido de exclusão (backups rotativos). */
  prazoExclusao: '30 dias',
} as const;

/** CPF pontuado pra exibição (000.000.000-00). '' quando não há CPF. */
export function cpfFormatado(): string {
  const d = LEGAL.cpf.replace(/\D/g, '');
  if (d.length !== 11) return LEGAL.cpf;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}
