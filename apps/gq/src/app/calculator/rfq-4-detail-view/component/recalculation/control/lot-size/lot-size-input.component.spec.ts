import {
  FormBuilder,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';

import { of } from 'rxjs';

import { CurrencyFacade } from '@gq/core/store/currency/currency.facade';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { LotSizeInputComponent } from './lot-size-input.component';

describe('LotSizeInputComponent', () => {
  let component: LotSizeInputComponent;
  let spectator: Spectator<LotSizeInputComponent>;
  const fb = new FormBuilder();

  const formGroupDirective = new FormGroupDirective([], []);
  formGroupDirective.form = fb.group({
    test: fb.control(null),
  });

  const createComponent = createComponentFactory({
    component: LotSizeInputComponent,
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
