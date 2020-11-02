# oAuth2 Library for Authentication with AAD

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test shared-auth` to execute the unit tests.

## How to use

This library can be used to authenticate users with Azure AD. It supports the prefered `code flow` as well as the deprecated `implicit flow`.


### Prequisites

This lib depends on a few node modules`, which can be installed with npm:

`npm i angular-oauth2-oidc angular-oauth2-oidc-jwks jwt-decode`

### Azure AD

Go to your `app registration` -> `Authentication` and `Add a platform`.  
Choose `Single Page Application` for `Code Flow` (recommended) or `Web` for `Implicit Flow`.  
Either way, you need to add the following redirect URIs to it:  
- localhost:4200 (for local development)
- https://<your-domain>(for your environment)
- localhost:4200/silent-refresh.html (needed for `implicit flow`, but also required to set for `code flow`)
- https://<your-domain>/silent-refresh.html (needed for `implicit flow`, but also required to set for `code flow`)

#### `CODE FLOW` (Recommended Approach):

- Get the `client id`, `tenant id` as well as the `app id` of your application in Azure and set them in your `environment` files:
  ```js
    export const environment = {
        production: false,
        tenantId: 'XXX',
        clientId: 'XXX',
        appId: 'api://XXX/YYY',
        loginUrl: 'https://login.xxx.xx/', // only required if you use another azure tenant
        redirectUrl: '/callback-example' // only required if the redirect url should not be root
    };

  ```
- Import this auth module into your `app.module.ts`:   
  ```js
    import { HttpClientModule } from '@angular/common/http';
    import { RouterModule } from '@angular/router';


    import { StoreModule } from '@ngrx/store';
    import { EffectsModule } from '@ngrx/effects';

    import { AzureConfig, FlowType, SharedAuthModule } from '@schaeffler/auth';

    import { environment } from '../environments/environment';

    const azureConfig = new AzureConfig(
        environment.tenantId,
        environment.clientId,
        environment.appId,
        FlowType.CODE_FLOW,
        !environment.production,
        environment.loginUrl,
        environment.redirectUrl
    );

    @NgModule({
        imports: [
            ...
            RouterModule.forRoot([], {
              initialNavigation: false,
            }),
            HttpClientModule,
            SharedAuthModule.forRoot(azureConfig),
            StoreModule.forRoot({}),
            EffectsModule.forRoot(),
        ],
        providers: [...],
        bootstrap: [AppComponent]
    })
    export class AppModule {}
  ```

### Implementation

* Use the `startLoginFlow` action in your application for login, e.g.:
   ```js
      public constructor(private readonly store: Store){}

      public ngOnInit(): void {
            this.store.dispatch(startLoginFlow());
      }
   ```
* Use the `logout` action to logout the user:
    ```js
      this.store.dispatch(logout());
    ```
* Use the provided selectors to get relevant user information in your app, for example:
    ```js
      this.username$ = this.store.pipe(select(getUsername));
      this.isLoggedIn$ = this.store.pipe(select(getIsLoggedIn));
      this.token$ = this.store.pipe(select(getToken));
      this.claim$ = this.store.pipe(select(getClaim('myClaim')));
      this.roles$ = this.store.pipe(select(getRoles));
    ```

#### `IMPLICIT FLOW` (*DEPRECATED*)

If you want (for whatever reason) still want to use the old implicit follow do the following:  

- Perform the same steps as described in the section of `code flow` above but replace `FlowType.CODE_FLOW` with `FlowType.IMPLICIT_FLOW`

- Create a file called `silent-refresh.html` and put it in the `src` folder of your app with the following content:
  ```html
    <html>
      <body>
        <script>
          var checks = [
            /[\?|&|#]code=/,
            /[\?|&|#]error=/,
            /[\?|&|#]token=/,
            /[\?|&|#]id_token=/,
          ];

          function isResponse(str) {
            var count = 0;
            if (!str) return false;
            for (var i = 0; i < checks.length; i++) {
              if (str.match(checks[i])) return true;
            }
            return false;
          }

          var message = isResponse(location.hash)
            ? location.hash
            : '#' + location.search;

          (window.opener || window.parent).postMessage(message, location.origin);
        </script>
      </body>
    </html>
  ```
- Add an entry for this file to the `assets` section in the `angular.json` of your application:
  ```json
    ...
    assets:[..., "apps/<your-app>/src/silent-refresh.html"],
    ...
  ```