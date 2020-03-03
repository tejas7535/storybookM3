# Frontend@Schaeffler

![version](https://img.shields.io/badge/version-v0.2.0-green.svg)
![@angular/core: 9.0.2](https://img.shields.io/badge/%40angular%2Fcore-9.0.2-brightgreen)
![@ngrx/store: 8.6.0](https://img.shields.io/badge/%40ngrx%2Fstore-8.6.0-brightgreen)
![@angular/material: 9.0.1](https://img.shields.io/badge/%40angular%2Fmaterial-9.0.1-brightgreen)
![@angular/flex-layout: 9.0.0-beta.29](https://img.shields.io/badge/%40angular%2Fflex--layout-9.0.0--beta.29-brightgreen)
![prettier: 1.18.2](https://img.shields.io/badge/prettier-1.18.2-brightgreen)
![commitizen: 4.0.3](https://img.shields.io/badge/commitizen-4.0.3-brightgreen)

Monorepository based on [Nx](https://nx.dev) to support and improve the development of modern web applications.

- [Usage](#usage)
  - [Demo Application](#demo-application)
  - [NX Quick Start & Documentation](#nx-quick-start-&-documentation)
- [Project Setup](#project-setup)
- [Contribution and Terms of Admission](#contribution-and-terms-of-admission)
- [Changelog](#changelog)
- [References](#references)
  - [Update Strategy](#update-strategy)
  - [Exit Strategy](#exit-strategy)
  - [Further Documentation](#further-documentation)
- [Contributors](#contributors)

## Usage

### Demo Application

✨ **Please checkout our [kitchen sink app](./apps/kitchen-sink/README.md) to get started.** ✨

### NX Quick Start & Documentation

[Nx Documentation](https://nx.dev)

[30-minute video showing all Nx features](https://nx.dev/getting-started/what-is-nx)

[Interactive Tutorial](https://nx.dev/tutorial/01-create-application)

## Project Setup

1. Create a new application
   - Run `ng g @nrwl/angular:app my-app`
2. Define Responsibilites
   - Open `CODEOWNERS` and add entries for `my-app`:
     ```bash
         # my-app
         apps/my-app @myname
         apps/my-app @myname
     ```
   - `@myname` represents a gitlab username
   - Codeowners are responsible for reviewing merge requests in your app
3. App Configuration
   - Edit `angular.json` and make sure to have the following configurations:
     ```json
         "configurations": {
             "dev": {
                 "statsJson": true,
                 "optimization": true,
                 "outputHashing": "none",
                 "sourceMap": true,
                 "extractCss": true,
                 "namedChunks": true,
                 "aot": true,
                 "extractLicenses": true,
                 "vendorChunk": true,
                 "buildOptimizer": true,
                 "fileReplacements": [
                     {
                     "replace": "apps/my-app/src/environments/environment.ts",
                     "with": "apps/my-app/src/environments/environment.dev.ts"
                     }
                 ]
             },
             "qa": {
                 "statsJson": true,
                 "optimization": true,
                 "outputHashing": "none",
                 "sourceMap": true,
                 "extractCss": true,
                 "namedChunks": true,
                 "aot": true,
                 "extractLicenses": true,
                 "vendorChunk": true,
                 "buildOptimizer": true,
                 "fileReplacements": [
                     {
                     "replace": "apps/my-app/src/environments/environment.ts",
                     "with": "apps/my-app/src/environments/environment.dev.ts"
                     }
                 ]
             },
             "prod": {
                 "fileReplacements": [
                     {
                     "replace": "apps/my-app/src/environments/environment.ts",
                     "with": "apps/my-app/src/environments/environment.prod.ts"
                     }
                 ],
                 "optimization": true,
                 "outputHashing": "all",
                 "sourceMap": false,
                 "extractCss": true,
                 "namedChunks": false,
                 "aot": true,
                 "extractLicenses": true,
                 "vendorChunk": false,
                 "buildOptimizer": true,
                 "budgets": [
                     {
                     "type": "initial",
                     "maximumWarning": "2mb",
                     "maximumError": "5mb"
                     },
                     {
                     "type": "anyComponentStyle",
                     "maximumWarning": "6kb",
                     "maximumError": "10kb"
                     }
                 ]
             }
         }
     ```
   - In order to integrate your app in the workspace, it is mandatory to support the configurations `dev`, `qa` and `prod`.
   - Don't forget to add a `environment.dev.ts` as well as a `environment.prod.ts` or if needed a `environment.qa.ts` to your environments in your app.
4. Add Deployment job
   - Add an entry to `deployments.json` for your app:
     ```json
         "my-app": "/my-group/my-app/master/"
     ```
   - The value represents the Jenkin Job URL that should be triggered
5. Import shared styles by editing `angular.json`:
   - Add `"node_modules/schaeffler-icons/style.css"` to the `styles` array
   - Add the following to the `options` entry:
     ```json
        "stylePreprocessorOptions": {
            "includePaths": ["libs/shared/styles/src"]
        }
     ```
6. Further adaptions:
   - Use `ng-bullet` configuration within your auto-generated .spec files
   - Fix lint errors yielded by the autogeneration of your app
   - Add `@import 'libs/shared/styles/src';` to your app's `styles.scss`
   - Add `@import 'https://fonts.googleapis.com/icon?family=Material+Icons';` to your app's `styles.scss` to support Material Icons
   - Add the following to the configuation of your `cypress.json` within your `my-app-e2e` folder:
     ```json
        "reporter": "junit",
        "reporterOptions": {
            "mochaFile": "../../dist/cypress/apps/my-app-e2e/junit/cypress-report.xml",
            "toConsole": false
        }
     ```

## Contribution and Terms of Admission

Check out our [contribution guidelines](CONTRIBUTING.md) as well as our [code of conduct](CODE_OF_CONDUCT.md) if you are interested in participating.
If you want to start a new project or integrate an existing one in our repository please read our [terms of admission](https://confluence.schaeffler.com/display/FRON/Terms+of+Admission) carefully.

## Changelog

An overview of the releases including the related changes can be found in our [changelog](CHANGELOG.md).

## References

### Update Strategy

[Update Strategy](https://confluence.schaeffler.com/display/FRON/Update+Strategy) in `Frontend@Schaeffler` Documentation Space.

### Exit Strategy

[Exit Strategy](https://confluence.schaeffler.com/display/FRON/Exit+Strategy) in `Frontend@Schaeffler` Documentation Space.

### Further Documentation

For further Documentation, please see our [Frontend@Schaeffler Documentation Space](https://confluence.schaeffler.com/display/FRON).
If you are missing any content, don't hesitate to contact us in our [Teams Channel](https://teams.microsoft.com/l/team/19%3a2967d889ec6546729254b14c7f06c2b8%40thread.skype/conversations?groupId=a8039948-cbd2-4239-ba69-edbeefadeea2&tenantId=67416604-6509-4014-9859-45e709f53d3f).

## Contributors

Made with ❤️ by

- [Fabian Kaupp](https://gitlab.schaeffler.com/kauppfbi) 🎮
- [Robert Krause](https://gitlab.schaeffler.com/krausrbe) 🎣
- [Christian Berndt](https://gitlab.schaeffler.com/berndcri) 👇
- [Stefan Herpich](https://gitlab.schaeffler.com/herpisef) 🚴

