import {
  FormBuilder,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';

import { of } from 'rxjs';

import { CurrencyFacade } from '@gq/core/store/currency/currency.facade';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PriceUnitInputComponent } from '../price-unit/price-unit-input.component';
import { ToolCostInputComponent } from './tool-cost-input.component';

describe('ToolCostInputComponent', () => {
  let component: ToolCostInputComponent;
  let spectator: Spectator<ToolCostInputComponent>;
  const fb = new FormBuilder();

  const formGroupDirective = new FormGroupDirective([], []);
  formGroupDirective.form = fb.group({
    test: fb.control(null),
  });

  const createComponent = createComponentFactory({
    component: PriceUnitInputComponent,
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
