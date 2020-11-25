import { InjectionToken } from '@angular/core';

import { IConfiguration } from '@microsoft/applicationinsights-web';

export interface ApplicationInsightsModuleConfig {
  applicationInsightsConfig: IConfiguration;
  enableGlobalErrorHandler?: boolean;
  enableNgrxMetaReducer?: boolean;
  ngrxIgnorePattern?: string[];
}

export const APPLICATION_INSIGHTS_CONFIG = new InjectionToken<ApplicationInsightsModuleConfig>(
  'ApplicationInsightsConfig'
);
