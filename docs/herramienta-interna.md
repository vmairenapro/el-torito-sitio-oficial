# Calculadora futura para ventas

La herramienta de costos será un área **autenticada**. No publicar combustible, costos de vehículo, márgenes ni datos de pedidos en `public/` o en el repositorio abierto.

## Entradas por vehículo

- Motocicleta: gasolina, km/l real, desgaste por km, tiempo y costo de repartidor.
- Camioneta: diésel, km/l real, desgaste por km, tiempo y costo de conductor.
- Por pedido: sucursal de salida, destino confirmado, distancia de ida y regreso, casetas verificadas, otros costos, margen bruto estimado de la mezcla de productos y margen neto objetivo.

## Cálculo previsto

`combustible = (kilómetros ida + kilómetros regreso) / km por litro × precio por litro`

`costo entrega = combustible + desgaste por km × kilómetros totales + personal + casetas + otros costos`

Si la mezcla de productos tiene margen bruto `g` y el objetivo de margen neto es `m`, el pedido mínimo sugerido será `costo entrega / (g - m)`, siempre que `g > m`. Se redondeará hacia arriba a una unidad comercial definida por ventas. Si `g ≤ m`, se mostrará que la operación no alcanza el margen objetivo con los supuestos actuales. Ningún valor de combustible, peajes o margen se inventará para publicar una cotización.

La ruta de motocicleta y la de camioneta se calcularán por separado. Las tarifas de peaje se capturarán manualmente o desde una fuente validada; una API de rutas no equivale automáticamente a una fuente de tarifas. Fuera de 20 km, la herramienta sugerirá un mínimo para revisión comercial y el sitio público dirigirá a ventas.
