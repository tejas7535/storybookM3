import { Component } from '@angular/core';

import { Store } from '@ngrx/store';

import { BannerState } from '../store/reducers/banner/banner.reducer';

import { BannerContent } from '../banner-content';

@Component({
  selector: 'schaeffler-banner-text',
  templateUrl: './banner-text.component.html',
  styleUrls: ['./banner-text.component.scss']
})
export class BannerTextComponent extends BannerContent {
  constructor(private readonly bannerStore: Store<BannerState>) {
    super(bannerStore);
  }
}
