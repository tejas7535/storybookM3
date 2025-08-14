import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../../../../../testing/mocks/models/quotation-detail/quotation-details.mock';
import { RecalculationDataComponent } from './recalculation-data.component';

describe('RecalculationDataComponent', () => {
  let component: RecalculationDataComponent;
  let spectator: Spectator<RecalculationDataComponent>;

  const createComponent = createComponentFactory({
    component: RecalculationDataComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      mockProvider(ActiveCaseFacade, {
        quotationCurrency$: jest.fn(() => 'EUR'),
      }),
    ],
    detectChanges: false,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.setInput('quotationDetail', QUOTATION_DETAIL_MOCK);
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
