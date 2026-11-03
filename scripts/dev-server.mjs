import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve('public');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpeg': 'image/jpeg', '.avif': 'image/avif' };
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  if (pathname.startsWith('/api/')) {
    response.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ code: 'LOCAL_PREVIEW', message: 'La consulta de cobertura necesita Cloudflare Pages Functions, la clave de Geoapify y coordenadas confirmadas.' }));
    return;
  }
  const path = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (path !== root && !path.startsWith(root + sep)) { response.writeHead(403); response.end(); return; }
  try {
    if (!(await stat(path)).isFile()) throw new Error('Not a file');
    response.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream' });
    response.end(await readFile(path));
  } catch { response.writeHead(404); response.end('No encontrado'); }
});
server.listen(4173, '127.0.0.1', () => console.log('Vista local: http://127.0.0.1:4173'));
