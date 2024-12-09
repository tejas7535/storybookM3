import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { BasicEvent, StepLoadEvent } from './event-types';

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  private readonly window: Window;

  constructor(@Inject(DOCUMENT) document: Document) {
    this.window = document.defaultView;
  }

  public logStepLoadEvent(stepIndex: number): void {
    if (stepIndex > 3) {
      return;
    }
    const step_name = this.getStepNameByIndex(stepIndex);
    const stepLoadEvent: StepLoadEvent = {
      event: 'lsa_related_interaction',
      action: 'Step Load',
      step: stepIndex,
      step_name,
    };

    this.logEvent(stepLoadEvent);
  }

  public logEvent<T extends BasicEvent>(event: T): void {
    if ((this.window as any).dataLayer && event) {
      (this.window as any).dataLayer.push(event);
    }
  }

  private getStepNameByIndex(stepIndex: number): string {
    switch (stepIndex) {
      case 1:
        return 'Lubrication Points';
      case 2:
        return 'Lubricant';
      case 3:
        return 'Application';
      default:
        return '';
    }
  }
}
