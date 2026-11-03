import test from 'node:test';
import assert from 'node:assert/strict';
import { minimumForMeters, nearestReachableBranch } from '../public/assets/js/coverage-rules.mjs';

test('los límites de distancia usan kilómetros sin redondear', () => {
  assert.equal(minimumForMeters(5_000), 50_000);
  assert.equal(minimumForMeters(5_000.01), 100_000);
  assert.equal(minimumForMeters(10_000), 100_000);
  assert.equal(minimumForMeters(10_000.01), 250_000);
  assert.equal(minimumForMeters(15_000), 250_000);
  assert.equal(minimumForMeters(15_000.01), 450_000);
  assert.equal(minimumForMeters(20_000), 450_000);
  assert.equal(minimumForMeters(20_000.01), null);
});

test('se ignoran rutas que el proveedor no puede calcular', () => {
  const branches = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  assert.deepEqual(nearestReachableBranch(branches, [{ distance: 8000 }, { distance: null }, { distance: 4500 }]), { branch: branches[2], meters: 4500 });
});
