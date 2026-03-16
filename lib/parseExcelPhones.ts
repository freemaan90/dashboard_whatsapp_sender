import * as XLSX from 'xlsx';

export interface ExcelRow {
  /** Número de fila original (1-based, sin contar el header) */
  rowIndex: number;
  /** Todos los campos de la fila, keys en lowercase */
  fields: Record<string, string>;
}

export interface ParseExcelResult {
  /** Headers encontrados en la primera fila, en lowercase */
  headers: string[];
  /** Filas de datos (sin el header) */
  rows: ExcelRow[];
  /** true si el Excel tiene headers (primera fila no es un número de teléfono) */
  hasHeaders: boolean;
}

/**
 * Lee un archivo Excel (.xlsx/.xls).
 * - Si la primera fila contiene "telefono" (case-insensitive), se trata como headers.
 * - Si no, se asume que solo hay una columna de teléfonos (modo legacy).
 * - Todos los keys de campos se normalizan a lowercase.
 */
export async function parseExcelPhones(file: File): Promise<ParseExcelResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  if (rawRows.length === 0) {
    return { headers: ['telefono'], rows: [], hasHeaders: false };
  }

  const firstRow = rawRows[0].map((cell: any) => String(cell ?? '').trim().toLowerCase());
  const hasHeaders = firstRow.includes('telefono');

  if (hasHeaders) {
    const headers = firstRow;
    const dataRows = rawRows.slice(1);
    const rows: ExcelRow[] = dataRows
      .map((raw, i) => {
        const fields: Record<string, string> = {};
        headers.forEach((h, idx) => {
          fields[h] = String(raw[idx] ?? '').trim();
        });
        return { rowIndex: i + 2, fields }; // +2: 1 for header, 1 for 1-based
      })
      .filter((row) => row.fields['telefono']?.length > 0);

    return { headers, rows, hasHeaders: true };
  } else {
    // Modo legacy: solo columna de teléfonos, sin headers
    const rows: ExcelRow[] = rawRows
      .map((raw, i) => ({
        rowIndex: i + 1,
        fields: { telefono: String(raw[0] ?? '').trim() },
      }))
      .filter((row) => row.fields['telefono'].length > 0);

    return { headers: ['telefono'], rows, hasHeaders: false };
  }
}

/**
 * Extrae los nombres de campos {{campo}} de un template de mensaje.
 * Retorna los nombres en lowercase, sin duplicados.
 */
export function extractTemplateFields(message: string): string[] {
  const matches = message.match(/\{\{(\w+)\}\}/g) ?? [];
  const fields = matches.map((m) => m.slice(2, -2).toLowerCase());
  return [...new Set(fields)];
}

/**
 * Reemplaza los campos {{campo}} en un mensaje con los valores de la fila.
 */
export function interpolateMessage(message: string, fields: Record<string, string>): string {
  return message.replace(/\{\{(\w+)\}\}/g, (_, key) => fields[key.toLowerCase()] ?? '');
}
