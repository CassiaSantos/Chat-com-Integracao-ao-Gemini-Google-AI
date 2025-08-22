/** Trunca uma string se ela for maior que o comprimento máximo especificado e removendo espaços em branco do final antes de adicionar as reticências.
 * @param {string} text - O texto a ser truncado.
 * @param {number} maxLength - O comprimento máximo permitido.
 * @returns {string} O texto truncado ou o texto original.
 */
 
function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    const slicedText = text.slice(0, maxLength); // Corta a string no comprimento máximo.
    const trimmedText = slicedText.trimEnd(); // Remove qualquer espaço em branco do final.
    return trimmedText + '...';
  }
  return text;
}

module.exports = { truncateText };