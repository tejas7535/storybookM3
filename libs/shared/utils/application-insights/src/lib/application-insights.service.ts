import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveEnd, Router } from '@angular/router';

import { filter, map, tap } from 'rxjs/operators';

import { ApplicationInsights } from '@microsoft/applicationinsights-web';

import {
  APPLICATION_INSIGHTS_CONFIG,
  ApplicationInsightsModuleConfig,
} from './application-insights-module-config';

@Injectable({
  providedIn: 'root',
})
export class ApplicationInsightsService {
  constructor(
    @Inject(APPLICATION_INSIGHTS_CONFIG)
    private readonly moduleConfig: ApplicationInsightsModuleConfig,
    private readonly router: Router
  ) {
    this.appInsights = new ApplicationInsights({
      config: this.moduleConfig.applicationInsightsConfig,
    });

    this.appInsights.loadAppInsights();

    this.createRouterSubscription();
  }
  private readonly appInsights: ApplicationInsights;

  private static getActivatedComponent(snapshot: ActivatedRouteSnapshot): any {
    return snapshot.firstChild !== null && snapshot.firstChild !== undefined
      ? ApplicationInsightsService.getActivatedComponent(snapshot.firstChild)
      : snapshot.component;
  }

  public logPageView(name?: string, uri?: string): void {
    this.appInsights.trackPageView({ name, uri });
  }

  public logEvent(name: string, properties?: { [key: string]: any }): void {
    this.appInsights.trackEvent({ name }, properties);
  }

  public logMetric(
    name: string,
    average: number,
    properties?: { [key: string]: any }
  ): void {
    this.appInsights.trackMetric({ name, average }, properties);
  }

  public logException(exception: Error, severityLevel?: number): void {
    this.appInsights.trackException({ exception, severityLevel });
  }

  public logTrace(message: string, properties?: { [key: string]: any }): void {
    this.appInsights.trackTrace({ message }, properties);
  }

  private createRouterSubscription(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof ResolveEnd),
        map((event) => event as ResolveEnd),
        tap((event: ResolveEnd) => {
          const activatedComponent = ApplicationInsightsService.getActivatedComponent(
            event.state.root
          );
          if (activatedComponent) {
            this.logPageView(activatedComponent.name, event.urlAfterRedirects);
          }
        })
      )
      .subscribe();
  }
}
