import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { NumberCurrencyPipe } from '@gq/shared/pipes/number-currency/number-currency.pipe';
import { PercentagePipe } from '@gq/shared/pipes/percentage/percentage.pipe';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PriceButtonComponent } from './price-button.component';

describe('PriceButtonComponent', () => {
  let component: PriceButtonComponent;
  let spectator: Spectator<PriceButtonComponent>;

  const createComponent = createComponentFactory({
    component: PriceButtonComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    declarations: [MockPipe(NumberCurrencyPipe), MockPipe(PercentagePipe)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
