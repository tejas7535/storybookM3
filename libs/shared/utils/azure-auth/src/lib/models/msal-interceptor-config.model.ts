import { InteractionType } from '@azure/msal-browser';
import { ProtectedResource } from './protected-resource.model';

export class MsalInterceptorConfig {
  constructor(
    public protectedResources: ProtectedResource[],
    public interactionType:
      | InteractionType.Popup
      | InteractionType.Redirect = InteractionType.Redirect
  ) {}
}
