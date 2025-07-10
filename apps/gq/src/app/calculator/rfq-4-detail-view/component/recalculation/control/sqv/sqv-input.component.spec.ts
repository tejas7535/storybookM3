import { signal } from '@angular/core';
import {
  FormBuilder,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';

import { of } from 'rxjs';

import { Rfq4DetailViewStore } from '@gq/calculator/rfq-4-detail-view/store/rfq-4-detail-view.store';
import { CurrencyFacade } from '@gq/core/store/currency/currency.facade';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CALCULATOR_RFQ_4_PROCESS_DATA_MOCK } from '../../../../../../../testing/mocks/models/calculator/rfq-4-detail-view/rfq-4-detail-view-data.mock';
import { SqvInputComponent } from './sqv-input.component';

describe('SqvInputComponent', () => {
  let component: SqvInputComponent;
  let spectator: Spectator<SqvInputComponent>;
  const fb = new FormBuilder();

  const formGroupDirective = new FormGroupDirective([], []);
  formGroupDirective.form = fb.group({
    test: fb.control(null),
  });

  const createComponent = createComponentFactory({
    component: SqvInputComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), ReactiveFormsModule],
    providers: [
      MockProvider(TranslocoLocaleService),
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
          getRfq4ProcessData: signal(CALCULATOR_RFQ_4_PROCESS_DATA_MOCK),
          exchangeRateForSelectedCurrency: signal('EUR'),
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
