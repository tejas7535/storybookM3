import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { BasicEvent } from './event-types';

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  private readonly window: Window;

  constructor(@Inject(DOCUMENT) document: Document) {
    this.window = document.defaultView;
  }

  public logEvent<T extends BasicEvent>(event: T): void {
    if ((this.window as any).dataLayer && event) {
      (this.window as any).dataLayer.push({
        ...event,
        event: 'Engineering-App',
      });
    }
  }
}
