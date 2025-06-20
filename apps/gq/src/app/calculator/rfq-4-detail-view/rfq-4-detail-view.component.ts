import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { CurrencyModule } from '@gq/core/store/currency/currency.module';
import { provideTranslocoScope } from '@jsverse/transloco';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { Rfq4DetailViewHeaderComponent } from './component/header/rfq-4-detail-view-header.component';
import { InformationComponent } from './component/information/information.component';
import { RecalculationComponent } from './component/recalculation/recalculation.component';
import { Rfq4DetailViewStore } from './store/rfq-4-detail-view.store';
@Component({
  selector: 'gq-rfq-4-detail-view',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    Rfq4DetailViewHeaderComponent,
    InformationComponent,
    RecalculationComponent,
    CurrencyModule,
    LoadingSpinnerModule,
  ],
  providers: [provideTranslocoScope('calculator'), Rfq4DetailViewStore],
  templateUrl: './rfq-4-detail-view.component.html',
})
export class Rfq4DetailViewComponent {
  private readonly store = inject(Rfq4DetailViewStore);

  loading = this.store.rfq4DetailViewDataLoading;
}
