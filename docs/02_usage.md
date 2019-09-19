## Usage

### Quick Start & Documentation

[Nx Documentation](https://nx.dev)

[30-minute video showing all Nx features](https://nx.dev/getting-started/what-is-nx)

[Interactive Tutorial](https://nx.dev/tutorial/01-create-application)

### Generate an application

Run `ng g @nrwl/angular:app my-app --unit-test-runner=jest --e2e-test-runner=cypress` to generate an application.

When using Nx, you can create multiple applications and libraries in the same workspace.

### Development server

Run `ng serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng g component my-component --project=my-app` to generate a new component.

### Build

Run `ng build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `npm run affected:test` to execute the unit tests affected by a change.

### Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `npm run affected:e2e` to execute the end-to-end tests affected by a change.

### Understand your workspace

Run `npm run dep-graph` to see a diagram of the dependencies of your projects.

### Lint & Formatting

Run `npm run lint-all` to lint all files.

Run `npm run prettier` to format all files.

### Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
