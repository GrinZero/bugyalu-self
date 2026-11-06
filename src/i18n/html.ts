import { parse, serialize, type DefaultTreeAdapterMap } from 'parse5';
import english from './en.json';
import overrides from './en.overrides.json';
import { localizedPath, type Locale } from './routing';
const catalog: Record<string, string> = {...english, ...overrides};
const han = /\p{Script=Han}/u;
export const normalize = (text: string) => text.trim().replace(/\s+/g, ' ');
export function translate(text: string, locale: Locale) {
  if (locale === 'zh-CN' || !han.test(text)) return text;
  const key = normalize(text);
  const value = catalog[key];
  return value ? text.replace(text.trim(), () => value) : text;
}
type Node = DefaultTreeAdapterMap['node'];
export function localizeHTML(html: string, locale: Locale, collect?: Set<string>) {
  const document = parse(html);
  const visit = (node: Node, skip = false) => {
    if ('tagName' in node) {
      skip ||= ['script', 'style', 'pre', 'code'].includes(node.tagName) || node.attrs.some(a => a.name === 'translate' && a.value === 'no');
      if (node.tagName === 'html') node.attrs.find(a => a.name === 'lang')!.value = locale;
      if (!skip) for (const attr of node.attrs) {
        if (['title', 'aria-label', 'placeholder', 'alt'].includes(attr.name) || node.tagName === 'meta' && attr.name === 'content' && node.attrs.some(a => a.name === 'name' && a.value === 'description')) {
          if (han.test(attr.value)) collect?.add(normalize(attr.value));
          attr.value = translate(attr.value, locale);
        }
        if (node.tagName === 'a' && attr.name === 'href' && /^\/(?:$|about(?:\/|$)|writing(?:\/|$)|projects(?:\/|$))/.test(attr.value) && !node.attrs.some(a => a.name === 'data-language-link')) attr.value = localizedPath(attr.value, locale);
      }
    }
    if (node.nodeName === '#text' && 'value' in node && !skip) {
      if (han.test(node.value)) collect?.add(normalize(node.value));
      node.value = translate(node.value, locale);
    }
    if ('childNodes' in node) node.childNodes.forEach(child => visit(child, skip));
    if ('attrs' in node) {
      const search = node.attrs.find(attr => attr.name === 'data-search');
      if (search) {
        const textContent = (item: Node): string => 'value' in item ? item.value : 'childNodes' in item ? item.childNodes.map(textContent).join(' ') : '';
        search.value = `${search.value} ${textContent(node)}`.toLocaleLowerCase();
      }
    }
  };
  visit(document);
  return serialize(document);
}
