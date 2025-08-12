You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- DO NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Common pitfalls

- Control flow (`@if`):
  - You cannot use `as` expressions in `@else if (...)`. E.g. invalid code: `@else if (bla(); as x)`.

## Common pitfalls

<!-- NX Workspace Best Practices -->

## NX Workspace Best Practices

- Prefer using Nx generators (`nx generate`) for creating libraries, applications, and components.
- Keep libraries focused on a single responsibility; avoid large, multipurpose libraries.
- Use tags in `project.json` to organize and enforce boundaries between apps and libs.
- Always use relative imports within a library, and use workspace aliases for cross-library imports.
- Use Nx affected commands (`nx affected:build`, `nx affected:test`) in CI pipelines for efficient builds and tests.
- Document each library’s public API in its README.
- Prefer using Nx executor for custom scripts and tasks.
- Keep `tsconfig.base.json` and workspace-wide configs clean and minimal.
- Use Nx linting and formatting tools (`nx lint`, `nx format:write`) before committing code.
- Avoid circular dependencies between libraries.
- Use Nx workspace generators for repetitive tasks (e.g., updating configs, scaffolding).

## Running tests

- use npx nx test command
