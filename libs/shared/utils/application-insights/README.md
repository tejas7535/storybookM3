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
       
        const tag = 'application'; // optional
        const value = '[Bearinx - Greaseapp]'; // optional

        applicationInsightsService.initTracking(tag, value);

        return () => oneTrustService.loadOneTrust();
    }
```

3. Add cookie banner to app component
   1. Legal pages (`libs/ui/legal-pages`) are required for using cookie banner within your application.
   2. Before implementing cookie banner within your application, please check the [Documentation](https://confluence.schaeffler.com/display/FRON/Tracking) and follow the described steps.

Adjustments to app.component.ts:

```ts
    import { LegalPath } from '@schaeffler/legal-pages';

    @Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
    })
    export class AppComponent {
        isCookieRouteActive$: Observable<boolean>;

        public constructor(
            private readonly translocoService: TranslocoService,
            @Optional() private readonly oneTrustService: OneTrustService
        ) {}

        public ngOnInit(): void {
            this.handleCurrentRoute();

            // only required if your application supports multiple language via transloco
            this.translocoService.langChanges$.subscribe((language) => {
                this.oneTrustService?.translateBanner(language, true);
            });
        }

        handleCurrentRoute(): void {
            // on first load app component loads after router event
            const initialLoad = of(this.router).pipe(
                take(1),
                map((router) => router.url)
            );
            // listen to all subsequent route changes
            const routerEvents = this.router.events.pipe(
                filter((event) => event instanceof NavigationEnd),
                map((event) => (event as unknown as NavigationEnd)?.url)
            );
            // check if current route is cookie page
            this.isCookieRouteActive$ = merge(initialLoad, routerEvents).pipe(
                map((url) => url.split('/').pop() === LegalPath.CookiePath)
            );
        }
    }

```

Adjustments to app.component.html:

```html
    <router-outlet></router-outlet>
    <div
        *transloco="let t; read: 'legal'"
        class="mx-auto w-full max-w-screen-md bg-surface"
        [ngClass]="{ hidden: !(isCookieRouteActive$ | ngrxPush) }"
    >
        <div class="py-3 px-4">
            <button id="ot-sdk-btn" class="ot-sdk-show-settings">
                {{ t('cookieSettings') }}
            </button>
        </div>
        <div class="py-3 md:px-4">
            <div id="ot-sdk-cookie-policy"></div>
        </div>
    </div>
```
