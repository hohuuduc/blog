---
title: "Project Architecture"
description: "Detailed architecture of the Astro + Angular blog."
order: 2
---

## Data Flow

Markdown files live in `src/content/pages`. During build, Astro automatically converts them into static routes based on the slug.

### Navigation Structure

- The main navigation is generated from the `navGroup` metadata in each post.
- The left sidebar lists all pages by `order` for quick access.
- The "On this page" section is built from headings in markdown.

## Angular Integration

Angular powers interactive components like the navigation bar, sidebar, table of contents, and the Settings dialog.
