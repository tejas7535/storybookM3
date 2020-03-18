# oAuth2 Library for Authentication with AAD

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test shared-auth` to execute the unit tests.

## How to use

This library can be used to authenticate users with Azure AD. Unfortunatelly, it is not possible right now to use _code flow_ due to restrictions from Azure.  
This, you need the implement the *implicit flow*.


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
- Add this file to the `assets` in the related entry of your app in the `angular.json` of this mono repository:
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

1. Initialize the authentication service (for example in the constructor of your `app.component.ts`):
   ```js
      constructor(private readonly authService: AuthService) {
            this.authService.configureImplicitFlow();
      }
   ```
2. Use the login method to login the user (for example trigger this on a button click):
  ```js
    public login(): void {
        this.authService.login();
    }
  ```

*Please check out the other existing methods within the `auth.service.ts`.*