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
   - Don't forget to add a `environment.dev.ts` as well as a `environment.production` to your environments in your app.
4. Add Deployment job
   - Add an entry to `deployments.json` for your app:
     ```json
         "my-app": "/my-group/my-app/master/"
     ```
   - The value represents the Jenkin Job URL that should be triggered
