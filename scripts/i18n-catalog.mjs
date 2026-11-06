// Extract the exact rendered text, including MDX prose and accessible labels.
// Run after a build; translation is an explicit maintenance step, never a visitor request.
import { parse } from 'parse5';
import { readFile, writeFile, readdir } from 'node:fs/promises';
const strings = new Set();
const normalize = text => text.trim().replace(/\s+/g, ' ');
function add(text) { if (/\p{Script=Han}/u.test(text)) strings.add(normalize(text)); }
function visit(node, skip = false) {
  skip ||= ['script', 'style', 'pre', 'code'].includes(node.tagName) || node.attrs?.some(a => a.name === 'translate' && a.value === 'no');
  if (!skip) {
    if (node.nodeName === '#text') add(node.value);
    for (const attr of node.attrs || []) {
      if (['title', 'aria-label', 'placeholder', 'alt'].includes(attr.name) || node.tagName === 'meta' && attr.name === 'content' && node.attrs.some(a => a.name === 'name' && a.value === 'description')) add(attr.value);
    }
  }
  for (const child of node.childNodes || []) visit(child, skip);
}
async function walk(path) {
  for (const entry of await readdir(path, {withFileTypes: true})) {
    if (path === 'dist' && ['en', '_astro'].includes(entry.name)) continue;
    const file = `${path}/${entry.name}`;
    if (entry.isDirectory()) await walk(file);
    else if (entry.name.endsWith('.html')) visit(parse(await readFile(file, 'utf8')));
  }
}
await walk('dist');
const catalog = {...JSON.parse(await readFile('src/i18n/en.json', 'utf8')), ...JSON.parse(await readFile('src/i18n/en.overrides.json', 'utf8'))};
const missing = [...strings].filter(key => !catalog[key]);
if (!process.argv.includes('--check')) await writeFile('src/i18n/pending.json', JSON.stringify(missing, null, 2) + '\n');
console.log(`${strings.size} source strings; ${missing.length} missing English translations.`);
if (process.argv.includes('--check') && missing.length) process.exitCode = 1;
