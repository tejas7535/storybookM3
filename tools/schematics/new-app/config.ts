export const getBuildConfigurations = (projectPath: string) => ({
  dev: {
    statsJson: true,
    optimization: true,
    outputHashing: 'none',
    sourceMap: true,
    extractCss: true,
    namedChunks: true,
    aot: true,
    extractLicenses: true,
    vendorChunk: true,
    buildOptimizer: true,
    fileReplacements: [
      {
        replace: `${projectPath}/src/environments/environment.ts`,
        with: `${projectPath}/src/environments/environment.dev.ts`
      }
    ],
    budgets: [
      {
        type: 'anyComponentStyle',
        maximumWarning: '6kb',
        maximumError: '10kb'
      }
    ]
  },
  qa: {
    statsJson: true,
    optimization: true,
    outputHashing: 'none',
    sourceMap: true,
    extractCss: true,
    namedChunks: true,
    aot: true,
    extractLicenses: true,
    vendorChunk: true,
    buildOptimizer: true,
    fileReplacements: [
      {
        replace: `${projectPath}/src/environments/environment.ts`,
        with: `${projectPath}/src/environments/environment.dev.ts`
      }
    ],
    budgets: [
      {
        type: 'initial',
        maximumWarning: '2mb',
        maximumError: '5mb'
      },
      {
        type: 'anyComponentStyle',
        maximumWarning: '6kb',
        maximumError: '10kb'
      }
    ]
  },
  prod: {
    fileReplacements: [
      {
        replace: `${projectPath}/src/environments/environment.ts`,
        with: `${projectPath}/src/environments/environment.prod.ts`
      }
    ],
    optimization: true,
    outputHashing: 'all',
    sourceMap: false,
    extractCss: true,
    namedChunks: false,
    aot: true,
    extractLicenses: true,
    vendorChunk: false,
    buildOptimizer: true,
    budgets: [
      {
        type: 'initial',
        maximumWarning: '2mb',
        maximumError: '5mb'
      },
      {
        type: 'anyComponentStyle',
        maximumWarning: '6kb',
        maximumError: '10kb'
      }
    ]
  },
  e2e: {
    optimization: true,
    outputHashing: 'none',
    sourceMap: false,
    extractCss: true,
    namedChunks: true,
    vendorChunk: false,
    buildOptimizer: true
  }
});

export const getServeConfigurations = (project: string) => ({
  e2e: {
    browserTarget: `${project}:build:e2e`
  },
  prod: {
    browserTarget: `${project}:build:prod`
  }
});

export const getE2eConfigurations = (project: string) => ({
  e2e: {
    devServerTarget: `${project}:serve:e2e`
  },
  prod: {
    devServerTarget: `${project}:serve:prod`
  }
});

export const getCypressReportConfiguration = (project: string) => ({
  reporter: 'junit',
  reporterOptions: {
    mochaFile: `../../dist/cypress/apps/${project}-e2e/junit/cypress-report.xml`,
    toConsole: false
  }
});

export const getTsLintRules = (name: string) => ({
  'directive-selector': [true, 'attribute', name, 'camelCase'],
  'component-selector': [true, 'element', name, 'kebab-case']
});
