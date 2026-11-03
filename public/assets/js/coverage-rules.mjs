export const COVERAGE_TIERS = Object.freeze([
  { maxMeters: 5_000, minimumCents: 50_000 },
  { maxMeters: 10_000, minimumCents: 100_000 },
  { maxMeters: 15_000, minimumCents: 250_000 },
  { maxMeters: 20_000, minimumCents: 450_000 }
]);

export function minimumForMeters(meters) {
  if (!Number.isFinite(meters) || meters < 0) throw new RangeError('Distancia inválida');
  return COVERAGE_TIERS.find(tier => meters <= tier.maxMeters)?.minimumCents ?? null;
}

export function nearestReachableBranch(branches, routes) {
  if (!Array.isArray(branches) || !Array.isArray(routes) || branches.length !== routes.length) throw new TypeError('Matriz de rutas inválida');
  return routes.reduce((best, route, index) => {
    const meters = route?.distance;
    if (!Number.isFinite(meters) || meters < 0) return best;
    return !best || meters < best.meters ? { branch: branches[index], meters } : best;
  }, null);
}
