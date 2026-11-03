// Confirma coordenadas y direcciones con la empresa antes de activar cobertura.
// Geoapify usa longitud, latitud en sus solicitudes; aquí se guardan por nombre.
export const BRANCHES = Object.freeze([
  { id: 'san-pedro', name: 'San Pedro de los Pinos', address: '', latitude: null, longitude: null, deliveryEnabled: true },
  { id: 'escandon', name: 'Colonia Escandón', address: '', latitude: null, longitude: null, deliveryEnabled: true },
  { id: 'narvarte', name: 'Colonia Narvarte', address: '', latitude: null, longitude: null, deliveryEnabled: true },
  { id: 'santa-ursula', name: 'Santa Úrsula Coapa', address: '', latitude: null, longitude: null, deliveryEnabled: true },
  { id: 'aztecas', name: 'Av. Aztecas', address: '', latitude: null, longitude: null, deliveryEnabled: true },
  { id: 'san-tomas', name: 'San Tomás', address: '', latitude: null, longitude: null, deliveryEnabled: false }
]);
