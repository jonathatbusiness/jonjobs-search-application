# JonJobs – Search & Application

## Project purpose

JonJobs – Search & Application is a private personal job-search CRM.

Core flow:

Find jobs -> evaluate -> save -> apply -> track -> analyze results.

The application uses:

- Next.js App Router
- JavaScript
- React
- Tailwind CSS
- Supabase
- Vercel
- React Icons

Do not introduce additional frameworks, state-management libraries, UI libraries, ORMs, authentication providers, or dependencies unless they provide a clear technical benefit and are required by the task.

---

## Architecture

Keep responsibilities separated.

### Frontend

The frontend is responsible for:

- displaying jobs;
- filtering/searching stored jobs;
- Boolean Search Builder UI;
- job detail modal;
- application tracking;
- saved searches;
- automation settings;
- user interactions.

The frontend must NOT directly perform external job discovery.

### Backend

Use Next.js Route Handlers under:

src/app/api/

Backend responsibilities include:

- authentication;
- external job discovery;
- scheduled search execution;
- normalization;
- deduplication;
- database writes;
- sensitive operations.

### Database

Supabase is the persistent data layer.

Expected main entities:

- jobs
- applications
- search_profiles
- job_sources
- search_runs
- automation_settings

Do not collapse applications into a simple `applied` boolean on jobs.

An application has its own lifecycle and must remain a separate entity.

### Automation

Automated job discovery is executed server-side.

Expected flow:

Vercel Cron
-> /api/cron/search-jobs
-> check automation settings
-> active search profiles
-> job discovery
-> normalization
-> deduplication
-> Supabase

The global automation setting can disable all automated searches.

Individual search profiles may also be enabled or disabled independently.

Manual and automatic searches should share reusable search-profile logic whenever practical.

---

## Main routes

Expected application routes:

- /login
- /jobs
- /applications
- /search
- /settings

Do not expose route-group names such as `(auth)` or `(dashboard)` in URLs.

---

## Component organization

Prefer small focused components.

Main component areas:

src/components/layout/
src/components/jobs/
src/components/search/
src/components/applications/
src/components/settings/
src/components/ui/

Avoid building large monolithic page components.

Shared visual primitives belong in:

src/components/ui/

Shared application layout belongs in:

src/components/layout/

---

## Services

Database and domain access should not be scattered throughout UI components.

Prefer:

src/services/supabase/
src/services/jobs/
src/services/search/
src/services/applications/

UI components should call reusable services or server-side functions rather than duplicating query logic.

---

## Server and client boundaries

Default to Server Components when interactivity is not required.

Use `"use client"` only when necessary for:

- local interactive state;
- browser APIs;
- event handlers;
- interactive modals;
- forms requiring client behavior;
- interactive filters.

Do not mark an entire page or layout as a Client Component merely because one nested component requires client-side behavior.

Keep secrets and privileged Supabase operations server-side.

Never expose:

- service-role keys;
- CRON_SECRET;
- authentication secrets;
- private API keys.

Only variables explicitly intended for the browser may use the `NEXT_PUBLIC_` prefix.

---

## Next.js rules

Before making framework-specific changes, inspect the relevant current Next.js documentation available in the installed project when necessary.

Do not rely on outdated Pages Router patterns.

Use App Router conventions.

Prefer Route Handlers under:

src/app/api/**/route.js

Do not create a separate Express server.

Do not introduce custom server infrastructure unless explicitly requested.

---

## Styling

Use Tailwind CSS as the primary styling system.

Maintain the JonJobs visual identity:

- professional;
- clean;
- dashboard-oriented;
- visually related to JonJobs H2;
- deep blue / warm gold or ochre visual DNA;
- restrained use of color;
- responsive design;
- strong information hierarchy.

Do not copy the JonJobs H2 interface mechanically.

Adapt the identity to a professional job-search dashboard.

Use React Icons when an icon is useful.

Do not install another icon library.

Desktop and mobile behavior must both be considered.

Navigation should support a desktop header and mobile hamburger menu.

---

## Coding principles

Prefer:

- simple code;
- explicit naming;
- reusable components;
- small functions;
- early returns;
- clear data flow;
- minimal dependencies.

Avoid:

- premature abstraction;
- unnecessary custom hooks;
- excessive prop drilling;
- duplicated database queries;
- giant components;
- giant utility files;
- speculative features;
- implementing features not requested;
- rewriting unrelated working code.

Do not refactor unrelated code during a focused task.

Keep changes scoped to the requested feature.

---

## Data handling

Normalize external job data before persistence.

Different sources may use different field names, but the application should consume a consistent internal job model.

Preserve source metadata when useful for debugging.

Use database constraints and deterministic identifiers where practical to prevent duplicate jobs.

Deduplication must be designed to tolerate the same vacancy appearing through multiple sources.

Prefer the employer's direct application URL when available.

---

## Search architecture

Keep two concepts separate.

### Internal search

Search and filter jobs already stored in Supabase.

### Job discovery

Search external public sources for new vacancies.

These are not the same operation.

The Boolean Search Builder may help construct search profiles used by job discovery, but internal filtering must continue to work independently.

---

## Applications

Applications are separate records linked to jobs.

Expected lifecycle can include:

- applied
- screening
- interview
- case
- offer
- rejected
- withdrawn

Do not hard-code the UI in a way that prevents future lifecycle expansion.

---

## Testing and command discipline

This is a personal project. Optimize for correctness without wasting execution time or tokens.

### Do not run commands unnecessarily.

Do NOT automatically run:

- `npm run build`
- the development server
- full test suites
- repeated lint passes
- repeated dependency installs

after every small edit.

### Preferred validation

For a small isolated change:

1. inspect the affected files;
2. implement the change;
3. run targeted ESLint only if useful.

Example:

npx eslint src/components/jobs/JobCard.js

For several related modified files:

npx eslint src/components/jobs src/app/\(dashboard\)/jobs

### Full lint

Run the full lint command only when:

- changes span several areas;
- shared architecture changed;
- the user specifically requests validation;
- targeted validation is insufficient.

### Production build

Run `npm run build` only when materially justified, such as:

- routing changes;
- framework configuration changes;
- server/client boundary changes;
- API Route Handler changes with integration impact;
- dependency changes;
- major refactors;
- before a deployment-oriented final verification;
- when specifically requested.

Do not repeatedly run a successful build after trivial follow-up edits unless those edits can affect the build.

### Development server

Do not start `npm run dev` merely as routine verification.

Start it only when visual/runtime verification is necessary or explicitly requested.

Do not leave unnecessary long-running processes active.

### Dependencies

Before installing a package:

1. check whether the project already contains the capability;
2. prefer platform/browser/React/Next functionality;
3. install only if the dependency materially improves the solution.

Never run `npm install` simply to "make sure dependencies are installed" unless dependency state is actually a problem.

---

## Efficient agent workflow

Before editing:

1. read this AGENTS.md;
2. inspect only files relevant to the task;
3. understand existing patterns before creating new ones;
4. avoid scanning the entire repository unless required.

During implementation:

1. make cohesive changes;
2. avoid touching unrelated files;
3. reuse existing utilities/components;
4. avoid duplicate implementations.

After implementation:

1. inspect the diff;
2. validate only what is proportional to the change;
3. report what changed;
4. report validation actually performed;
5. explicitly mention anything not validated when relevant.

Do not repeatedly reopen files that were just read unless needed.

Do not generate large explanations of obvious code unless requested.

---

## Git discipline

Do not automatically commit, push, create branches, or open pull requests unless explicitly requested.

Before destructive Git operations, verify intent.

Never use destructive commands such as:

git reset --hard
git clean -fd
git push --force

unless explicitly requested and clearly necessary.

Do not modify or discard unrelated user changes.

---

## Environment files

`.env.example` contains variable names only.

Never write real credentials into:

- source files;
- documentation;
- AGENTS.md;
- committed environment files.

Local secrets belong in `.env.local`.

Expected environment variables will be documented as they are introduced.

---

## Scope discipline

Implement the requested task, not the imagined future product.

The architecture should permit future expansion, but do not build unused systems preemptively.

When several valid implementations exist, prefer the simplest solution that:

1. satisfies the current requirement;
2. preserves the agreed architecture;
3. is easy to maintain;
4. does not create avoidable future migration work.

