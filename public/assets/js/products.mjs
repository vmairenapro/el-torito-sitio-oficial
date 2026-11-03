import { PRODUCTS } from './catalog-data.mjs';
import { calculateQuote } from './pricing.mjs';

const shell = document.querySelector('#simulator');
const grid = document.querySelector('#catalog-grid');
const frequency = document.querySelector('#frequency');
const result = document.querySelector('#simulator-result');
const money = cents => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cents / 100);

if (shell && grid && PRODUCTS.length) {
  shell.hidden = false;
  document.querySelector('#catalog-notice')?.remove();
  for (const product of PRODUCTS) {
    const card = document.createElement('article');
    card.className = 'catalog-item';
    const title = document.createElement('h3');
    title.textContent = product.name;
    const details = document.createElement('p');
    details.textContent = `${product.unit} · Precio 1: ${money(product.price1Cents)}`;
    const label = document.createElement('label');
    label.textContent = 'Cantidad ';
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.max = '999';
    input.step = '1';
    input.value = '0';
    input.dataset.productId = product.id;
    label.append(input);
    card.append(title, details, label);
    grid.append(card);
  }
  function render() {
    const lines = [...grid.querySelectorAll('input')].map(input => ({ product: PRODUCTS.find(item => item.id === input.dataset.productId), quantity: Number(input.value) }));
    if (lines.some(line => !Number.isSafeInteger(line.quantity) || line.quantity < 0 || line.quantity > 999)) {
      result.textContent = 'Revisa las cantidades: usa números enteros entre 0 y 999.';
      return;
    }
    const quote = calculateQuote(lines, frequency.value);
    if (!quote.baseCents) { result.textContent = 'Agrega productos para ver tu estimación.'; return; }
    result.innerHTML = `<h3>Precio ${quote.level} estimado</h3><p>Consumo mensual estimado a precio 1: <strong>${money(quote.monthlyBaseCents)}</strong></p><p>Total de este carrito al precio ${quote.level}: <strong>${money(quote.finalCents)}</strong></p><p>Ahorro frente al precio 1 en este carrito: <strong>${money(quote.savingsCents)}</strong></p><small>Estimación para prospectos. El nivel y disponibilidad se confirman con ventas.</small>`;
  }
  grid.addEventListener('input', render);
  frequency.addEventListener('change', render);
  render();
}
