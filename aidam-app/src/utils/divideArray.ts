export function divideStringArray(array: string[]) {
  const longitud = array.length;
  const puntoMedio = Math.ceil(longitud / 2);
  
  const primeraMitad = array.slice(0, puntoMedio);
  const segundaMitad = array.slice(puntoMedio);

  return [primeraMitad, segundaMitad];
}
