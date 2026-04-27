/**
 * Normaliza texto para comparação insensível a caixa e a diacríticos.
 * Útil em buscas locais com entrada do usuário em pt-BR
 * (ex: "acai" deve casar com "Açaí").
 */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}
