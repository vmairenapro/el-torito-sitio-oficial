# Datos del catálogo

El catálogo público toma el **precio unitario** de las listas P1, P2 y P3 que Victor entregó y autorizó publicar el 3 de noviembre de 2026. Los PDF originales no se guardan en el repositorio porque también contienen datos administrativos y de contacto que no forman parte del catálogo. Las seis categorías suman 292 filas, pero ocho productos aparecen dos veces con los mismos precios; se muestran una sola vez, para un total de **284 productos únicos**.

| Categoría | Productos con P1, P2 y P3 |
| --- | ---: |
| Carnes | 61 |
| Embutidos | 38 |
| Congelados | 18 |
| Pescados | 6 |
| Abarrotes | 127 |
| Chiles y semillas | 34 |
| **Total publicado** | **284** |

Los PDF impresos indican fechas del 20, 22 y 29 de agosto de 2025 y advierten que los precios están sujetos a cambio. Victor confirmó que siguen vigentes y pueden mostrarse públicamente. Antes de actualizar precios en el futuro, se deben recibir y verificar de nuevo las tres listas de cada categoría.

## Validación realizada

- Cada producto de estas seis categorías coincide en nombre y unidad entre P1, P2 y P3.
- No hay claves duplicadas, productos repetidos ni importes negativos o en cero en el catálogo publicado.
- Para todos los productos, P1 ≥ P2 ≥ P3. Algunos precios son iguales entre niveles.
- Se usa la columna **P. UNIT.**, no **IMPORTE**. En una fila de salsa BBQ se cotizan dos piezas y el importe es el doble del precio unitario.
- Los importes de `public/assets/js/catalog-data.mjs` están en centavos de MXN. La unidad `KILOS` de los PDF se presenta como `kg`; `PIEZA` y `PZA` se presentan como `pieza`. Los nombres se conservan tal como aparecen, salvo el asterisco de formato que precede algunas descripciones.
- «Huevo blanco», listado en carnes y chiles y semillas en los PDF, se muestra una sola vez bajo abarrotes para facilitar la búsqueda.

## Lácteos pendientes

Los archivos llamados `P1 Lacteos.pdf` y `P2 Lacteos.pdf` contienen productos de **abarrotes**, no de lácteos. `P3 Lacteos.pdf` sí contiene 62 productos de lácteos. Victor indicó que no tiene los dos archivos correctos por ahora. Por eso lácteos no aparece en el catálogo de precios ni participa en la simulación. Se mantiene el enlace para consultarlos con ventas.

## Cómo funciona la simulación

El catálogo muestra P1. El visitante agrega cantidades y elige una frecuencia. La compra estimada a P1 se multiplica por 30, 15, 10, 4, 2 o 1 según la frecuencia. Bajo $4,000 mensuales aplica P1; desde $4,000 y antes de $5,000, P2; desde $5,000, P3. Después se calcula el carrito con el precio de ese nivel y se muestra el ahorro frente a P1. Es una estimación para prospectos, sujeta a confirmación por ventas.
