import { PRODUCTS } from './catalog-data.mjs';
import { calculateQuote, lineTotalCents } from './pricing.mjs';

const shell = document.querySelector('#catalogo');
const grid = document.querySelector('#catalog-grid');
const search = document.querySelector('#product-search');
const category = document.querySelector('#product-category');
const count = document.querySelector('#catalog-count');
const more = document.querySelector('#catalog-more');
const frequency = document.querySelector('#frequency');
const status = document.querySelector('#simulator-status');
const result = document.querySelector('#simulator-result');
const money = cents => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cents / 100);
const quantityText = value => new Intl.NumberFormat('es-MX', { maximumFractionDigits: 1 }).format(value);
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const element = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
};

if (shell && grid && PRODUCTS.length) {
  shell.hidden = false;
  const byId = new Map(PRODUCTS.map(product => [product.id, product]));
  const cart = new Map();
  let visibleCount = 24;

  for (const name of [...new Set(PRODUCTS.map(product => product.category))].sort((a, b) => a.localeCompare(b, 'es'))) {
    const option = element('option', name);
    option.value = name;
    category.append(option);
  }

  function filteredProducts() {
    const term = normalize(search.value.trim());
    return PRODUCTS.filter(product =>
      (!category.value || product.category === category.value) &&
      (!term || normalize(product.name).includes(term))
    );
  }

  function renderCatalog() {
    const matches = filteredProducts();
    const fragment = document.createDocumentFragment();
    for (const product of matches.slice(0, visibleCount)) {
      const row = element('article', undefined, 'catalog-row');
      const information = element('div', undefined, 'catalog-row-info');
      information.append(
        element('span', product.category, 'catalog-category'),
        element('h3', product.name),
        element('p', `Precio 1: ${money(product.price1Cents)} / ${product.unit}`)
      );
      const label = element('label', 'Cantidad', 'catalog-quantity');
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.max = '999';
      input.step = product.unit === 'kg' ? '0.1' : '1';
      input.value = String(cart.get(product.id) || 0);
      input.dataset.productId = product.id;
      input.setAttribute('aria-label', `Cantidad de ${product.name} en ${product.unit}`);
      label.append(input);
      row.append(information, label);
      fragment.append(row);
    }
    if (!matches.length) fragment.append(element('p', 'No encontramos productos con esos filtros.', 'catalog-empty'));
    grid.replaceChildren(fragment);
    count.textContent = `Mostrando ${Math.min(visibleCount, matches.length)} de ${matches.length} productos`;
    more.hidden = matches.length <= visibleCount;
  }

  function renderQuote() {
    const lines = [...cart].map(([id, quantity]) => ({ product: byId.get(id), quantity }));
    result.replaceChildren();
    if (!lines.length) {
      status.textContent = 'Agrega productos para ver tu estimación.';
      return;
    }
    const quote = calculateQuote(lines, frequency.value);
    status.textContent = `Precio ${quote.level} estimado. Total de este carrito: ${money(quote.finalCents)}.`;
    result.append(
      element('h3', `Precio ${quote.level} estimado`),
      element('p', `Consumo mensual estimado a precio 1: ${money(quote.monthlyBaseCents)}`)
    );
    const metrics = element('div', undefined, 'quote-metrics');
    metrics.append(
      element('p', `Total del carrito: ${money(quote.finalCents)}`),
      element('p', `Ahorro frente al precio 1: ${money(quote.savingsCents)}`)
    );
    result.append(metrics, element('h4', 'Productos de esta simulación'));
    const list = element('ol', undefined, 'quote-lines');
    for (const { product, quantity } of lines) {
      const item = element('li');
      const information = element('div');
      information.append(
        element('strong', product.name),
        element('small', `${quantityText(quantity)} ${product.unit} × ${money(product[`price${quote.level}Cents`])} / ${product.unit}`)
      );
      item.append(information, element('span', money(lineTotalCents(product, quote.level, quantity))));
      list.append(item);
    }
    result.append(list);
  }

  grid.addEventListener('input', event => {
    const input = event.target.closest('input[data-product-id]');
    if (!input) return;
    const product = byId.get(input.dataset.productId);
    const quantity = input.value === '' ? 0 : Number(input.value);
    try {
      lineTotalCents(product, 1, quantity);
      if (quantity) cart.set(product.id, quantity);
      else cart.delete(product.id);
      renderQuote();
    } catch {
      result.replaceChildren();
      status.textContent = product.unit === 'kg'
        ? 'Usa cantidades de 0 a 999 kg, en pasos de 0.1 kg.'
        : 'Usa cantidades enteras de 0 a 999 piezas.';
    }
  });
  search.addEventListener('input', () => { visibleCount = 24; renderCatalog(); });
  category.addEventListener('change', () => { visibleCount = 24; renderCatalog(); });
  more.addEventListener('click', () => { visibleCount += 24; renderCatalog(); });
  frequency.addEventListener('change', renderQuote);
  renderCatalog();
  renderQuote();
}
