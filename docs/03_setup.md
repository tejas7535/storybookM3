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
             "production": {
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
   - Don't forget to add a `environment.dev.ts` as well as a `environment.prod.ts` to your environments in your app.
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
