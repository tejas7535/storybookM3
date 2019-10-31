# Welcome to our Kitchen Sink App

This app demonstrates how a project within our repository should look like.
Feel free to use code snippets from here in your own application.

## Builds & Environments

It is necessary to add an `environment.dev.ts` to your application's environments folder in order to work with our CI pipeline.  
For _feature_ and _hotfix_ branches apps/libs are built with _dev_ configuration that **can** be deployed to your staging environment.  
For _master_ and _release_ branches apps/libs are built with _prod_ configuration that will be deployed to your qa/production environment.

## NPM scripts

_All commands need to be executed from the root folder of this repository._

## Run locally

```bash
    ng serve kitchen-sink
```

Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Test locally

### Unit tests

```bash
    ng test kitchen-sink
```

Run `npm run affected:test` to execute the unit tests affected by a change.

### E2E tests

```bash
    ng e2e kitchen-sink-e2e
```

Run `npm run affected:e2e` to execute the end-to-end tests affected by a change.

## Lint

### TSLint

```bash
    ng lint kitchen-sink
    ng lint kitchen-sink-e2e
```

### HTML Lint

```bash
    htmlhint apps/kitchen-sink/**/*.html
    htmlhint apps/kitchen-sink-e2e/**/*.html
```

### Stylelint

```bash
    stylelint apps/kitchen-sink/**/*.scss --config .stylelintrc
    htmlhint apps/kitchen-sink-e2e/**/*.scss --config .stylelintrc
```

## Format

```bash
    npm run prettier
```

## Build

```bash
    ng build kitchen-sink
```

The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Angular

All Angular CLI commands like `ng g component` or `ng g service` can be used as usual by adding `--project=kitchen-sink`.

## Dependency Graph

Run `npm run dep-graph` to see a diagram of the dependencies of your projects.
