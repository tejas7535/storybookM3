import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { select, Store } from '@ngrx/store';

import { getUsername, startLoginFlow } from '@schaeffler/auth';
import { UserMenuEntry } from '@schaeffler/header';

import { AppState } from './core/store';
import { RoleModalComponent } from './shared/role-modal/role-modal.component';

@Component({
  selector: 'gq-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Guided Quoting';

  username$: Observable<string>;

  userMenuEntries: UserMenuEntry[] = [
    new UserMenuEntry('roles', translate('shared.roleModal.menuTitle')),
  ];

  public constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>
  ) {}

  public ngOnInit(): void {
    this.username$ = this.store.pipe(select(getUsername));
    this.store.dispatch(startLoginFlow());
  }

  public userMenuClicked(): void {
    this.dialog.open(RoleModalComponent, {
      width: '50%',
      height: '70%',
    });
  }
}
