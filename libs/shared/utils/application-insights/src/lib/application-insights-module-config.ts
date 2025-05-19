import { InjectionToken } from '@angular/core';

import { IConfiguration } from '@microsoft/applicationinsights-web';

import { CustomProps } from './application-insights.models';

export interface ApplicationInsightsModuleConfig {
  applicationInsightsConfig: IConfiguration;
  enableGlobalErrorHandler?: boolean;
  enableNgrxMetaReducer?: boolean;
  ngrxIgnorePattern?: string[];
  consent?: boolean;
  trackPageViewUsingUriAsName?: boolean;
  customProps?: CustomProps;
}

export const APPLICATION_INSIGHTS_CONFIG =
  new InjectionToken<ApplicationInsightsModuleConfig>(
    'ApplicationInsightsConfig'
  );
