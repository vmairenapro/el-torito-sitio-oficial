# Sitio de Cremería y Carnes El Torito

Sitio hecho desde cero con HTML, CSS y JavaScript. La primera entrega incluye home, productos generales, sucursales y contacto. La consulta de cobertura y el simulador ya tienen reglas programadas, pero esperan datos reales para activarse.

## Ver el sitio en tu computadora

1. Instala Node.js si aún no lo tienes.
2. Abre una terminal en esta carpeta.
3. Ejecuta `npm run dev`.
4. Abre `http://127.0.0.1:4173` en tu navegador.
5. Ejecuta `npm test` para comprobar los umbrales de precios y cobertura.

El servidor local muestra las páginas estáticas. Las funciones de Cloudflare se prueban con `npx wrangler pages dev public` una vez que la clave de Geoapify y las coordenadas estén configuradas; no incluyas la clave en Git.

## Publicar con GitHub y Cloudflare Pages

El repositorio ya está inicializado en Git. Crea un repositorio **vacío** en tu cuenta personal de GitHub, sin README ni licencia generados por GitHub. Después ejecuta:

```powershell
git remote add origin https://github.com/TU_USUARIO/el-torito-sitio.git
git push -u origin main
```

En el panel de Cloudflare entra en **Workers & Pages → Create application → Pages → Connect to Git** y selecciona ese repositorio. Configura la rama de producción `main`, sin framework, deja vacío el comando de compilación y usa `public` como directorio de salida. Cloudflare publicará una URL `pages.dev`; cada nuevo `git push` a `main` actualizará esa versión. Para cambios posteriores, crea una rama `codex/nombre-del-cambio`, haz commits descriptivos y abre un pull request antes de unirla a `main`. Las otras ramas pueden generar vistas previas.

No se ha creado aún el repositorio remoto ni el proyecto de Cloudflare; este documento describe el paso que falta y no representa un despliegue realizado.

## Datos pendientes antes de activar funciones

- **Formulario:** crea un formulario en [FormSubmit.app](https://formsubmit.app/), verifica `vmairenapro@outlook.com` como destinatario y coloca su endpoint en `formEndpoint` de `public/assets/js/site-config.js`. Publica un aviso de privacidad aprobado en `public/aviso-de-privacidad.html` y solo entonces cambia `privacyApproved` a `true`. Haz un envío de prueba y confirma que llega al buzón. El límite gratuito publicado por el proveedor es de 50 envíos mensuales; comprueba su uso periódicamente.
- **Sucursales:** confirma nombre, dirección, horario y coordenadas de los seis puntos. Completa `public/assets/js/branches.mjs` y las fichas de `public/sucursales.html`. San Tomás permanece con `deliveryEnabled: false` hasta que reparto pueda salir de ahí. Añade la nueva sucursal cuando abra y su reparto esté activo.
- **Cobertura:** crea una clave en Geoapify. En Cloudflare Pages guárdala como secreto `GEOAPIFY_API_KEY` para producción y vista previa. Nunca la pongas en HTML, JS público, README o un commit. Comprueba resultados por código postal y dirección contra recorridos conocidos antes de enlazar `public/cobertura.html` desde el home y el menú.
- **Catálogo:** agrega solo productos y tres precios aprobados a `public/assets/js/catalog-data.mjs`, en **centavos**. El simulador aparecerá cuando haya productos cargados. Confirma presentaciones, disponibilidad y vigencia de precios.
- **WhatsApp:** actualmente enlaza al número proporcionado: `55 8826 6900`.

## Estructura

- `public/`: páginas y recursos estáticos que Cloudflare Pages servirá.
- `functions/api/coverage.js`: función de Cloudflare que protege la clave y consulta Geoapify.
- `public/assets/js/pricing.mjs` y `coverage-rules.mjs`: reglas compartidas y probadas.
- `tests/`: pruebas de umbrales y selección de ruta.
- `ASSETS.md`: origen y licencia de las imágenes.

La página actual es una **vista previa**. Las fotografías son ilustrativas y el formulario, la cobertura y los precios precisos no deben anunciarse como activos antes de completar los datos y pruebas indicados.
