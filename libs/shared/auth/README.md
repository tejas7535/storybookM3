# oAuth2 Library for Authentication with AAD

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test shared-auth` to execute the unit tests.

## How to use

This library can be used to authenticate users with Azure AD. Unfortunatelly, it is not possible right now to use _code flow_ due to restrictions from Azure.  
Thus, this lib does only support the _implicit flow_


### Prequisites

- Create a file called `silent-refresh.html` and put it in the `src` folder of your app with the following content:
  ```html
    <!DOCTYPE html>
    <html>
    <body>
        <script>
        parent.postMessage(location.hash, location.origin);
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
- Get the `client id`, `tenant id` as well as the `app id` of your application in Azure and set them in your `environment`files:
  ```js
    export const environment = {
        production: false,
        azureTenantId: 'XXX',
        azureClientId: 'XXX',
        azureBackendAPI: 'api://XXX/YYY',
    };

  ```
- Import this auth module into your `app.module.ts`:
  ```js
    import { environment } from '../environments/environment';

    const azureConfig = new AzureConfig(
        environment.tenantId,
        environment.clientId,
        environment.appId,
        !environment.production
    );

    @NgModule({
        imports: [
            ....
            SharedAuthModule.forRoot(azureConfig)
        ],
        providers: [...],
        bootstrap: [AppComponent]
    })
    export class AppModule {}
  ```

### Implementation

* Use the `loginImplicitFlow` action in your application for login, e.g.:
   ```js
      public constructor(private readonly store: Store){}

      public ngOnInit(): void {
            this.store.dispatch(loginImplicitFlow());
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
