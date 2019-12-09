import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BannerContent, BannerState } from '@schaeffler/shared/ui-components';

@Component({
  selector: 'schaeffler-custom-banner',
  templateUrl: './custom-banner.component.html',
  styleUrls: ['./custom-banner.component.scss']
})
export class CustomBannerComponent extends BannerContent {
  constructor(private readonly bannerStore: Store<BannerState>) {
    super(bannerStore);
  }
}
