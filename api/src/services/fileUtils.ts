export function countLines(buffer: Buffer): number {
  const content = buffer.toString('utf-8');
  if (!content.trim()) {
    return 0;
  }
  // Cuenta las líneas dividiendo por \n y filtrando líneas vacías al final
  const lines = content.split('\n').filter((line, index, arr) => {
    // Incluir todas las líneas excepto la última si está vacía
    return index < arr.length - 1 || line.trim().length > 0;
  });
  return lines.length;
}
