import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';

import { KpiStatusCardComponent } from '@gq/shared/components/kpi-status-card/kpi-status-card.component';
import { LabelTextModule } from '@gq/shared/components/label-text/label-text.module';
import { ActiveDirectoryUser } from '@gq/shared/models';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { UndefinedToDashPipe } from '@gq/shared/pipes/undefined-to-dash/undefined-to-dash.pipe';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  CalculatorQuotationData,
  CalculatorRfq4ProcessData,
} from '../../../models/rfq-4-detail-view-data.interface';
import { Rfq4DetailViewStore } from '../../../store/rfq-4-detail-view.store';

@Component({
  selector: 'gq-rfq-4-detail-view-header-information',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    KpiStatusCardComponent,
    LabelTextModule,
    SharedPipesModule,
    UndefinedToDashPipe,
  ],
  templateUrl: './header-information.component.html',
})
export class HeaderInformationComponent {
  private readonly store = inject(Rfq4DetailViewStore);

  headerData: Signal<CalculatorQuotationData> = this.store.getQuotationData;
  rfq4ProcessData: Signal<CalculatorRfq4ProcessData> =
    this.store.getRfq4ProcessData;
  processStartedByAdUser: Signal<ActiveDirectoryUser> =
    this.store.processStartedByAdUser;
}
