import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { SettingsFacade } from '@ea/core/store';
import { CalculationParametersCalculationTypes } from '@ea/core/store/models';
import { APP_VERSION } from '@ea/shared/constants/version';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import {
  BasicEvent,
  CalculationEvent,
  CalculationTypeChangeEvent,
  EmbeddedGoogleAnalyticsService,
  LoadCaseEvent,
} from '../embedded-google-analytics';

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  private readonly version = APP_VERSION;

  constructor(
    private readonly settingsFacade: SettingsFacade,
    private readonly gaService: EmbeddedGoogleAnalyticsService,
    private readonly aiService: ApplicationInsightsService
  ) {}

  public async logDownloadReport(): Promise<void> {
    return this.logEvent({ action: 'Download Report' });
  }

  public async logShowReport(): Promise<void> {
    return this.logEvent({ action: 'Show Report' });
  }

  public async logToggleCalculationType(
    newStatus: boolean,
    methods: CalculationTypeChangeEvent['methods']
  ): Promise<void> {
    return this.logEvent({
      action: 'Toggle Method',
      status: newStatus ? 'on' : 'off',
      methods,
      version: this.version,
    });
  }

  public async logCalculation(
    calculationTypes: CalculationParametersCalculationTypes,
    loadcaseCount: number,
    error?: string
  ): Promise<void> {
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

  public async logLoadcaseEvent(
    event: LoadCaseEvent['event'],
    numberOfLoadcases?: LoadCaseEvent['numberOfLoadcases']
  ) {
    return this.logEvent({
      action: 'Load Case Changed',
      event,
      numberOfLoadcases,
    });
  }

  private async logEvent<T extends BasicEvent>(event: T): Promise<void> {
    const standalone = await firstValueFrom(this.settingsFacade.isStandalone$);

    if (standalone) {
      this.aiService.logEvent(event.action, event);
    } else {
      this.gaService.logEvent(event);
    }

    return;
  }
}
