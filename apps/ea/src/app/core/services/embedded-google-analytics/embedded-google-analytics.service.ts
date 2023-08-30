import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { SettingsFacade } from '@ea/core/store';
import { CalculationParametersCalculationTypes } from '@ea/core/store/models';
import { APP_VERSION } from '@ea/shared/constants/version';

import {
  CalculationEvent,
  CalculationTypeChangeEvent,
  DownloadReportEvent,
  ShowReportEvent,
} from './event-types';

@Injectable({
  providedIn: 'root',
})
export class EmbeddedGoogleAnalyticsService {
  private readonly window: Window;
  private readonly version = APP_VERSION;

  constructor(
    @Inject(DOCUMENT) document: Document,
    private readonly settingsFacade: SettingsFacade
  ) {
    this.window = document.defaultView;
  }

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
      status: !error ? 'successful' : 'unsuccessful',
      methods,
      message: error || 'successful',
      version: this.version,
    });
  }

  private async isAppEmbedded(): Promise<boolean> {
    const isStandalone = await firstValueFrom(
      this.settingsFacade.isStandalone$
    );

    return !isStandalone;
  }

  private async logEvent(
    event:
      | CalculationTypeChangeEvent
      | ShowReportEvent
      | DownloadReportEvent
      | CalculationEvent
  ): Promise<void> {
    if (!(await this.isAppEmbedded())) {
      return;
    }

    if ((this.window as any).dataLayer && event) {
      (this.window as any).dataLayer.push({
        ...event,
        event: 'Engineering-App',
      });
    }
  }
}
