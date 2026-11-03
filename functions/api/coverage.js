import { BRANCHES } from '../../public/assets/js/branches.mjs';
import { minimumForMeters, nearestReachableBranch } from '../../public/assets/js/coverage-rules.mjs';

const response = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
const coordinatesValid = branch => Number.isFinite(branch.latitude) && Number.isFinite(branch.longitude);

export async function onRequestPost({ request, env }) {
  const branches = BRANCHES.filter(branch => branch.deliveryEnabled);
  if (!env.GEOAPIFY_API_KEY || !branches.length || branches.some(branch => !coordinatesValid(branch))) {
    return response({ code: 'NOT_READY', message: 'La consulta de cobertura aún no está disponible. Escríbenos para revisar tu zona.' }, 503);
  }
  let input;
  try { input = await request.json(); } catch { return response({ code: 'INVALID_REQUEST', message: 'Solicitud inválida.' }, 400); }
  const { type, value } = input || {};
  if (!['postalCode', 'address', 'point'].includes(type)) return response({ code: 'INVALID_TYPE', message: 'Selecciona código postal o dirección.' }, 400);
  let destination;
  let approximate = type === 'postalCode';
  let label;
  if (type === 'point') {
    if (!Number.isFinite(value?.latitude) || !Number.isFinite(value?.longitude) || value.latitude < 14 || value.latitude > 33 || value.longitude < -119 || value.longitude > -86) return response({ code: 'INVALID_POINT', message: 'Ubicación inválida.' }, 400);
    destination = [value.longitude, value.latitude];
    label = 'Punto confirmado por el visitante';
    approximate = true;
  } else {
    if (typeof value !== 'string' || value.length > 180) return response({ code: 'INVALID_LOCATION', message: 'Ubicación inválida.' }, 400);
    const query = value.trim();
    if (type === 'postalCode' && !/^\d{5}$/.test(query)) return response({ code: 'INVALID_POSTAL_CODE', message: 'Escribe un código postal de cinco dígitos.' }, 400);
    if (type === 'address' && query.length < 12) return response({ code: 'INVALID_ADDRESS', message: 'Escribe una dirección más completa.' }, 400);
    const geocodeUrl = new URL('https://api.geoapify.com/v1/geocode/search');
    geocodeUrl.searchParams.set('text', query);
    geocodeUrl.searchParams.set('filter', 'countrycode:mx');
    geocodeUrl.searchParams.set('format', 'json');
    geocodeUrl.searchParams.set('limit', '3');
    if (type === 'postalCode') geocodeUrl.searchParams.set('type', 'postcode');
    geocodeUrl.searchParams.set('apiKey', env.GEOAPIFY_API_KEY);
    try {
      const geocodeResponse = await fetch(geocodeUrl);
      if (!geocodeResponse.ok) throw new Error(`Geocode ${geocodeResponse.status}`);
      const data = await geocodeResponse.json();
      const match = data.results?.[0];
      if (!match || !Number.isFinite(match.lat) || !Number.isFinite(match.lon)) return response({ code: 'NOT_FOUND', message: 'No encontramos esa ubicación. Revisa los datos o escríbenos.' }, 404);
      destination = [match.lon, match.lat];
      label = match.formatted || query;
      if (type === 'address' && (match.rank?.confidence ?? 0) < 0.85) {
        return response({ code: 'CONFIRM_ADDRESS', message: 'La dirección no se identificó con suficiente precisión. Confirma el punto propuesto o consulta con ventas.', label, point: { latitude: match.lat, longitude: match.lon } }, 422);
      }
      if (type === 'address') approximate = match.result_type !== 'building' && match.result_type !== 'amenity';
    } catch {
      return response({ code: 'PROVIDER_ERROR', message: 'No pudimos consultar la ubicación en este momento. Intenta más tarde o escríbenos.' }, 502);
    }
  }
  try {
    const matrixResponse = await fetch(`https://api.geoapify.com/v1/routematrix?apiKey=${encodeURIComponent(env.GEOAPIFY_API_KEY)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'motorcycle', type: 'short', sources: branches.map(branch => ({ location: [branch.longitude, branch.latitude] })), targets: [{ location: destination }] })
    });
    if (!matrixResponse.ok) throw new Error(`Matrix ${matrixResponse.status}`);
    const matrix = await matrixResponse.json();
    const routes = matrix.sources_to_targets?.map(row => row?.[0]);
    if (!routes) throw new Error('Missing routes');
    const nearest = nearestReachableBranch(branches, routes);
    if (!nearest) return response({ code: 'NO_ROUTE', message: 'No encontramos una ruta disponible. Escríbenos para revisar la entrega.' }, 422);
    const minimumCents = minimumForMeters(nearest.meters);
    return response({ status: minimumCents === null ? 'review' : 'covered', approximate, label, branch: { id: nearest.branch.id, name: nearest.branch.name }, distanceMeters: nearest.meters, minimumCents });
  } catch {
    return response({ code: 'PROVIDER_ERROR', message: 'No pudimos calcular la ruta en este momento. Intenta más tarde o escríbenos.' }, 502);
  }
}
