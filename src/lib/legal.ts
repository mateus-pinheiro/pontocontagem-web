// Dados usados nos documentos legais (termos, privacidade, suporte,
// exclusão de conta). Tudo que muda de titular pra titular mora aqui —
// as páginas só consomem essas constantes.
//
// ⚠️ PREENCHER ANTES DE PUBLICAR: `CPF` está vazio de propósito. Os
// documentos escondem a linha enquanto ele estiver em branco, mas a LGPD
// e as lojas gostam de um controlador identificável.

export const LEGAL = {
  /** Nome comercial do produto. */
  produto: 'Ponto Contagem',
  /** Titular / controlador dos dados (pessoa física). */
  titular: 'Mateus França Pinheiro',
  /** CPF do titular. Deixe '' pra omitir a linha nos documentos. */
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
