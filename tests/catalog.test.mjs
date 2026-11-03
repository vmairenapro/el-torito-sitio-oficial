import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS } from '../public/assets/js/catalog-data.mjs';

test('el catálogo contiene 284 productos únicos con tres precios completos', () => {
  const counts = Object.fromEntries([...new Set(PRODUCTS.map(product => product.category))].map(category => [category, PRODUCTS.filter(product => product.category === category).length]));
  assert.deepEqual(counts, {
    Carnes: 61,
    Embutidos: 38,
    Congelados: 18,
    Pescados: 6,
    Abarrotes: 127,
    'Chiles y Semillas': 34
  });
  assert.equal(new Set(PRODUCTS.map(product => product.id)).size, PRODUCTS.length);
  assert.equal(new Set(PRODUCTS.map(product => `${product.name.toLowerCase()}|${product.unit}`)).size, PRODUCTS.length);
  for (const product of PRODUCTS) {
    assert.ok(product.name && ['kg', 'pieza'].includes(product.unit));
    assert.ok(Number.isSafeInteger(product.price1Cents));
    assert.ok(product.price1Cents >= product.price2Cents);
    assert.ok(product.price2Cents >= product.price3Cents);
    assert.ok(product.price3Cents > 0);
  }
});
