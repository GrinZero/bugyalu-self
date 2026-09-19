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

Then commit and push. Vercel can build and deploy the production branch automatically.

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
