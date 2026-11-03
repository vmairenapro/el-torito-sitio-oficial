(() => {
  const form = document.querySelector('#coverage-form');
  if (!form) return;
  const status = document.querySelector('#coverage-status');
  const result = document.querySelector('#coverage-result');
  const input = document.querySelector('#location-value');
  const type = document.querySelector('#location-type');
  const submit = form.querySelector('button[type=submit]');
  const money = cents => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cents / 100);
  type.addEventListener('change', () => {
    input.value = '';
    input.placeholder = type.value === 'postalCode' ? 'Ej. 03100' : 'Calle, número, colonia, alcaldía y ciudad';
    input.inputMode = type.value === 'postalCode' ? 'numeric' : 'text';
    input.maxLength = type.value === 'postalCode' ? 5 : 180;
    result.hidden = true;
    status.textContent = '';
  });
  async function lookup(payload) {
    submit.disabled = true;
    status.textContent = 'Consultando recorrido…';
    result.hidden = true;
    try {
      const response = await fetch('/api/coverage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (data.code === 'CONFIRM_ADDRESS') {
        status.textContent = data.message;
        result.replaceChildren();
        const name = document.createElement('p');
        name.textContent = data.label;
        const confirm = document.createElement('button');
        confirm.type = 'button';
        confirm.className = 'button button-primary';
        confirm.textContent = 'Confirmar este punto aproximado';
        confirm.addEventListener('click', () => lookup({ type: 'point', value: data.point }));
        result.append(name, confirm);
        result.hidden = false;
        return;
      }
      if (!response.ok) { status.textContent = data.message || 'No se pudo consultar la cobertura.'; return; }
      status.textContent = '';
      result.replaceChildren();
      const heading = document.createElement('strong');
      heading.textContent = data.status === 'covered' ? `Mínimo estimado: ${money(data.minimumCents)}` : 'La entrega requiere revisión comercial';
      const route = document.createElement('p');
      route.textContent = `${(data.distanceMeters / 1000).toFixed(1)} km de recorrido desde ${data.branch.name}.`;
      const note = document.createElement('p');
      note.textContent = data.approximate ? 'Ubicación aproximada: el mínimo final puede cambiar con el punto exacto de entrega.' : 'Estimación de recorrido; confirma disponibilidad y mínimo final con ventas.';
      result.append(heading, route, note);
      if (data.status === 'review') {
        const link = document.createElement('a');
        link.className = 'button button-primary';
        link.href = 'https://wa.me/525588266900';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Consultar con ventas';
        result.append(link);
      }
      result.hidden = false;
    } catch {
      status.textContent = 'No se pudo consultar la cobertura. Intenta más tarde o escríbenos.';
    } finally { submit.disabled = false; }
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    lookup({ type: type.value, value: input.value.trim() });
  });
})();
