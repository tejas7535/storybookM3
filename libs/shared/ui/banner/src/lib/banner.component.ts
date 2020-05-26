import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { select, Store } from '@ngrx/store';

import * as bannerActions from './store/actions/banner.actions';
import { BannerState } from './store/reducers/banner.reducer';
import * as bannerSelectors from './store/selectors/banner.selectors';

export const loader = ['en', 'de'].reduce((acc: any, lang: string) => {
  acc[lang] = () => import(`./i18n/${lang}.json`);

  return acc;
}, {});

@Component({
  selector: 'schaeffler-banner',
  templateUrl: 'banner.component.html',
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        loader,
        scope: 'banner',
      },
    },
  ],
})
export class BannerComponent implements OnInit {
  public showBanner$: Observable<boolean>;
  public bannerText$: Observable<string>;
  public bannerButtonText$: Observable<string>;
  public bannerIcon$: Observable<string>;
  public truncateSize$: Observable<number>;
  public showFullText$: Observable<boolean>;

  constructor(private readonly store: Store<BannerState>) {}

  public ngOnInit(): void {
    this.showBanner$ = this.store.pipe(select(bannerSelectors.getBannerOpen));
    this.bannerText$ = this.store.pipe(select(bannerSelectors.getBannerText));
    this.bannerButtonText$ = this.store.pipe(
      select(bannerSelectors.getBannerButtonText)
    );
    this.bannerIcon$ = this.store.pipe(select(bannerSelectors.getBannerIcon));
    this.truncateSize$ = this.store.pipe(
      select(bannerSelectors.getBannerTruncateSize)
    );
    this.showFullText$ = this.store.pipe(
      select(bannerSelectors.getBannerIsFullTextShown)
    );
  }

  public closeBanner(): void {
    this.store.dispatch(bannerActions.closeBanner());
  }

  public toggleFullText(): void {
    this.store.dispatch(bannerActions.toggleFullText());
  }
}
