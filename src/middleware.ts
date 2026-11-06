import { defineMiddleware } from 'astro:middleware';
import { localeFromPath } from './i18n/routing';
import { localizeHTML } from './i18n/html';
export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;
  const locale = localeFromPath(context.url.pathname);
  if (locale === 'zh-CN') return response;
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.set('content-language', locale);
  return new Response(localizeHTML(await response.text(), locale), { status: response.status, headers });
});
