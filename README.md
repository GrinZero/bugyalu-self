# bugyalu-self

Personal site starter built with Astro, MDX, Tailwind CSS, React Islands, Motion, GSAP, giscus, and Vercel.

## Local development

```bash
pnpm install
pnpm dev
```

Open <http://localhost:4321>.

## Publish an article

Create a `.md` or `.mdx` file in `src/content/posts/` with this frontmatter:

```md
---
title: "Article title"
description: "Short summary"
pubDate: 2026-09-19
tags: ["topic"]
---
```

Update the English catalog as described below, then commit and push. Vercel can build and deploy the production branch automatically.

## Enable comments

1. Create a public GitHub repository with Discussions enabled.
2. Configure the repository and category at <https://giscus.app>.
3. Copy `.env.example` to `.env` and fill in the four giscus values.
4. Restart the dev server.

The comment component is intentionally isolated in `src/components/Comments.astro`, so it can later be replaced with a Supabase-backed likes, views, or comment system without changing article pages.

## Next additions

- `src/components/` is the place for interactive React Islands.
- Use Motion for small React interactions and GSAP for longer scroll timelines.
- Add Supabase for persistent article views and likes.
- Add a newsletter provider such as Buttondown when the subscription form is ready.

## Languages

The original Chinese routes stay at `/`; English pages live under `/en/`.
On an unprefixed URL, the first supported browser language is used (English is
the fallback). A manual choice is remembered in local storage. Explicit English
URLs keep their language when shared; `?lang=zh-CN` explicitly opens Chinese.
The menu also offers Auto to clear the saved preference. Language changes retain
search/filter parameters and fragments. With JavaScript disabled, both languages
remain accessible through ordinary links.

All pages share the original Astro/MDX sources. Middleware translates rendered
prose, metadata, and accessible labels from a local catalog during prerendering;
it preserves code blocks, inline code, identifiers, and heading anchors. Internal
links stay in the selected language. Search includes both the source text and the
rendered English text. Both languages share the same giscus discussion.

English body translations are machine-generated drafts; important UI copy is
curated in `src/i18n/en.overrides.json`. Edit that file to review translations
without having a future generation pass overwrite them. No translation service
is called by visitors or by the production build.

After adding or editing Chinese content:

```bash
pnpm i18n:extract
# Review src/i18n/pending.json and add translations to src/i18n/en.overrides.json,
# or optionally seed missing translations (sends pending public text to Google):
python3 scripts/i18n-translate.py
pnpm build
pnpm test:i18n
```

The build checks every rendered Chinese page for missing catalog entries and
fails if a translation is missing. This prevents new content from silently
shipping only in Chinese. The optional translation script requires Python 3 and curl,
network access, and availability of Google's public translation endpoint; normal
builds are offline with respect to translation and do not need Python.
