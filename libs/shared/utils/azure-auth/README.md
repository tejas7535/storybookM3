# shared-utils-azure-auth

This library enables authentications and token acquisition with the Microsoft Identity platform. It implements the `OAuth 2.0 Authorization Code Flow with PKCE` and it is `OpenID-compliant`.

## Prerequisites
### Azure AD

1) Go to your `app registration` -> `Authentication` and `Add a platform`.  
2) Choose `Single Page Application`.  
3) Add the following redirect URIs to it:  
    - localhost:4200 (for local development)
    - https://<your-domain>(for your environment)

## API

### NGRX Actions

This library provides the following actions for you to dispatch from within your application:

- `login`: manual login that triggers the Authorization Code flow (not needed if you want `Automatic Login`)
- `logout`: manual logout
- `loadProfileImage`: loads the user's profile image if he is already authenticated (not needed to execute manually)

### NGRX Selectors

This library provides the following (piped) selectors that can be used from within your application to retrieve auth information:

| selector               | description | ngrx selector  | usage | comment | 
| -----------------------| ------------| ------------------| ----- | ------- |
| `getUsername` | get username | ✅ | `this.store.select(getUsername)` | |
| `getUserDepartment` | get department of the user | ✅ | `this.store.select(getUserDepartment)` | |
| `getUserUniqueIdentifier` | get the uid of an user (e.g. 'kauppfbi') | ✅ | `this.store.select(getUserUniqueIdentifier)` | |
| `getIsLoggedIn` | get logged in status | ✅ | `this.store.select(getIsLoggedIn)` | |
| `getAccountInfo` | get whole account information from user | ✅ | `this.store.select(getAccountInfo)` | |
| `getProfileImage` | get url to load the profile image | ✅ | `this.store.select(getProfileImage)` | |
| `getAccessToken` | get the base64 encoded access token of user | ✅  | `this.store.select(getAccessToken)` | |
| `getBackendRoles` | get backend roles (accessToken) of user | ✅  | `this.store.select(getBackendRoles)` | These roles should not be used in AuthGuards or similar. Please only display them to give your user better transparency |
| | | | | | 
| `getRoles` | get id token roles of user | ❌ | `this.store.pipe(getRoles)` | only emits a value when user is logged in | 
| `hasIdTokenRole` | check if user has specific role | ❌ | `this.store.pipe(hasIdTokenRole('BasicRole'))` | only emits a value when user is logged in | 
| `hasIdTokenRoles` | check if user has all given roles | ❌ | `this.store.pipe(hasIdTokenRoles(['Role-A', 'Role-B']))` | only emits a value when user is logged in | 
| `hasAnyIdTokenRole` | ckeck if user has one of the given roles | ❌ | `this.store.pipe(hasAnyIdTokenRole(['Role-A', 'Role-B']))` | only emits a value when user is logged in | 

### Guards

- `MsalGuard`: ensures that the user is authenticated before accessing the related route -> automated login

### Interceptors

- `MsalInterceptor`: add bearer token to each outgoing call including the desired `appScope` as defined in the `MsalInterceptorConfig` of your `AzureConfig`

## Example Usage for Automatic Login

- Add the following properties to your `environment` files:
  ```typescript
    export const environment = {
        production: false, 
        tenantId: 'XXX', // tenant id of your Azure App Registration
        clientId: 'XXX', // client id of your Azure App Registration
        appScope: 'api://XXX/YYY', // scope that is desired in your claim
    };
  ```
- Import this azure-auth module into your `app.module.ts`:
  ```typescript
    import { HttpClientModule } from '@angular/common/http';
    import { RouterModule, Routes } from '@angular/router';

    import { HomeComponent } from './home.component';

    import { MsalRedirectComponent } from '@azure/msal-angular';
    import { MsalGuard } from '@azure/msal-angular';
    import { StoreModule } from '@ngrx/store';
    import { EffectsModule } from '@ngrx/effects';

    import {
        MsalGuardConfig,
        MsalInstanceConfig,
        MsalInterceptorConfig,
        ProtectedResource,
        AzureConfig,
        SharedAzureAuthModule,
    } from '@schaeffler/azure-auth';

    import { environment } from '../environments/environment';

    const azureConfig = new AzureConfig(
        new MsalInstanceConfig(
            environment.clientId,
            environment.tenantId,
            !environment.production
        ),
        new MsalInterceptorConfig([
            new ProtectedResource('/api/*', [environment.appScope]), // the resources the scope is needed
        ]),
        new MsalGuardConfig('/login-failed', [ // redirect URI for failed login requests
            environment.appScope,
        ])
    );

    const routes: Routes = [
        { path: '', component: HomeComponent, canActivate: [MsalGuard] }, // MsalGuard ensures an automated login
    ];

    @NgModule({
        imports: [
            ...
            RouterModule.forRoot(routes),
            HttpClientModule,
            SharedAzureAuthModule.forRoot(azureConfig),
            StoreModule.forRoot({}),
            EffectsModule.forRoot(),
        ],
        providers: [...],
        bootstrap: [AppComponent, MsalRedirectComponent] // MsalRedirectComponent handles redirects of your OAuth 2.0 process
    })
    export class AppModule {}
  ```
