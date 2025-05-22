import { signal } from '@angular/core';
import {
  FormBuilder,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';

import { of } from 'rxjs';

import { Rfq4DetailViewStore } from '@gq/calculator/rfq-4-detail-view/store/rfq-4-detail-view.store';
import { CurrencyFacade } from '@gq/core/store/currency/currency.facade';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CALCULATOR_QUOTATION_DATA_MOCK } from '../../../../../../../testing/mocks/models/calculator/rfq-4-detail-view/rfq-4-detail-view-data.mock';
import { CurrencyInputComponent } from './currency-input.component';

describe('CurrencyInputComponent', () => {
  let component: CurrencyInputComponent;
  let spectator: Spectator<CurrencyInputComponent>;
  const fb = new FormBuilder();

  const formGroupDirective = new FormGroupDirective([], []);
  formGroupDirective.form = fb.group({
    test: fb.control(null),
  });

  const createComponent = createComponentFactory({
    component: CurrencyInputComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), ReactiveFormsModule],
    providers: [
      {
        provide: FormGroupDirective,
        useValue: formGroupDirective,
      },
      {
        provide: CurrencyFacade,
        useValue: {
          availableCurrencies$: of(['EUR']),
        },
      },
      {
        provide: Rfq4DetailViewStore,
        useValue: {
          getQuotationData: signal(CALCULATOR_QUOTATION_DATA_MOCK),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        formControlName: 'test',
      },
    });
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
