import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { SettingsFacade } from '@ea/core/store';

import { BasicEvent } from './event-types';

@Injectable({
  providedIn: 'root',
})
export class EmbeddedGoogleAnalyticsService {
  private readonly window: Window;

  constructor(
    @Inject(DOCUMENT) document: Document,
    private readonly settingsFacade: SettingsFacade
  ) {
    this.window = document.defaultView;
  }

  public async logEvent<T extends BasicEvent>(event: T): Promise<void> {
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

  private async isAppEmbedded(): Promise<boolean> {
    const isStandalone = await firstValueFrom(
      this.settingsFacade.isStandalone$
    );

    return !isStandalone;
  }
}
