/**
 * Geração de CSV no client. Escapa aspas/vírgulas/quebras e adiciona BOM
 * UTF-8 pra Excel/Sheets reconhecer acentos corretamente.
 *
 * Linhas vazias (todas as células `null`/`undefined`) viram separador em
 * branco — útil pra blocos agrupados.
 */

export type Cell = string | number | null | undefined;
export type Row = Cell[];

function escapar(c: Cell): string {
  if (c === null || c === undefined) return '';
  const s = String(c);
  if (s.includes('"') || s.includes(',') || s.includes('\n') || s.includes('\r')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function rowsToCsv(rows: Row[]): string {
  return rows.map((r) => r.map(escapar).join(',')).join('\r\n');
}

export function downloadCsv(nome: string, rows: Row[]) {
  const csv = rowsToCsv(rows);
  // BOM (﻿) pra Excel detectar UTF-8 corretamente nos acentos.
  const blob = new Blob(['﻿' + csv], {
    type: 'text/csv;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nome.endsWith('.csv') ? nome : `${nome}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Libera o objectURL no próximo tick pra evitar problemas em alguns browsers.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** Slug seguro pra nome de arquivo. */
export function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
