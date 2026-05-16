// Cliente tipado da API NestJS (painel do gerente).
// Token JWT guardado no localStorage; toda chamada autenticada manda
// Authorization: Bearer <token>.

const BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'http://localhost:3000/api';

const TOKEN_KEY = 'vp_token';
const USER_KEY = 'vp_usuario';

// ── Tipos da API ─────────────────────────────────────────────────────────
export type CategoriaItem = 'COZINHA' | 'BAR' | 'LIMPEZA';
export type StatusContagem = 'ABERTA' | 'FINALIZADA';
export type TipoPonto = 'ENTRADA' | 'INICIO_PAUSA' | 'FIM_PAUSA' | 'SAIDA';
export type StatusFuncionario =
  | 'trabalhando'
  | 'em pausa'
  | 'fora'
  | 'inativo';

export interface Usuario {
  sub: string;
  tipo: 'gerente' | 'funcionario';
  nome: string;
  deveTrocarSenha?: boolean;
}

export interface LoginResp {
  token: string;
  usuario: Usuario;
}

export interface ListaResumo {
  id: string;
  nome: string;
}

export interface Funcionario {
  id: string;
  nome: string;
  cargo: string | null;
  foto: string | null;
  ativo: boolean;
  pinDefinido: boolean;
  listas: ListaResumo[];
  status: StatusFuncionario;
  desde: string | null;
  ultimoPonto: { tipo: TipoPonto; registradoEm: string } | null;
  criadoEm: string;
}

export interface UltimoEstoque {
  quantidade: number;
  registradoEm: string;
  contadoPor: { id: string; nome: string };
}

export interface Item {
  id: string;
  nome: string;
  categoria: CategoriaItem;
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
    item: { id: string; nome: string; categoria: CategoriaItem; unidade: string };
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
    item: { id: string; nome: string; categoria: CategoriaItem; unidade: string };
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
  funcionario: { id: string; nome: string };
}

export interface Gerente {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  deveTrocarSenha: boolean;
  ultimoAcesso: string | null;
  criadoEm: string;
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
    categoria: CategoriaItem;
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
export function getUsuario(): Usuario | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as Usuario) : null;
}
export function setAuth(token: string, usuario: Usuario) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(usuario));
}
export function clearAuth() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

// ── Erro de API ──────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401 || res.status === 403) {
    // Sessão inválida/expirada — limpa e empurra para o login.
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
  loginGerente: (email: string, senha: string) =>
    request<LoginResp>('/auth/gerente/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    }),
  trocarSenha: (senhaAtual: string, novaSenha: string) =>
    request<{ mensagem: string }>('/auth/gerente/trocar-senha', {
      method: 'POST',
      body: JSON.stringify({ senhaAtual, novaSenha }),
    }),

  // dashboard / relatórios
  dashboard: () => request<Dashboard>('/dashboard'),
  relatorios: (periodo: string) =>
    request<Relatorio>(`/relatorios${qs({ periodo })}`),

  // funcionários
  funcionarios: (busca?: string) =>
    request<Paginado<Funcionario>>(
      `/funcionarios${qs({ busca, limit: 100 })}`,
    ),
  criarFuncionario: (body: {
    nome: string;
    cargo?: string;
    listaIds?: string[];
  }) =>
    request<Funcionario>('/funcionarios', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  atualizarFuncionario: (
    id: string,
    body: {
      nome?: string;
      cargo?: string;
      ativo?: boolean;
      listaIds?: string[];
    },
  ) =>
    request<Funcionario>(`/funcionarios/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  resetarPin: (id: string) =>
    request<{ mensagem: string }>(`/funcionarios/${id}/resetar-pin`, {
      method: 'POST',
    }),

  // itens
  itens: (categoria?: CategoriaItem, busca?: string) =>
    request<Paginado<Item>>(`/itens${qs({ categoria, busca, limit: 100 })}`),
  item: (id: string) => request<ItemDetalhe>(`/itens/${id}`),
  criarItem: (body: { nome: string; categoria: CategoriaItem; unidade: string }) =>
    request<Item>('/itens', { method: 'POST', body: JSON.stringify(body) }),
  atualizarItem: (
    id: string,
    body: {
      nome?: string;
      categoria?: CategoriaItem;
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
    funcionarioIds: string[];
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
    funcionarioId?: string;
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

  // gerentes
  gerentes: () => request<Gerente[]>('/gerentes'),
  criarGerente: (body: { nome: string; email: string; senha: string }) =>
    request<Gerente>('/gerentes', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  atualizarGerente: (id: string, body: { nome?: string; ativo?: boolean }) =>
    request<Gerente>(`/gerentes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  desativarGerente: (id: string) =>
    request<Gerente>(`/gerentes/${id}/desativar`, { method: 'POST' }),
  resetarSenhaGerente: (id: string) =>
    request<{ senhaTemporaria: string }>(`/gerentes/${id}/resetar-senha`, {
      method: 'POST',
    }),
};
