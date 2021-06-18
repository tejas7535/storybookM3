import { InteractionType } from '@azure/msal-browser';

export class MsalGuardConfig {
  public constructor(
    public loginFailedRoute: string,
    public scopes: string[],
    public interactionType:
      | InteractionType.Popup
      | InteractionType.Redirect = InteractionType.Redirect
  ) {}
}
