# Repository Guidelines

## Project Structure & Module Organization
- Next.js 16 App Router lives in `app/`, with `layout.tsx` applying global providers and `page.tsx` holding the landing UI; shared styles stay in `app/globals.css`.
- Static assets (logos, Open Graph images, favicons) belong in `public/`; reference them with `/asset-name.ext` for automatic serving.
- Root-level configs (`next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `tsconfig.json`) define routing, linting, Tailwind/PostCSS, and strict TypeScript (`strict: true` and the `@/*` alias).

## Build, Test, and Development Commands
- `npm install` – sync dependencies after cloning or when `package.json` changes.
- `npm run dev` – start the local dev server at http://localhost:3000 with HMR for rapid iteration.
- `npm run build` – create an optimized production bundle; run before previews to catch type and route errors.
- `npm run start` – serve the `.next` output locally to validate production behavior.
- `npm run lint` – execute ESLint using `eslint-config-next`; keep the workspace clean before pushing.

## Coding Style & Naming Conventions
- Write modern TypeScript/React components with 2-space indentation, single quotes in TS/JS, and Tailwind utility classes (in `globals.css`) for layout.
- Favor server components by default; switch to `"use client"` only when a hook or browser API is required.
- Name components with `PascalCase` (`HeroSection.tsx`), hooks/utilities with `camelCase`, and route segments with descriptive `kebab-case` folders inside `app/`.
- Use the `@/*` alias (`import Button from '@/components/Button'`) rather than fragile relative paths.

## Testing Guidelines
- No test runner is wired up yet (no `npm test` script), so manual verification via `npm run dev` plus browser checks is required until the first suite lands.
- When adding tests, colocate `*.test.tsx` or `*.spec.ts` files beside the component and favor React Testing Library or Playwright depending on scope.
- Target >80% coverage for new features and document any intentional gaps in the PR description.

## Commit & Pull Request Guidelines
- History currently shows concise, sentence-case commits (e.g., `Initial commit from Create Next App`); continue with imperative, scope-first subjects (`Add footer CTA`, `Fix hero spacing`).
- Group related changes per commit, reference issues in the body (`Refs #123`), and push with a clean lint build.
- Pull requests should include: a summary of changes, linked issues, UI screenshots when relevant, notes on tests/manual QA, and any migration or env steps.
- Request review once CI/lint pass locally; respond to feedback with follow-up commits rather than force-pushing unless rebasing is required.
