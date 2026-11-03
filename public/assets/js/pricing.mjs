export const FREQUENCIES = Object.freeze({
  diario: 30,
  cada_2_dias: 15,
  cada_3_dias: 10,
  semanal: 4,
  quincenal: 2,
  mensual: 1
});

export function getPriceLevel(monthlyBaseCents) {
  if (!Number.isSafeInteger(monthlyBaseCents) || monthlyBaseCents < 0) throw new RangeError('Consumo mensual inválido');
  return monthlyBaseCents >= 500_000 ? 3 : monthlyBaseCents >= 400_000 ? 2 : 1;
}

export function lineTotalCents(product, level, quantity) {
  const tenths = Math.round(quantity * 10);
  if (!Number.isFinite(quantity) || tenths < 0 || tenths > 9990 || Math.abs(quantity * 10 - tenths) > 1e-8 || (product?.unit === 'pieza' && tenths % 10 !== 0)) {
    throw new RangeError('Cantidad inválida');
  }
  const price = product?.[`price${level}Cents`];
  if (!Number.isSafeInteger(price) || price < 0) throw new TypeError('Faltan precios del producto');
  const total = Math.round(price * tenths / 10);
  if (!Number.isSafeInteger(total)) throw new RangeError('Total demasiado grande');
  return total;
}

export function calculateQuote(lines, frequency) {
  const multiplier = FREQUENCIES[frequency];
  if (!multiplier) throw new RangeError('Frecuencia inválida');
  if (!Array.isArray(lines)) throw new TypeError('El carrito debe ser una lista');
  let baseCents = 0;
  for (const { product, quantity } of lines) {
    if (!product || !Number.isSafeInteger(product.price1Cents) || !Number.isSafeInteger(product.price2Cents) || !Number.isSafeInteger(product.price3Cents)) throw new TypeError('Faltan precios del producto');
    baseCents += lineTotalCents(product, 1, quantity);
  }
  const monthlyBaseCents = baseCents * multiplier;
  const level = getPriceLevel(monthlyBaseCents);
  const finalCents = lines.reduce((sum, { product, quantity }) => sum + lineTotalCents(product, level, quantity), 0);
  if (!Number.isSafeInteger(monthlyBaseCents) || !Number.isSafeInteger(finalCents)) throw new RangeError('Total demasiado grande');
  return { level, multiplier, baseCents, monthlyBaseCents, finalCents, monthlyFinalCents: finalCents * multiplier, savingsCents: baseCents - finalCents };
}
