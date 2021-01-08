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
