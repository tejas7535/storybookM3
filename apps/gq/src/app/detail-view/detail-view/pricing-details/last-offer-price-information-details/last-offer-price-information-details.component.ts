import { Component, computed, input } from '@angular/core';

import { KpiStatusCardComponent } from '@gq/shared/components/kpi-status-card/kpi-status-card.component';
import { LabelTextModule } from '@gq/shared/components/label-text/label-text.module';
import { QuotationDetail } from '@gq/shared/models';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { UndefinedToDashPipe } from '@gq/shared/pipes/undefined-to-dash/undefined-to-dash.pipe';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-last-offer-price-information-details',
  templateUrl: './last-offer-price-information-details.component.html',
  imports: [
    KpiStatusCardComponent,
    LabelTextModule,
    SharedPipesModule,
    SharedTranslocoModule,
    UndefinedToDashPipe,
  ],
})
export class LastOfferPriceInformationDetailsComponent {
  readonly quotationDetail = input<QuotationDetail>();
  readonly currency = input<string>();

  readonly lastOfferDetail = computed(
    () => this.quotationDetail().lastOfferDetail
  );
}
