# HelloWorld

## Run Application

`ng run helloworld-azure`

## Test Application

Unit Tests: `ng test helloworld-azure`  
End-to-end tests: `ng e2e helloworld-azure-e2e`

## Lint Application

`ng lint helloworld-azure` and `ng lint helloworld-azure-e2e`

## Deployment

The deployment job for this application can be found [here](https://gitlab.schaeffler.com/hello-world/helloworld-frontend-deployment).  
It gets automatically triggered each master or release build.

## Local Development (Routing)

This app expects three running backends:

- helloworld-backend-java
- helloworld-backend-dotnet
- helloworld-functions

By default, they are expected to be running locally.
You can route certain API endpoints to other servers, i.e. the [deployed app](https://hello-world.dp.schaeffler), with the file `src/proxy.conf.js`.

Start the app with `ng serve helloworld-azure --proxy-config apps/helloworld-azure/proxy.conf.js`.

For example, if you are only running the helloworld-backend-java locally, use the following config:

```js

const PROXY_CONFIG = [
    {
        context: [
            "/api/func-hello",
            "/dotnet"
        ],
        target: "https://hello-world.dp.schaeffler",
        changeOrigin: true,
        secure: false
    },
    {
        context: [
            "/public/api",
            "/api",
            "/admin"
        ],
        target: "http://localhost:8080",
        secure: false
    }
]

module.exports = PROXY_CONFIG;

```

## Further Information

Checkout the functionality of this mono repository, how it works and how you could become part of it with your application:
-  [Confluence](https://confluence.schaeffler.com/display/FRON)
-  [README](../../README.md)