import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Injectable()
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected router: Router,
    protected keycloakAngular: KeycloakService
  ) {
    super(router, keycloakAngular);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.authenticated) {
        this.keycloakAngular.login();

        resolve(false);
      }

      const requiredRoles: string[] = route.data.roles;
      let granted = false;

      // if no roles are required, access can be granted
      // tslint:disable-next-line: prefer-conditional-expression
      if (!requiredRoles || requiredRoles.length === 0) {
        granted = true;
      } else {
        // if user has no roles at all, access is denied
        if (!this.roles || this.roles.length === 0) {
          granted = false;
        } else {
          // check if user has every required role
          granted = requiredRoles.every(role => this.roles.indexOf(role) > -1);
        }
      }

      if (!granted) {
        this.denyAccess(route);
      }

      resolve(granted);
    });
  }

  private denyAccess(route: ActivatedRouteSnapshot): void {
    if (route.data.unauthorized && route.data.unauthorized.redirect) {
      this.router.navigate(route.data.unauthorized.redirect);
    }
  }

  public signOut(): void {
    this.keycloakAngular.logout();

    this.router.navigate(['signout']);
  }

  public async getCurrentProfile(): Promise<KeycloakProfile> {
    return this.keycloakAngular.loadUserProfile();
  }
}
