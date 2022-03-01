# Shared Library for Application Insights

You can use this library in order to receive monitoring and logging capabilities with Microsoft Application Insights.

## Preconditions

Of course you need to have a `Application Insights` Service running for your application. See this [guide](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview#get-started) for further information.

Additionally this lib depends on the following packages:

- `@ngrx/store`
- `@microsoft/applicationinsights-web`

Make sure, you have them installed via `npm` properly.

## Usage

1. Prepare a module configuration in your environment.
```typescript
    export const environment = {
        ...
        applicationInsights: {
            applicationInsightsConfig: {
                instrumentationKey: '<put-your-key-here>',
                // you can add more config properties here, see https://github.com/microsoft/applicationinsights-js#configuration for more options
            },
            enableGlobalErrorHandler: false|true, // optional - default is false
            enableNgrxMetaReducer: false|true, // optional - default is false
            ngrxIgnorePattern: ['@ngrx/*'], // optional - default is undefined, but it is recommened to exclude `@ngrx/*` actions
        },
    };
   ```
2. Import this module

```typescript
    import { ApplicationInsightsModule } from '@schaeffler/application-insights';

    import { environment } from '../../environments/environment';

    ...
    imports: [
        ApplicationInsightsModule.forRoot(environment.applicationInsights)
    ]
    ...
```

**Optional**:  
If you want to log additonal custom properties for any event (pageView, customEvent, metric, ...), you can use the `ApplicationInsightsService`:

```typescript
    import { ApplicationInsightsService } from '@schaeffler/application-insights';

    ...

    constructor(private readonly applicationInsights: ApplicationInsightsService){}

    ...

    private addCustomProperty(): void {

        const tag = 'department';
        const value = 'SF/HZA-CDAI2';

        this.applicationInsights.addCustomPropertyToTelemetryData(tag, value);
    }
```

**Optional**:  
If you want to log additonal events, metrics & co, you can use the `ApplicationInsightsService`:

```typescript
    import { ApplicationInsightsService } from '@schaeffler/application-insights';


    ...

    constructor(private readonly applicationInsights: ApplicationInsightsService){}


    ...

    private handleEvent(event): void {

        // page view
        this.applicationInsights.logPageView('name', 'uri');

        // custom event
        this.applicationInsights.logEvent('name', properties);

        // custom metric
        this.applicationInsights.logMetric('name', average, properties);

        // exception
        this.applicationInsights.logException(error, severityLevel);

        // trace
        this.applicationInsights.logTrace('message', properties);
    }
```

**Optional**:  
If you want to log events GDPR compliant using cookies, implement like so:

1. Prepare a module configuration in your environment.

```typescript
    export const environment = {
        ...
        applicationInsights: {
            applicationInsightsConfig: {
                instrumentationKey: '<put-your-key-here>',
                disableCookiesUsage: false; // cookies are enabled generally
                // you can add more config properties here, see https://github.com/microsoft/applicationinsights-js#configuration for more options
            },           
            consent: true; // required for GDPR solution
            ...
        },
        oneTrustId: '<onetrust-id>'
    };
```

2. Import this module

```typescript
    import { ApplicationInsightsModule } from '@schaeffler/application-insights';
    import {
        CookiesGroups,
        OneTrustModule,
        OneTrustService,
    } from '@altack/ngx-onetrust';

    import { environment } from '../../environments/environment';

    ...
    imports: [
        ApplicationInsightsModule.forRoot(environment.applicationInsights)
        OneTrustModule.forRoot({
            cookiesGroups: COOKIE_GROUPS,
            domainScript: environment.oneTrustId,
        }),
    ]
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializer,
            deps: [OneTrustService, ApplicationInsightsService],
            multi: true,
        },
        ...
    ]
    ...

    export function appInitializer(
        oneTrustService: OneTrustService,
        applicationInsightsService: ApplicationInsightsService
    ) {
        oneTrustService.consentChanged$().subscribe((cookiesGroups) => {
            if (cookiesGroups.get(CookiesGroups.PerformanceCookies)) {
            applicationInsightsService.startTelemetry();
            } else {
            applicationInsightsService.deleteCookies();
            }
        });

        return () => oneTrustService.loadOneTrust();
    }
```
