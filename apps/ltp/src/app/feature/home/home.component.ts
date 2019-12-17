import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import {
  BannerTextComponent,
  getBannerOpen,
  openBanner
} from '@schaeffler/shared/ui-components';

import { LTPState } from '../../core/store';

@Component({
  selector: 'ltp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
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
        component: BannerTextComponent,
        text: 'disclaimer',
        buttonText: 'disclaimerClose',
        truncateSize: 0
      })
    );
  }
}
