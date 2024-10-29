import { Injectable } from '@angular/core';

import { CalculationParametersCalculationTypes } from '@ea/core/store/models';
import { APP_VERSION } from '@ea/shared/constants/version';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import {
  BasicEvent,
  CalculationEvent,
  CalculationTypeChangeEvent,
  GoogleAnalyticsService,
  LoadCaseEvent,
  StoreClickEvent,
} from '../google-analytics';
import { MobileFirebaseAnalyticsService } from '../mobile-frebase-analytics/mobile-firebase-analytics.service';

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  private readonly version = APP_VERSION;

  constructor(
    private readonly gaService: GoogleAnalyticsService,
    private readonly aiService: ApplicationInsightsService,
    private readonly firebaseService: MobileFirebaseAnalyticsService
  ) {}

  public logDownloadReport(): void {
    return this.logEvent({ action: 'Download Report' });
  }

  public logShowReport(): void {
    return this.logEvent({ action: 'Show Report' });
  }

  public logToggleCalculationType(
    newStatus: boolean,
    methods: CalculationTypeChangeEvent['methods']
  ): void {
    return this.logEvent({
      action: 'Toggle Method',
      status: newStatus ? 'on' : 'off',
      methods,
      version: this.version,
    });
  }

  public logCalculation(
    calculationTypes: CalculationParametersCalculationTypes,
    loadcaseCount: number,
    error?: string
  ): void {
    const methods: CalculationEvent['methods'] = {};
    for (const [calculationType, calculationOptions] of Object.entries(
      calculationTypes
    )) {
      if (calculationOptions.disabled) {
        continue;
      }
      methods[calculationType] = calculationOptions.selected;
    }

    return this.logEvent({
      action: 'Calculate',
      status: error ? 'unsuccessful' : 'successful',
      methods,
      message: error || 'successful',
      version: this.version,
      numberOfLoadcases: loadcaseCount,
    });
  }

  public logLoadcaseEvent(
    event: LoadCaseEvent['event'],
    numberOfLoadcases?: LoadCaseEvent['numberOfLoadcases']
  ) {
    return this.logEvent({
      action: 'Load Case Changed',
      event,
      numberOfLoadcases,
    });
  }

  public logAppStoreClick(storeName: string, page: string): void {
    const storeClickEvent: StoreClickEvent = {
      action: 'App Store Link Click',
      storeName,
      page,
    };

    this.logEvent(storeClickEvent);
  }

  private logEvent<T extends BasicEvent>(event: T): void {
    this.aiService.logEvent(event.action, event);
    this.gaService.logEvent(event);
    this.firebaseService.logEvent(event);

    return;
  }
}
