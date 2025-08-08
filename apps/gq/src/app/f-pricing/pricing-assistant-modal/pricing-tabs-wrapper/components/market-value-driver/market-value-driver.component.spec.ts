import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { MarketValueDriverSelection } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver.selection';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MarketValueDriverComponent } from './market-value-driver.component';

describe('MarketValueDriverComponent', () => {
  let component: MarketValueDriverComponent;
  let spectator: Spectator<MarketValueDriverComponent>;

  const createComponent = createComponentFactory({
    component: MarketValueDriverComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onOptionChange', () => {
    test('should emit questionsSelectionChanged', () => {
      const selection: MarketValueDriverSelection = {
        questionId: 1,
        selectedOptionId: 1,
        surcharge: 10,
      };
      component.questionsSelectionChanged.emit = jest.fn();
      component.onOptionChange(selection);
      expect(component.questionsSelectionChanged.emit).toHaveBeenCalledWith(
        selection
      );
    });
  });
});
