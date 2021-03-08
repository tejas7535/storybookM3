import { MsalGuardConfig } from './msal-guard-config.model';
import { MsalInstanceConfig } from './msal-instance-config.model';
import { MsalInterceptorConfig } from './msal-interceptor-config.model';

export class AzureConfig {
  constructor(
    public msalInstance: MsalInstanceConfig,
    public msalInterceptor: MsalInterceptorConfig,
    public msalGuard: MsalGuardConfig
  ) {}
}
