export const getBuildConfigurations = (projectPath: string) => ({
  dev: {
    statsJson: true,
    optimization: true,
    outputHashing: 'none',
    sourceMap: true,
    namedChunks: true,
    aot: true,
    extractLicenses: true,
    vendorChunk: true,
    buildOptimizer: true,
    fileReplacements: [
      {
        replace: `${projectPath}/src/environments/environment.ts`,
        with: `${projectPath}/src/environments/environment.dev.ts`,
      },
    ],
    budgets: [
      {
        type: 'anyComponentStyle',
        maximumWarning: '6kb',
        maximumError: '10kb',
      },
    ],
  },
  qa: {
    statsJson: true,
    optimization: true,
    outputHashing: 'none',
    sourceMap: true,
    namedChunks: true,
    aot: true,
    extractLicenses: true,
    vendorChunk: true,
    buildOptimizer: true,
    fileReplacements: [
      {
        replace: `${projectPath}/src/environments/environment.ts`,
        with: `${projectPath}/src/environments/environment.qa.ts`,
      },
    ],
    budgets: [
      {
        type: 'initial',
        maximumWarning: '2mb',
        maximumError: '5mb',
      },
      {
        type: 'anyComponentStyle',
        maximumWarning: '6kb',
        maximumError: '10kb',
      },
    ],
  },
  production: {
    fileReplacements: [
      {
        replace: `${projectPath}/src/environments/environment.ts`,
        with: `${projectPath}/src/environments/environment.prod.ts`,
      },
    ],
    optimization: true,
    outputHashing: 'all',
    sourceMap: false,
    namedChunks: false,
    aot: true,
    extractLicenses: true,
    vendorChunk: false,
    buildOptimizer: true,
    budgets: [
      {
        type: 'initial',
        maximumWarning: '2mb',
        maximumError: '5mb',
      },
      {
        type: 'anyComponentStyle',
        maximumWarning: '6kb',
        maximumError: '10kb',
      },
    ],
  },
  e2e: {
    optimization: true,
    outputHashing: 'none',
    sourceMap: false,
    namedChunks: true,
    vendorChunk: false,
    buildOptimizer: true,
  },
});

export const getServeConfigurations = (project: string) => ({
  e2e: {
    browserTarget: `${project}:build:e2e`,
  },
  production: {
    browserTarget: `${project}:build:prod`,
  },
});

export const getE2eConfigurations = (project: string) => ({
  e2e: {
    devServerTarget: `${project}:serve:e2e`,
  },
  production: {
    devServerTarget: `${project}:serve:prod`,
  },
});

export const getStandardVersionConfigurations = (projectPath: string) => ({
  builder: `@nrwl/workspace:run-commands`,
  options: {
    command: 'npx standard-version --no-verify {args.params}',
    cwd: `${projectPath}`,
  },
});

export const getCypressReportConfiguration = (project: string) => ({
  reporter: 'junit',
  reporterOptions: {
    mochaFile: `../../dist/cypress/apps/${project}-e2e/junit/cypress-report.xml`,
    toConsole: false,
  },
});

export const getEsLintRules = (name: string) => ({
  '@angular-eslint/directive-selector': [
    'error',
    { type: 'attribute', prefix: name, style: 'camelCase' },
  ],
  '@angular-eslint/component-selector': [
    'error',
    { type: 'element', prefix: name, style: 'kebab-case' },
  ],
});
