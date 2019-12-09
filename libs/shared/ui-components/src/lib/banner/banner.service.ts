import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { BannerContent } from './banner-content';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private readonly bannerComponent$: BehaviorSubject<{
    component: BannerContent;
  }> = new BehaviorSubject({
    component: undefined
  });

  /**
   * Sets the component to be displayed inside the banner
   *
   * @param component class to display inside the banner
   */
  public openBanner(component: BannerContent): void {
    this.bannerComponent$.next({ component });
  }

  /**
   * Gets Value of behaviorSubject
   */
  public get bannerComponent(): BehaviorSubject<{ component: BannerContent }> {
    return this.bannerComponent$;
  }
}
