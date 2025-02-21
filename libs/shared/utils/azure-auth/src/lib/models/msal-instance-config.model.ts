export class MsalInstanceConfig {
  /**
   * @param {string} clientId - The client ID of the application.
   * @param {string} tenantId - The tenant ID of the Azure Active Directory.
   * @param {boolean} [loggingEnabled=false] - Flag to enable or disable logging.
   * @param {string} [redirectUri=window.location.origin] - The URI to redirect to after login.
   * @param {string} [postLogoutRedirectUri=window.location.origin] - The URI to redirect to after logout.
   * @param {string} [loginUrl='https://login.microsoftonline.com/'] - The URL for the login endpoint.
   * @param {boolean} [allowRedirectInIframe=false] - Flag to allow redirects in iframes.
   */
  public constructor(
    public clientId: string,
    public tenantId: string,
    public loggingEnabled: boolean = false,
    public redirectUri: string = window.location.origin,
    public postLogoutRedirectUri: string = window.location.origin,
    public loginUrl: string = 'https://login.microsoftonline.com/',
    public allowRedirectInIframe: boolean = false
  ) {}
}
