import { CommonModule } from '@angular/common';
import { Component, inject, input, InputSignal } from '@angular/core';

import { Observable } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { InfoBannerComponent } from '@gq/shared/components/info-banner/info-banner.component';
import { QuotationDetail } from '@gq/shared/models';
import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { LetDirective } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { RecalculationDataItemComponent } from './recalculation-data-item/recalculation-data-item.component';

@Component({
  selector: 'gq-recalculation-data',
  templateUrl: './recalculation-data.component.html',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    RecalculationDataItemComponent,
    SharedPipesModule,
    LetDirective,
    InfoBannerComponent,
  ],
})
export class RecalculationDataComponent {
  quotationDetail: InputSignal<QuotationDetail> = input(null);
  hasAssignee: InputSignal<boolean> = input(true);
  // Can properly be removed when the implementation process is finished
  rfq4Status: InputSignal<Rfq4Status> = input(null as Rfq4Status);

  private readonly activeCaseFacade: ActiveCaseFacade =
    inject(ActiveCaseFacade);
  quotationCurrency$: Observable<string> =
    this.activeCaseFacade.quotationCurrency$;

  readonly rfq4StatusEnum = Rfq4Status;
}
