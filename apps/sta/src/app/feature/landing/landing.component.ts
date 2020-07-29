import { Component } from '@angular/core';

import { Store } from '@ngrx/store';

import { startLoginFlow } from '@schaeffler/auth';

import { AppState } from '../../core/store';

@Component({
  selector: 'sta-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  constructor(private readonly store: Store<AppState>) {}

  public login(): void {
    this.store.dispatch(startLoginFlow());
    localStorage.setItem('alreadyVisited', 'TRUE');
  }
}
