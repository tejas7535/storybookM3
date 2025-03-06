import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { QuotationDetailCosts } from '@gq/shared/models/quotation-detail/cost';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { SqvCheckSourcePipe } from '@gq/shared/pipes/sqv-check-source/sqv-check-source.pipe';
import { TRANSLOCO_SCOPE } from '@jsverse/transloco';
import { LetDirective } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-sqv-cost-reference',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    LetDirective,
    SharedPipesModule,
    SqvCheckSourcePipe,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'detail-view' }],
  templateUrl: './sqv-cost-reference.component.html',
})
export class SqvCostReferenceComponent {
  activeCaseFacade = inject(ActiveCaseFacade);

  detailCosts$: Observable<QuotationDetailCosts> =
    this.activeCaseFacade.selectedQuotationDetailCosts$;

  currency$: Observable<string> = this.activeCaseFacade.quotationCurrency$;
}
