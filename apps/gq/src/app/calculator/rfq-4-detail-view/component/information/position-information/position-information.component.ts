import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';

import { KpiStatusCardComponent } from '@gq/shared/components/kpi-status-card/kpi-status-card.component';
import { LabelTextModule } from '@gq/shared/components/label-text/label-text.module';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  CalculatorQuotationDetailData,
  CalculatorRfq4ProcessData,
} from '../../../models/rfq-4-detail-view-data.interface';
import { Rfq4DetailViewStore } from '../../../store/rfq-4-detail-view.store';

@Component({
  selector: 'gq-rfq-4-detail-view-position-information',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    KpiStatusCardComponent,
    LabelTextModule,
    SharedPipesModule,
  ],
  templateUrl: './position-information.component.html',
})
export class PositionInformationComponent {
  private readonly store = inject(Rfq4DetailViewStore);

  positionInformation: Signal<CalculatorQuotationDetailData> =
    this.store.getQuotationDetailData;
  rfq4ProcessData: Signal<CalculatorRfq4ProcessData> =
    this.store.getRfq4ProcessData;
}
