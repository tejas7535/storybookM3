import { of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { SqvCheckSourcePipe } from '@gq/shared/pipes/sqv-check-source/sqv-check-source.pipe';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_SQV_CHECK_MOCK } from '../../../../../testing/mocks/models/quotation-detail/rfq/quotation-detail-sqv-check.mock';
import { SqvCostReferenceComponent } from './sqv-cost-reference.component';

describe('SqvCostReferenceComponent', () => {
  let component: SqvCostReferenceComponent;
  let spectator: Spectator<SqvCostReferenceComponent>;

  const createComponent = createComponentFactory({
    component: SqvCostReferenceComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      SharedPipesModule,
      SqvCheckSourcePipe,
    ],
    providers: [
      MockProvider(ActiveCaseFacade, {
        quotationCurrency$: of('EUR'),
        quotationSapId$: of('12345'),
        selectedQuotationDetailSqvCheck$: of(QUOTATION_DETAIL_SQV_CHECK_MOCK),
      }),
    ],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
