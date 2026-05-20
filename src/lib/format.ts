// Mapeamentos enum da API -> rótulos do design (pt-BR, minúsculas) e
// formatadores de data/número usados no painel.

import type { TipoPonto } from './api';

export const TIPO_PONTO_LABEL: Record<TipoPonto, string> = {
  ENTRADA: 'entrada',
  INICIO_PAUSA: 'início da pausa',
  FIM_PAUSA: 'fim da pausa',
  SAIDA: 'saída',
};

export const TIPO_PONTO_API: Record<string, TipoPonto> = {
  entrada: 'ENTRADA',
  'início da pausa': 'INICIO_PAUSA',
  'fim da pausa': 'FIM_PAUSA',
  saída: 'SAIDA',
};

const DIAS_ABREV = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

function mesmoDia(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** "hoje, 09:01" / "qui, 18:30" / "12/05 16:50" */
export function fmtPontoRel(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  const agora = new Date();
  const hora = d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  if (mesmoDia(d, agora)) return `hoje, ${hora}`;
  const ontem = new Date(agora);
  ontem.setDate(ontem.getDate() - 1);
  if (mesmoDia(d, ontem)) return `ontem, ${hora}`;
  const diffDias = Math.round(
    (agora.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDias < 7) return `${DIAS_ABREV[d.getDay()]}, ${hora}`;
  return `${String(d.getDate()).padStart(2, '0')}/${String(
    d.getMonth() + 1,
  ).padStart(2, '0')} ${hora}`;
}

/** "hoje, 16/05" / "qui, 15/05" / "seg, 12/05" */
export function fmtDataContagem(iso: string): string {
  const d = new Date(iso);
  const agora = new Date();
  const dm = `${String(d.getDate()).padStart(2, '0')}/${String(
    d.getMonth() + 1,
  ).padStart(2, '0')}`;
  if (mesmoDia(d, agora)) return `hoje, ${dm}`;
  return `${DIAS_ABREV[d.getDay()]}, ${dm}`;
}

/** "09:01" */
export function fmtHora(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** "sexta, 16 de maio" */
export function fmtDataLonga(d = new Date()): string {
  const dias = [
    'domingo',
    'segunda',
    'terça',
    'quarta',
    'quinta',
    'sexta',
    'sábado',
  ];
  return `${dias[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`;
}

/** "quinta-feira, 15/05" */
export function fmtDataDetalhe(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  const dias = [
    'domingo',
    'segunda-feira',
    'terça-feira',
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    'sábado',
  ];
  return `${dias[d.getDay()]}, ${String(d.getDate()).padStart(
    2,
    '0',
  )}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Inteiro mostra cheio; fracionário com 1 casa. */
export function fmtQtd(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—';
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

/** "42,8" — vírgula decimal pt-BR. */
export function fmtNum(n: number, casas = 1): string {
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
}

/** YYYY-MM-DD da data de hoje (para criar contagem). */
export function hojeISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Datetime-local (YYYY-MM-DDTHH:mm) a partir de ISO. */
export function isoParaLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate(),
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
