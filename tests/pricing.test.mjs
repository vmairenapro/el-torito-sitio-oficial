import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateQuote, getPriceLevel, lineTotalCents, FREQUENCIES } from '../public/assets/js/pricing.mjs';

test('los niveles cambian exactamente en $4,000 y $5,000 mensuales', () => {
  assert.equal(getPriceLevel(399_999), 1);
  assert.equal(getPriceLevel(400_000), 2);
  assert.equal(getPriceLevel(499_999), 2);
  assert.equal(getPriceLevel(500_000), 3);
});

test('la frecuencia usa el mes comercial acordado', () => {
  assert.deepEqual(Object.values(FREQUENCIES), [30, 15, 10, 4, 2, 1]);
});

test('el nivel se fija con precio 1 antes de aplicar precios del nivel', () => {
  const product = { price1Cents: 100_000, price2Cents: 90_000, price3Cents: 80_000 };
  const quote = calculateQuote([{ product, quantity: 1 }], 'semanal');
  assert.equal(quote.monthlyBaseCents, 400_000);
  assert.equal(quote.level, 2);
  assert.equal(quote.finalCents, 90_000);
  assert.equal(quote.savingsCents, 10_000);
});

test('se pueden simular décimos de kilo, pero las piezas deben ser enteras', () => {
  const kilo = { unit: 'kg', price1Cents: 13333, price2Cents: 12000, price3Cents: 11000 };
  const pieza = { unit: 'pieza', price1Cents: 2500, price2Cents: 2300, price3Cents: 2100 };
  assert.equal(lineTotalCents(kilo, 1, 0.5), 6667);
  assert.equal(lineTotalCents(pieza, 1, 2), 5000);
  assert.throws(() => lineTotalCents(pieza, 1, 0.5), RangeError);
  assert.throws(() => lineTotalCents(kilo, 1, 0.55), RangeError);
});
