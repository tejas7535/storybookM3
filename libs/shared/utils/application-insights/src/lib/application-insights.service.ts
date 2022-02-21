import { Inject, Injectable, Optional } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ResolveEnd,
  Router,
} from '@angular/router';

import { Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';

import {
  ApplicationInsights,
  ITelemetryItem,
} from '@microsoft/applicationinsights-web';

import {
  APPLICATION_INSIGHTS_CONFIG,
  ApplicationInsightsModuleConfig,
} from './application-insights-module-config';
import { AI_COOKIES } from './cookie-groups';

@Injectable({
  providedIn: 'root',
})
export class ApplicationInsightsService {
  public constructor(
    @Optional()
    @Inject(APPLICATION_INSIGHTS_CONFIG)
    private readonly moduleConfig: ApplicationInsightsModuleConfig,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    if (this.moduleConfig?.applicationInsightsConfig) {
      this.appInsights = new ApplicationInsights({
        config: this.moduleConfig.applicationInsightsConfig,
      });

      this.appInsights.loadAppInsights();

      if (!this.moduleConfig.consent) {
        this.startTracking(false);
      }
    }
  }

  private readonly appInsights!: ApplicationInsights;
  private readonly destroy$ = new Subject<void>();
  private initial = true;

  private static getActivatedComponent(snapshot: ActivatedRouteSnapshot): any {
    return snapshot.firstChild !== null && snapshot.firstChild !== undefined
      ? ApplicationInsightsService.getActivatedComponent(snapshot.firstChild)
      : snapshot.component;
  }

  public startTracking(cookieEnabled: boolean): void {
    // delete cookies since app insights only disable usage of them
    if (!cookieEnabled) {
      AI_COOKIES.forEach((aiCookie) =>
        this.appInsights?.getCookieMgr().del(aiCookie)
      );
    }

    this.appInsights?.getCookieMgr().setEnabled(cookieEnabled);

    // track visitor before consent but only once
    if (!!this.moduleConfig.consent && this.initial) {
      this.initial = false;
      this.trackInitalPageView();
    }

    // make sure to not subscribe to router twice if consent changes
    this.destroy$.next();
    this.createRouterSubscription();
  }

  public addCustomPropertyToTelemetryData(tag: string, value: string): void {
    const telemetryInitializer = (envelope: ITelemetryItem) => {
      envelope.data = { ...envelope.data, [tag]: value };
    };
    this.appInsights?.addTelemetryInitializer(telemetryInitializer);
  }

  public logPageView(name?: string, uri?: string): void {
    this.appInsights?.trackPageView({ name, uri });
  }

  public logEvent(name: string, properties?: { [key: string]: any }): void {
    this.appInsights?.trackEvent({ name }, properties);
  }

  public logMetric(
    name: string,
    average: number,
    properties?: { [key: string]: any }
  ): void {
    this.appInsights?.trackMetric({ name, average }, properties);
  }

  public logException(exception: Error, severityLevel?: number): void {
    this.appInsights?.trackException({ exception, severityLevel });
  }

  public logTrace(message: string, properties?: { [key: string]: any }): void {
    this.appInsights?.trackTrace({ message }, properties);
  }

  private createRouterSubscription(): void {
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((event) => event instanceof ResolveEnd),
        map((event) => event as ResolveEnd),
        tap((event: ResolveEnd) =>
          this.trackPageView(event.state.root, event.urlAfterRedirects)
        )
      )
      .subscribe();
  }

  private trackInitalPageView(): void {
    this.trackPageView(this.route.snapshot, this.router.url);
  }

  private trackPageView(snapshot: ActivatedRouteSnapshot, uri?: string) {
    const activatedComponent =
      ApplicationInsightsService.getActivatedComponent(snapshot);

    if (activatedComponent) {
      this.logPageView(activatedComponent.name, uri);
    }
  }
}
