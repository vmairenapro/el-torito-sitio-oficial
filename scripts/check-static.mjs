import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve('public');
const files = (await readdir(root)).filter(name => name.endsWith('.html'));
const problems = [];
for (const file of files) {
  const html = await readFile(join(root, file), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  for (const id of ids) if (ids.filter(value => value === id).length > 1) problems.push(`${file}: ID duplicado ${id}`);
  for (const match of html.matchAll(/\b(?:href|src)="(\/[^"]+)"/g)) {
    const target = match[1].split('#')[0].split('?')[0];
    if (!target || target.startsWith('/api/')) continue;
    const path = resolve(root, `.${target === '/' ? '/index.html' : target}`);
    try { if (!(await stat(path)).isFile()) problems.push(`${file}: falta ${target}`); }
    catch { problems.push(`${file}: falta ${target}`); }
  }
  if (!html.includes('lang="es-MX"')) problems.push(`${file}: falta lang es-MX`);
  if (!html.includes('id="contenido"')) problems.push(`${file}: falta contenido principal`);
}
if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; }
else console.log(`${files.length} páginas: enlaces y recursos locales correctos.`);
