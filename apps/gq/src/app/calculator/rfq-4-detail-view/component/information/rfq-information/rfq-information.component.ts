import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';

import { CalculatorRfq4ProcessData } from '@gq/calculator/rfq-4-detail-view/models/rfq-4-detail-view-data.interface';
import { Rfq4DetailViewStore } from '@gq/calculator/rfq-4-detail-view/store/rfq-4-detail-view.store';
import { KpiStatusCardComponent } from '@gq/shared/components/kpi-status-card/kpi-status-card.component';
import { LabelTextModule } from '@gq/shared/components/label-text/label-text.module';
import { ActiveDirectoryUser } from '@gq/shared/models/user.model';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-rfq-4-detail-view-rfq-information',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    LabelTextModule,
    KpiStatusCardComponent,
    SharedPipesModule,
  ],
  templateUrl: './rfq-information.component.html',
})
export class RfqInformationComponent {
  private readonly store = inject(Rfq4DetailViewStore);
  rfq4ProcessData: Signal<CalculatorRfq4ProcessData> =
    this.store.getRfq4ProcessData;
  processConfirmedByAdUser: Signal<ActiveDirectoryUser> =
    this.store.processConfirmedByAdUser;
}
