import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { RolesFacade } from '@gq/core/store/facades';
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
      mockProvider(RolesFacade, {
        userHasSQVRole$: of(true),
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
