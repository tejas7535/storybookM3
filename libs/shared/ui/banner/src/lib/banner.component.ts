import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { BannerIconType } from '..';
import * as bannerActions from './store/actions/banner.actions';
import * as bannerSelectors from './store/selectors/banner.selectors';

@Component({
  selector: 'schaeffler-banner',
  templateUrl: 'banner.component.html',
})
export class BannerComponent implements OnInit {
  public showBanner$!: Observable<boolean>;
  public bannerText$!: Observable<string>;
  public bannerButtonText$!: Observable<string>;
  public bannerIcon$!: Observable<BannerIconType>;
  public truncateSize$!: Observable<number>;
  public showFullText$!: Observable<boolean>;

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.showBanner$ = this.store.select(bannerSelectors.getBannerOpen);
    this.bannerText$ = this.store.select(bannerSelectors.getBannerText);
    this.bannerButtonText$ = this.store.select(
      bannerSelectors.getBannerButtonText
    );
    this.bannerIcon$ = this.store.select(bannerSelectors.getBannerIcon);
    this.truncateSize$ = this.store.select(
      bannerSelectors.getBannerTruncateSize
    );
    this.showFullText$ = this.store.select(
      bannerSelectors.getBannerIsFullTextShown
    );
  }

  public closeBanner(): void {
    this.store.dispatch(bannerActions.closeBanner());
  }

  public toggleFullText(): void {
    this.store.dispatch(bannerActions.toggleFullText());
  }
}
