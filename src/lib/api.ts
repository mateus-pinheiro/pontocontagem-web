// Cliente tipado da API NestJS (painel multi-tenant).
// Token JWT no localStorage; toda chamada autenticada manda
// Authorization: Bearer <token>. RBAC fino servidor-side.

const BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'http://localhost:3000/api';

const TOKEN_KEY = 'vp_token';
const USER_KEY = 'vp_usuario';
const SESSION_KEY = 'vp_session_token';

// ── Enums e tipos da API ─────────────────────────────────────────────────
export type StatusContagem = 'ABERTA' | 'FINALIZADA';
export type TipoPonto = 'ENTRADA' | 'INICIO_PAUSA' | 'FIM_PAUSA' | 'SAIDA';
export type StatusFuncionario =
  | 'trabalhando'
  | 'em pausa'
  | 'fora'
  | 'inativo';

/** Catálogo fixo de permissões (mesmo enum Permissao do schema). */
export type Permissao =
  | 'USUARIO_GERENCIAR'
  | 'ROLE_GERENCIAR'
  | 'ESTABELECIMENTO_CRIAR'
  | 'ESTABELECIMENTO_EDITAR'
  | 'ITEM_GERENCIAR'
  | 'LISTA_GERENCIAR'
  | 'CONTAGEM_CRIAR'
  | 'CONTAGEM_FINALIZAR'
  | 'CONTAGEM_ATRIBUIR'
  | 'CONTAGEM_CONTAR'
  | 'PONTO_BATER'
  | 'PONTO_CORRIGIR'
  | 'RELATORIO_VER'
  | 'DASHBOARD_VER';

export const TODAS_PERMISSOES: Permissao[] = [
  'USUARIO_GERENCIAR',
  'ROLE_GERENCIAR',
  'ESTABELECIMENTO_CRIAR',
  'ESTABELECIMENTO_EDITAR',
  'ITEM_GERENCIAR',
  'LISTA_GERENCIAR',
  'CONTAGEM_CRIAR',
  'CONTAGEM_FINALIZAR',
  'CONTAGEM_ATRIBUIR',
  'CONTAGEM_CONTAR',
  'PONTO_BATER',
  'PONTO_CORRIGIR',
  'RELATORIO_VER',
  'DASHBOARD_VER',
];

/** Usuário autenticado (shape devolvido pela API no token completo). */
export interface Usuario {
  id: string;
  nome: string;
  estabelecimentoId: string;
  estabelecimentoNome: string;
  permissoes: Permissao[];
  deveTrocarSenha?: boolean;
}

export interface EstabelecimentoRef {
  id: string;
  nome: string;
}

/** Resposta do login quando o usuário tem 1 estabelecimento ativo. */
export interface TokenCompleto {
  token: string;
  usuario: Usuario;
}

/** Resposta do login quando há >1 estabelecimento e o cliente precisa escolher. */
export interface TokenSessao {
  sessionToken: string;
  estabelecimentos: EstabelecimentoRef[];
  precisaSelecionar: true;
}

export type LoginResp = TokenCompleto | TokenSessao;

// ── Tipos de domínio ─────────────────────────────────────────────────────

export interface ListaResumo {
  id: string;
  nome: string;
}

export interface UltimoEstoque {
  quantidade: number;
  registradoEm: string;
  contadoPor: { id: string; nome: string };
}

/** Cores aceitas pelo back; combinam com os `tone`s do <WTag>. */
export type CorCategoria = 'neutral' | 'terra' | 'green' | 'blue' | 'amber';

/** Setor = compartimento físico/operacional (bar, cozinha, limpeza). */
export interface SetorResumo {
  id: string;
  nome: string;
  cor: CorCategoria;
}

export interface Setor extends SetorResumo {
  estabelecimentoId: string;
  ordem: number;
  ativo: boolean;
  categorias: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Categoria {
  id: string;
  estabelecimentoId: string;
  setorId: string;
  parentId: string | null;
  nome: string;
  cor: CorCategoria;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
  setor: SetorResumo;
  parent: { id: string; nome: string } | null;
  filhas: number;
}

/**
 * Snippet de categoria embarcado em item/contagem/relatório.
 * `setor` e `parent` só vêm no payload de /itens (e endpoints que migrarem);
 * /listas-contagem e /contagens ainda mandam só id/nome/cor.
 */
export interface CategoriaResumo {
  id: string;
  nome: string;
  cor: CorCategoria;
  setor?: SetorResumo;
  parent?: { id: string; nome: string } | null;
}

export interface Item {
  id: string;
  nome: string;
  descricao: string | null;
  categoria: CategoriaResumo;
  unidade: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
  ultimoEstoque: UltimoEstoque | null;
}

export interface ItemDetalhe extends Item {
  apareceEm: { id: string; nome: string; itens: number }[];
}

export interface Lista {
  id: string;
  nome: string;
  criadoPor: { id: string; nome: string };
  totalItens: number;
  itens: {
    ordem: number;
    item: { id: string; nome: string; categoria: CategoriaResumo; unidade: string };
  }[];
  criadoEm: string;
}

export interface ContagemResumo {
  id: string;
  template: ListaResumo;
  data: string;
  status: StatusContagem;
  totalFuncionarios: number;
  itensContados: number;
  finalizadaEm: string | null;
}

export interface ContagemDetalhe {
  id: string;
  data: string;
  status: StatusContagem;
  template: ListaResumo;
  finalizadaEm: string | null;
  atribuidos: { id: string; nome: string }[];
  itens: {
    ordem: number;
    item: { id: string; nome: string; categoria: CategoriaResumo; unidade: string };
    quantidade: number | null;
    contadoPor: { id: string; nome: string } | null;
    registradoEm: string | null;
  }[];
}

export interface Ponto {
  id: string;
  tipo: TipoPonto;
  registradoEm: string;
  sincronizado: boolean;
  suspeito: boolean;
  corrigido: boolean;
  corrigidoEm: string | null;
  valorAnterior: string | null;
  justificativa: string | null;
  funcionario: { id: string };
}

export interface Membro {
  id: string;
  nome: string;
  email: string | null;
  documento: string | null;
  cargo: string | null;
  ativo: boolean;
  codigoAcesso: string | null;
  temCodigoAcesso: boolean;
  temSenha: boolean;
  temPin: boolean;
  usuarioId: string;
  roles: { id: string; nome: string }[];
}

export interface Role {
  id: string;
  nome: string;
  sistema: boolean;
  permissoes: Permissao[];
  membros?: number;
}

export interface Dashboard {
  stats: {
    trabalhandoAgora: number;
    ativosHoje: number;
    emPausa: number;
    emPausaResumo: string | null;
    contagensAndamento: number;
    contagensResumo: string;
    precisamAtencao: number;
  };
  trabalhando: {
    id: string;
    nome: string;
    cargo: string | null;
    status: StatusFuncionario;
    desde: string | null;
  }[];
  contagensHoje: {
    id: string;
    nome: string;
    data: string;
    status: StatusContagem;
    contados: number;
    total: number;
    atribuidos: { id: string; nome: string }[];
  }[];
  alertas: {
    id: string;
    tipo: 'ponto' | 'contagem' | 'sync';
    texto: string;
    tom: 'amber' | 'terra' | 'neutral';
  }[];
  horasSemana: { dia: string; valor: number }[];
  horasSemanaTotal: number;
}

export interface Relatorio {
  periodo: string;
  intervalo: { de: string; ate: string };
  stats: {
    horasTotais: number;
    diasTrabalhados: number;
    horasPausa: number;
    pctPausa: number;
    funcionariosAtivos: number;
    contagensFechadas: number;
  };
  porFuncionario: {
    id: string;
    nome: string;
    horas: number;
    pausa: number;
    dias: number;
  }[];
  estoqueAtual: {
    id: string;
    nome: string;
    categoria: CategoriaResumo;
    unidade: string;
    ultimoEstoque: number | null;
  }[];
}

export interface Paginado<T> {
  dados: T[];
  total: number;
  page: number;
  limit: number;
}

// ── Token helpers ────────────────────────────────────────────────────────
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}
export function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(SESSION_KEY);
}
export function getUsuario(): Usuario | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as Usuario) : null;
}
export function setAuth(token: string, usuario: Usuario) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(usuario));
  window.localStorage.removeItem(SESSION_KEY);
}
export function setSessionToken(t: string) {
  window.localStorage.setItem(SESSION_KEY, t);
}
export function clearAuth() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(SESSION_KEY);
  clearApiCache();
}

/** Helper de permissão: true se o usuário tem TODAS as listadas. */
export function temPermissao(u: Usuario | null, ...p: Permissao[]) {
  if (!u) return false;
  return p.every((x) => u.permissoes.includes(x));
}

// ── Cache de leitura + dedup ─────────────────────────────────────────────
const CACHE_TTL = 30_000;
interface CacheEntry {
  t: number;
  v: unknown;
}
const gcache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<unknown>>();

export function peekCache<T>(
  key: string,
): { data: T; stale: boolean } | null {
  const e = gcache.get(key);
  if (!e) return null;
  return { data: e.v as T, stale: Date.now() - e.t > CACHE_TTL };
}
export function clearApiCache() {
  gcache.clear();
  inflight.clear();
}

// ── Erro ────────────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function doRequest<T>(
  path: string,
  options: RequestInit = {},
  authOverride?: string | null,
): Promise<T> {
  const token = authOverride !== undefined ? authOverride : getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401 || res.status === 403) {
    if (typeof window !== 'undefined' && !path.startsWith('/auth/')) {
      clearAuth();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
  }

  const texto = await res.text();
  const corpo = texto ? JSON.parse(texto) : null;

  if (!res.ok) {
    const msg =
      (corpo && (corpo.message || corpo.error)) || `erro ${res.status}`;
    throw new ApiError(
      res.status,
      Array.isArray(msg) ? msg.join(', ') : String(msg),
    );
  }
  return corpo as T;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();

  if (method !== 'GET') {
    const data = await doRequest<T>(path, options);
    gcache.clear();
    return data;
  }

  const existing = inflight.get(path);
  if (existing) return existing as Promise<T>;

  const p = (async () => {
    try {
      const data = await doRequest<T>(path, options);
      gcache.set(path, { t: Date.now(), v: data });
      return data;
    } finally {
      inflight.delete(path);
    }
  })();
  inflight.set(path, p);
  return p as Promise<T>;
}

function qs(params: Record<string, string | number | undefined>) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '' && v !== null) p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : '';
}

// ── Endpoints ────────────────────────────────────────────────────────────
export const api = {
  // auth
  login: (email: string, senha: string) =>
    request<LoginResp>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    }),
  meusEstabelecimentos: () =>
    doRequest<EstabelecimentoRef[]>(
      '/auth/meus-estabelecimentos',
      { method: 'GET' },
      getSessionToken(),
    ),
  selecionarEstabelecimento: (estabelecimentoId: string) =>
    doRequest<TokenCompleto>(
      `/auth/selecionar-estabelecimento/${estabelecimentoId}`,
      { method: 'POST' },
      getSessionToken(),
    ),
  trocarSenha: (senhaAtual: string, novaSenha: string) =>
    request<{ mensagem: string }>('/auth/trocar-senha', {
      method: 'POST',
      body: JSON.stringify({ senhaAtual, novaSenha }),
    }),
  registrar: (body: {
    nomeEstabelecimento: string;
    nomeUsuario: string;
    email: string;
    senha: string;
  }) =>
    request<TokenCompleto>('/auth/registrar', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // dashboard / relatórios
  dashboard: () => request<Dashboard>('/dashboard'),
  alertasResumo: () =>
    request<{ ponto: number; contagem: number; sync: number }>(
      '/dashboard/alertas-resumo',
    ),
  relatorios: (periodo: string) =>
    request<Relatorio>(`/relatorios${qs({ periodo })}`),

  // setores (compartimentos do estabelecimento)
  setores: () => request<Setor[]>('/setores'),
  criarSetor: (body: { nome: string; cor?: CorCategoria; ordem?: number }) =>
    request<Setor>('/setores', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  atualizarSetor: (
    id: string,
    body: {
      nome?: string;
      cor?: CorCategoria;
      ordem?: number;
      ativo?: boolean;
    },
  ) =>
    request<Setor>(`/setores/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  // categorias (catálogo por estabelecimento)
  categorias: (setorId?: string) =>
    request<Categoria[]>(`/categorias${qs({ setorId })}`),
  criarCategoria: (body: {
    nome: string;
    setorId: string;
    parentId?: string;
    cor?: CorCategoria;
  }) =>
    request<Categoria>('/categorias', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  atualizarCategoria: (
    id: string,
    body: {
      nome?: string;
      cor?: CorCategoria;
      ativo?: boolean;
      parentId?: string | null;
    },
  ) =>
    request<Categoria>(`/categorias/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  // itens
  itens: (categoriaId?: string, busca?: string) =>
    request<Paginado<Item>>(`/itens${qs({ categoriaId, busca, limit: 100 })}`),
  item: (id: string) => request<ItemDetalhe>(`/itens/${id}`),
  criarItem: (body: {
    nome: string;
    descricao?: string;
    categoriaId: string;
    unidade: string;
  }) =>
    request<Item>('/itens', { method: 'POST', body: JSON.stringify(body) }),
  atualizarItem: (
    id: string,
    body: {
      nome?: string;
      descricao?: string | null;
      categoriaId?: string;
      unidade?: string;
      ativo?: boolean;
    },
  ) =>
    request<Item>(`/itens/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  // listas
  listas: () => request<Lista[]>('/listas-contagem'),
  lista: (id: string) => request<Lista>(`/listas-contagem/${id}`),
  criarLista: (body: { nome: string; itemIds: string[] }) =>
    request<Lista>('/listas-contagem', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  atualizarLista: (id: string, body: { nome?: string; itemIds?: string[] }) =>
    request<Lista>(`/listas-contagem/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  // contagens
  contagens: (status?: StatusContagem) =>
    request<ContagemResumo[]>(`/contagens${qs({ status })}`),
  contagem: (id: string) => request<ContagemDetalhe>(`/contagens/${id}`),
  criarContagem: (body: {
    templateId: string;
    data: string;
    membershipIds: string[];
  }) =>
    request<ContagemDetalhe>('/contagens', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  reabrirContagem: (id: string) =>
    request<ContagemDetalhe>(`/contagens/${id}/reabrir`, { method: 'POST' }),
  cancelarContagem: (id: string) =>
    request<{ mensagem: string }>(`/contagens/${id}/cancelar`, {
      method: 'POST',
    }),

  // pontos
  pontos: (params: {
    membershipId?: string;
    de?: string;
    ate?: string;
    tipo?: TipoPonto;
  }) => request<Ponto[]>(`/pontos${qs(params)}`),
  corrigirPonto: (
    id: string,
    body: { registradoEm: string; justificativa: string },
  ) =>
    request<Ponto>(`/pontos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  // membros (gestão de pessoas no estabelecimento)
  membros: () => request<Membro[]>('/membros'),
  membro: (id: string) => request<Membro>(`/membros/${id}`),
  criarMembro: (body: {
    nome: string;
    email?: string;
    documento?: string;
    cargo?: string;
    roleIds: string[];
    senha?: string;
    gerarCodigo?: boolean;
  }) =>
    request<Membro & { codigoAcesso?: string }>('/membros', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  atualizarMembro: (
    id: string,
    body: { cargo?: string; roleIds?: string[]; ativo?: boolean },
  ) =>
    request<Membro>(`/membros/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  desativarMembro: (id: string) =>
    request<{ mensagem: string }>(`/membros/${id}/desativar`, {
      method: 'POST',
    }),
  resetarSenhaMembro: (id: string) =>
    request<{ senhaTemporaria: string }>(`/membros/${id}/resetar-senha`, {
      method: 'POST',
    }),
  resetarPinMembro: (id: string) =>
    request<{ mensagem: string }>(`/membros/${id}/resetar-pin`, {
      method: 'POST',
    }),
  regenerarCodigoMembro: (id: string) =>
    request<{ codigoAcesso: string }>(`/membros/${id}/codigo-acesso`, {
      method: 'POST',
    }),

  // roles (funções customizáveis por estabelecimento)
  catalogoPermissoes: () =>
    request<Permissao[]>('/roles/permissoes'),
  roles: () => request<Role[]>('/roles'),
  criarRole: (body: { nome: string; permissoes: Permissao[] }) =>
    request<Role>('/roles', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  atualizarRole: (
    id: string,
    body: { nome?: string; permissoes?: Permissao[] },
  ) =>
    request<Role>(`/roles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  removerRole: (id: string) =>
    request<{ mensagem: string }>(`/roles/${id}`, { method: 'DELETE' }),
};
