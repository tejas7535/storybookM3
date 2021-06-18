import Chainable = Cypress.Chainable;

export class Authorization {
  private readonly baseUrl: string;
  private readonly keycloak: string;
  private readonly realm: string;

  public constructor() {
    this.baseUrl = Cypress.config().baseUrl;
    this.keycloak = Cypress.env().keycloak;
    this.realm = Cypress.env().realm;
  }
  /**
   * returns a unique ID
   *
   */
  private static createUUID(): string {
    const s: any[] = [];
    const hexDigits = '0123456789abcdef';

    for (let i = 0; i < 36; i += 1) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4';
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // eslint-disable-line  no-bitwise
    s[8] = s[13] = s[18] = s[23] = '-';

    return s.join('');
  }

  /**
   * performs login at keycloak with given parameters
   *
   */
  public kcLogin(
    username: string,
    password: string
  ): Chainable<Cypress.Response> {
    const loginPageRequest = {
      followRedirect: true,
      url: `${this.keycloak}/auth/realms/${this.realm}/protocol/openid-connect/auth`,
      qs: {
        client_id: this.realm,
        redirect_uri: this.baseUrl,
        state: Authorization.createUUID(),
        nonce: Authorization.createUUID(),
        response_mode: 'fragment',
        response_type: 'code',
        scope: 'openid',
      },
    };

    // Open the KC login page, fill in the form with username and password and submit.
    return cy.request(loginPageRequest).then((response) => {
      const _el = document.createElement('html');
      _el.innerHTML = response.body;
      // This should be more strict depending on your login page template.
      const loginForm = _el.getElementsByTagName('form');

      const isAlreadyLoggedIn = !loginForm.length;
      if (isAlreadyLoggedIn) {
        return undefined;
      }

      return cy.request({
        form: true,
        method: 'POST',
        url: loginForm[0].action,
        followRedirect: false,
        body: {
          username,
          password,
        },
      });
    });
  }

  /**
   * keycloak-logout
   */
  public kcLogout(): Chainable<Cypress.Response> {
    return cy.request({
      url: `${this.keycloak}/auth/realms/${this.realm}/protocol/openid-connect/logout`,
      followRedirect: false,
      qs: {
        redirect_uri: this.baseUrl,
      },
    });
  }
}
