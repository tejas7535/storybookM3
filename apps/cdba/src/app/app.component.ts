import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { getUsername, startLoginFlow } from '@schaeffler/auth';
import { FooterLink } from '@schaeffler/footer';
import { UserMenuEntry } from '@schaeffler/header';
import { BreakpointService } from '@schaeffler/responsive';

import { version } from '../../package.json';
import { AppState } from './core/store';

@Component({
  selector: 'cdba-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Cost Database Analytics';

  public appVersion = version;
  public footerLinks: FooterLink[] = [
    {
      link: 'https://sconnect.schaeffler.com/groups/cost-database-analytics',
      title: 'CDBA @ sConnect',
      external: true,
    },
  ];

  username$: Observable<string>;
  userMenuEntries: UserMenuEntry[] = [];

  isLessThanMediumViewport$: Observable<boolean>;

  public constructor(
    private readonly breakpointService: BreakpointService,
    private readonly store: Store<AppState>
  ) {}

  public ngOnInit(): void {
    this.isLessThanMediumViewport$ = this.breakpointService.isLessThanMedium();
    this.username$ = this.store.pipe(select(getUsername));

    this.store.dispatch(startLoginFlow());
  }
}
