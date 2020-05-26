import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { select, Store } from '@ngrx/store';

import { getBannerOpen, openBanner } from '@schaeffler/banner';

import { LTPState } from '../../core/store';

@Component({
  selector: 'ltp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public isBannerShown$: Observable<boolean>;

  constructor(private readonly store: Store<LTPState>) {}

  public ngOnInit(): void {
    this.isBannerShown$ = this.store.pipe(select(getBannerOpen));

    this.openBanner();
  }

  public openBanner(): void {
    this.store.dispatch(
      openBanner({
        text: translate('disclaimer'),
        buttonText: translate('disclaimerClose'),
        icon: 'info',
        truncateSize: 0,
      })
    );
  }
}
