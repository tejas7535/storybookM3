import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getIsLoggedIn,
  getProfileImage,
  getUsername,
} from '@schaeffler/azure-auth';
import { FooterLink } from '@schaeffler/footer';

import packageJson from '../../package.json';
import { AppRoutePath } from './app-route-path.enum';

@Component({
  selector: 'cdba-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Cost Database Analytics';
  titleLink = AppRoutePath.SearchPath;

  public appVersion = packageJson.version;
  public footerLinks: FooterLink[] = [
    {
      link: 'https://sconnect.schaeffler.com/groups/cost-database-analytics/pages/faq',
      title: 'FAQs',
      external: true,
    },
    {
      link: 'https://sconnect.schaeffler.com/groups/cost-database-analytics',
      title: 'CDBA@SConnect',
      external: true,
    },
  ];

  username$: Observable<string>;
  profileImage$: Observable<string>;
  isLoggedIn$: Observable<boolean>;

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.username$ = this.store.select(getUsername);
    this.profileImage$ = this.store.select(getProfileImage);
    this.isLoggedIn$ = this.store.select(getIsLoggedIn);
  }
}
