import type { ParseExcelResult } from './parseExcelPhones';

/**
 * Convierte un valor en notación científica (ej: "5,49341E+12" o "5.49341E+12")
 * al string entero correspondiente. Si no es notación científica, retorna el valor tal cual.
 */
function normalizeScientificNotation(value: string): string {
  // Reemplazar coma decimal por punto para parseFloat
  const normalized = value.replace(',', '.');
  if (/^[\d.]+[eE][+-]?\d+$/.test(normalized)) {
    const num = parseFloat(normalized);
    if (!isNaN(num)) return Math.round(num).toString();
  }
  return value;
}

/**
 * Lee un archivo CSV (.csv) como texto UTF-8.
 * - Detecta el delimitador: si la primera línea contiene `;` usa `;`, si no usa `,`.
 * - Si la primera fila contiene "telefono" (case-insensitive), se trata como headers.
 * - Si no, se asume que solo hay una columna de teléfonos (modo legacy).
 * - Omite filas con campo `telefono` vacío o solo espacios.
 * - Retorna `{ headers, rows, hasHeaders }` con el mismo shape que `ParseExcelResult`.
 */
export async function parseCSVPhones(file: File): Promise<ParseExcelResult> {
  const text = await file.text();

  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    return { headers: ['telefono'], rows: [], hasHeaders: false };
  }

  const delimiter = lines[0].includes(';') ? ';' : ',';

  const firstRow = lines[0].split(delimiter).map((cell) => cell.trim().toLowerCase());
  const hasHeaders = firstRow.includes('telefono');

  if (hasHeaders) {
    const headers = firstRow;
    const dataLines = lines.slice(1);
    const rows = dataLines
      .map((line, i) => {
        const cells = line.split(delimiter);
        const fields: Record<string, string> = {};
        headers.forEach((h, idx) => {
          const raw = (cells[idx] ?? '').trim();
          fields[h] = h === 'telefono' ? normalizeScientificNotation(raw) : raw;
        });
        return { rowIndex: i + 2, fields }; // +2: 1 for header, 1 for 1-based
      })
      .filter((row) => (row.fields['telefono'] ?? '').trim().length > 0);

    return { headers, rows, hasHeaders: true };
  } else {
    // Modo legacy: solo columna de teléfonos, sin headers
    const rows = lines
      .map((line, i) => {
        const cells = line.split(delimiter);
        return {
          rowIndex: i + 1,
          fields: { telefono: normalizeScientificNotation((cells[0] ?? '').trim()) },
        };
      })
      .filter((row) => row.fields['telefono'].length > 0);

    return { headers: ['telefono'], rows, hasHeaders: false };
  }
}
