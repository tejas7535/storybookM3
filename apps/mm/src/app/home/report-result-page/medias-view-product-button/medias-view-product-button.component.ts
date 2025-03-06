import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { translate } from '@jsverse/transloco';
import { MobileFirebaseAnalyticsService } from '@mm/core/services/tracking/mobile-firebase-analytics/mobile-firebase-analytics.service';
import { MEDIASBEARING } from '@mm/core/services/tracking/tracking.constants';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { SharedTranslocoModule } from '@schaeffler/transloco';
@Component({
  selector: 'mm-medias-view-product-button',
  templateUrl: './medias-view-product-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedTranslocoModule, MatButtonModule, MatIconModule],
})
export class MediasViewProductButtonComponent {
  @Input() productId: string;

  public constructor(
    private readonly applicationInsightsService: ApplicationInsightsService,
    private readonly firebaseAnalyticsService: MobileFirebaseAnalyticsService
  ) {}

  public getProductMediasUrl(): string {
    return `${translate('reportResult.mediasBaseUrl')}/p/${
      this.productId
    }?utm_source=mounting-manager`;
  }

  public trackBearingSelection(): void {
    this.firebaseAnalyticsService.logOpenExternalLinkEvent(this.productId);
    this.applicationInsightsService.logEvent(MEDIASBEARING, {
      bearing: this.productId,
    });
  }
}
