import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateQuote, getPriceLevel, FREQUENCIES } from '../public/assets/js/pricing.mjs';

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
