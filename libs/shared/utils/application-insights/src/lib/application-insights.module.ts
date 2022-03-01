import { CommonModule } from '@angular/common';
import {
  ErrorHandler,
  Injector,
  ModuleWithProviders,
  NgModule,
} from '@angular/core';

import { META_REDUCERS } from '@ngrx/store';

import { ApplicationInsightsService } from './application-insights.service';
import { ApplicationInsightsErrorHandlerService } from './application-insights-error-handler.service';
import { applicationInsightsMetaReducerFactory } from './application-insights-meta-reducer-factory';
import {
  APPLICATION_INSIGHTS_CONFIG,
  ApplicationInsightsModuleConfig,
} from './application-insights-module-config';
import { NGRX_IGNORE_PATTERN } from './ngrx-ignore-pattern';

@NgModule({
  imports: [CommonModule],
})
export class ApplicationInsightsModule {
  public static forRoot(
    config: ApplicationInsightsModuleConfig
  ): ModuleWithProviders<ApplicationInsightsModule> {
    return {
      ngModule: ApplicationInsightsModule,
      providers: [
        {
          provide: APPLICATION_INSIGHTS_CONFIG,
          useValue: config,
        },
        ...(config.enableGlobalErrorHandler
          ? [
              {
                provide: ErrorHandler,
                useClass: ApplicationInsightsErrorHandlerService,
              },
              ApplicationInsightsErrorHandlerService,
            ]
          : []),
        ...(config.enableNgrxMetaReducer
          ? [
              {
                provide: META_REDUCERS,
                deps: [ApplicationInsightsService, Injector],
                useFactory: applicationInsightsMetaReducerFactory,
                multi: true,
              },
            ]
          : []),
        ...(config.enableNgrxMetaReducer && config.ngrxIgnorePattern
          ? [
              {
                provide: NGRX_IGNORE_PATTERN,
                useValue: config.ngrxIgnorePattern,
              },
            ]
          : []),
      ],
    };
  }
}
