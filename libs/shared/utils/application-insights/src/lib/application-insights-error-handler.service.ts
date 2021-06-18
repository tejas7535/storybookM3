import { ErrorHandler, Injectable, Injector } from '@angular/core';

import { ApplicationInsightsService } from './application-insights.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicationInsightsErrorHandlerService implements ErrorHandler {
  public constructor(private readonly injector: Injector) {}

  public handleError(error: Error): void {
    this.injector
      .get<ApplicationInsightsService>(ApplicationInsightsService)
      .logException(error);

    console.error(error);
  }
}
