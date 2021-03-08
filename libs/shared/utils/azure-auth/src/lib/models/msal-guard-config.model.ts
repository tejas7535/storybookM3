import { InteractionType } from '@azure/msal-browser';

export class MsalGuardConfig {
  constructor(
    public loginFailedRoute: string,
    public scopes: string[],
    public interactionType:
      | InteractionType.Popup
      | InteractionType.Redirect = InteractionType.Redirect
  ) {}
}
