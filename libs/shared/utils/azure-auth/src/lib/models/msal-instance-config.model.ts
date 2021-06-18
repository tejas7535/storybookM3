export class MsalInstanceConfig {
  public constructor(
    public clientId: string,
    public tenantId: string,
    public loggingEnabled: boolean = false,
    public redirectUri: string = window.location.origin,
    public postLogoutRedirectUri: string = window.location.origin,
    public loginUrl: string = 'https://login.microsoftonline.com/'
  ) {}
}
