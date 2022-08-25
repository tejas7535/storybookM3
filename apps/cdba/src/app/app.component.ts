import { Component } from '@angular/core';

import { Store } from '@ngrx/store';

import {
  getIsLoggedIn,
  getProfileImage,
  getUsername,
} from '@schaeffler/azure-auth';

import { RoleFacade } from '@cdba/core/auth/role.facade';
import { FOOTER_LINKS } from '@cdba/shared/constants/footer';

import packageJson from '../../package.json';
import { AppRoutePath } from './app-route-path.enum';

@Component({
  selector: 'cdba-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Cost Database Analytics';
  titleLink = AppRoutePath.SearchPath;
  footerLinks = FOOTER_LINKS;
  appVersion = packageJson.version;

  isLoggedIn$ = this.store.select(getIsLoggedIn);
  username$ = this.store.select(getUsername);
  profileImage$ = this.store.select(getProfileImage);
  hasBetaUserRole$ = this.roleFacade.hasBetaUserRole$;

  public constructor(
    private readonly store: Store,
    private readonly roleFacade: RoleFacade
  ) {}
}
