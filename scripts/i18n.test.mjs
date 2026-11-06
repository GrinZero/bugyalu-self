import { test } from 'node:test';
import assert from 'node:assert/strict';
import { localeFromPath, localizedPath, preferredLocale } from '../src/i18n/routing.ts';
test('browser detection respects the first supported preference', () => {
  assert.equal(preferredLocale(['fr', 'zh-TW', 'en']), 'zh-CN');
  assert.equal(preferredLocale(['en-US', 'zh-CN']), 'en');
  assert.equal(preferredLocale(['fr']), 'en');
  assert.equal(preferredLocale([]), 'en');
});
test('language routes preserve article slugs, queries, and fragments', () => {
  assert.equal(localizedPath('/writing/test/?q=mcp#example', 'en'), '/en/writing/test/?q=mcp#example');
  assert.equal(localizedPath('/en/writing/test/?q=mcp#example', 'zh-CN'), '/writing/test/?q=mcp#example');
  assert.equal(localizedPath('/en/', 'en'), '/en/');
  assert.equal(localizedPath('/', 'zh-CN'), '/');
  assert.equal(localeFromPath('/engineering/'), 'zh-CN');
});

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse, serialize } from 'parse5';
function files(directory) {
  return readdirSync(directory, {withFileTypes:true}).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : path.endsWith('.html') ? [path] : [];
  });
}
function nodes(document) {
  return [document, ...(document.childNodes || []).flatMap(nodes)];
}
function attr(node, name) { return node.attrs?.find(item => item.name === name)?.value; }
test('every English page preserves code and IDs and resolves its internal links', () => {
  assert.ok(existsSync('dist/en'), 'Run pnpm build before testing generated pages');
  for (const path of files('dist/en')) {
    const translated = nodes(parse(readFileSync(path, 'utf8')));
    const source = nodes(parse(readFileSync(path.replace('dist/en/', 'dist/'), 'utf8')));
    assert.equal(attr(translated.find(node => node.tagName === 'html'), 'lang'), 'en', path);
    assert.equal(attr(translated.find(node => attr(node, 'hreflang') === 'zh-CN'), 'href'), attr(source.find(node => attr(node, 'hreflang') === 'zh-CN'), 'href'), `${path}: Chinese alternate changed`);
    assert.deepEqual(translated.filter(n => n.tagName === 'code').map(serialize), source.filter(n => n.tagName === 'code').map(serialize), `${path}: code changed`);
    assert.deepEqual(translated.map(n => attr(n, 'id')).filter(Boolean), source.map(n => attr(n, 'id')).filter(Boolean), `${path}: anchors changed`);
    for (const node of translated.filter(n => n.tagName === 'a')) {
      const href = attr(node, 'href');
      if (!href?.startsWith('/') || href.startsWith('//')) continue;
      const pathname = new URL(href, 'https://example.test').pathname;
      assert.ok(existsSync(join('dist', pathname, 'index.html')) || existsSync(join('dist', pathname)), `${path}: broken link ${href}`);
      if (attr(node, 'data-language-link') === undefined && /^\/(about|projects|writing)(\/|$)/.test(href)) assert.fail(`${path}: unlocalized link ${href}`);
    }
  }
});
