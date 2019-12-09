import { OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { getBannerText } from './store';
import * as BannerActions from './store/actions';
import { BannerState } from './store/reducers/banner/banner.reducer';
import {
  getBannerButtonText,
  getBannerIsFullTextShown,
  getBannerTruncateSize
} from './store/selectors/banner/banner.selectors';

export class BannerContent implements OnInit, OnDestroy {
  text: string;
  truncateSize: number;
  buttonText: string;

  isFullTextShown: boolean;

  private readonly destroy$: Subject<boolean> = new Subject();

  constructor(private readonly store: Store<BannerState>) {}

  ngOnInit(): void {
    this.store
      .pipe(
        select(getBannerText),
        takeUntil(this.destroy$)
      )
      .subscribe(text => {
        this.text = text;
      });
    this.store
      .pipe(
        select(getBannerTruncateSize),
        takeUntil(this.destroy$)
      )
      .subscribe(truncateSize => {
        this.truncateSize = truncateSize;
      });
    this.store
      .pipe(
        select(getBannerButtonText),
        takeUntil(this.destroy$)
      )
      .subscribe(buttonText => {
        this.buttonText = buttonText;
      });
    this.store
      .pipe(
        select(getBannerIsFullTextShown),
        takeUntil(this.destroy$)
      )
      .subscribe(isFullTextShown => {
        this.isFullTextShown = isFullTextShown;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public closeBanner(): void {
    this.store.dispatch(BannerActions.closeBanner());
  }

  public toggleFullText(): void {
    this.store.dispatch(
      BannerActions.toggleFullText({ isFullTextShown: !this.isFullTextShown })
    );
  }
}
