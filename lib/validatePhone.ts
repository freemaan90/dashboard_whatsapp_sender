/**
 * Normaliza un número de teléfono argentino al formato WhatsApp: 549XXXXXXXXXX
 *
 * Reglas (asume código de área siempre presente):
 *  - Limpia todo lo que no sea dígito
 *  - +549XXXXXXXXXX  → 549XXXXXXXXXX  (formato internacional con +)
 *  - 549XXXXXXXXXX   → 549XXXXXXXXXX  (ya correcto)
 *  - 54AALL15XXXXXX  → 549AAXXXXXXXXX (quita el 15 intercalado)
 *  - 0AALL15XXXXXX   → 549AAXXXXXXXXX (quita 0 inicial y el 15)
 *  - 0AAXXXXXXXXX    → 549AAXXXXXXXXX (quita 0 inicial, agrega 549)
 *  - AALL15XXXXXX    → 549AAXXXXXXXXX (solo área+15+número, agrega 549)
 *  - Cualquier otra cosa → null (inválido)
 *
 * Formato final esperado: 549 + código de área (2-4 dígitos) + número (6-8 dígitos)
 * Total: 549 + 10 dígitos = 13 dígitos
 */
export function normalizeArgPhone(raw: string): string | null {
  // 1. Quitar todo excepto dígitos
  const digits = raw.replace(/\D/g, '');

  if (!digits) return null;

  let local: string; // código de área + número, sin prefijo país

  if (digits.startsWith('549')) {
    // +549... o 549... — quitar prefijo país
    local = digits.slice(3);
  } else if (digits.startsWith('54')) {
    // 54... sin el 9 — quitar prefijo país
    local = digits.slice(2);
  } else if (digits.startsWith('0')) {
    // 0... — formato local con 0 inicial
    local = digits.slice(1);
  } else {
    // Sin prefijo: asumimos que es área + número directamente
    local = digits;
  }

  // Quitar el 15 si aparece después del código de área
  // Códigos de área argentinos: 2 dígitos (ej: 11) o 3 dígitos (ej: 221, 351)
  // Intentamos con área de 2 y 3 dígitos
  local = removeMobile15(local);

  // Validar longitud final: debe ser exactamente 10 dígitos (área + número)
  // Ej: 11 + 12345678 = 10, 221 + 4567890 = 10
  if (local.length !== 10) return null;

  return '549' + local;
}

/**
 * Quita el "15" intercalado entre el código de área y el número.
 * Ej: 1155123456 → 1112345678 (área 11, quita 15)
 *     22115123456 → 2214567890 (área 221, quita 15)
 */
function removeMobile15(local: string): string {
  // Área de 2 dígitos: posición 2-3 es "15"
  if (local.length === 12 && local.slice(2, 4) === '15') {
    return local.slice(0, 2) + local.slice(4);
  }
  // Área de 3 dígitos: posición 3-4 es "15"
  if (local.length === 12 && local.slice(3, 5) === '15') {
    return local.slice(0, 3) + local.slice(5);
  }
  return local;
}

/**
 * Valida que un string ya normalizado sea un número válido.
 * Solo dígitos, entre 7 y 15 caracteres (para uso genérico).
 */
export function validatePhone(value: string): boolean {
  return /^\d{7,15}$/.test(value);
}
