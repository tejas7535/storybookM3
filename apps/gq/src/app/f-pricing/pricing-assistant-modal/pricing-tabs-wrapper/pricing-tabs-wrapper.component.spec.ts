import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FPricingFacade } from '@gq/core/store/f-pricing/f-pricing.facade';
import { MarketValueDriverSelection } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver.selection';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PricingTabsWrapperComponent } from './pricing-tabs-wrapper.component';

describe('PricingTabsWrapperComponent', () => {
  let component: PricingTabsWrapperComponent;
  let spectator: Spectator<PricingTabsWrapperComponent>;

  const createComponent = createComponentFactory({
    component: PricingTabsWrapperComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [MockProvider(FPricingFacade)],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onComparedMaterialClicked', () => {
    test('should emit comparedMaterialClicked', () => {
      component.comparedMaterialClicked.emit = jest.fn();
      component.onComparedMaterialClicked('test');
      expect(component.comparedMaterialClicked.emit).toHaveBeenCalledWith(
        'test'
      );
    });
  });

  describe('onTechnicalValueDriversChange', () => {
    test('should update the dataSource for tech Value drivers', () => {
      const dataSource = [
        {
          id: 1,
          description: 'description',
          editableValue: 20,
          value: '20%',
          additionalDescription: 'additionalDescription',
        },
        {
          id: 2,
          description: 'description',
          editableValue: 20,
          value: '20%',
          additionalDescription: 'additionalDescription',
        },
      ];
      const changedDataSource = [
        {
          id: 1,
          description: 'description',
          editableValue: 10,
          value: '20%',
          additionalDescription: 'additionalDescription',
        },
        {
          id: 2,
          description: 'description',
          editableValue: 20,
          value: '20%',
          additionalDescription: 'additionalDescription',
        },
      ];
      component.techValueDriverDataSource = dataSource;
      component.onTechnicalValueDriversChange(changedDataSource);
      expect(component.techValueDriverDataSource).toEqual(changedDataSource);
    });
  });
  describe('marketValueDriverSelectionChanged', () => {
    test('should fPricingFacade be called', () => {
      const selection: MarketValueDriverSelection = {
        questionId: 1,
        selectedOptionId: 1,
      };

      const facadeMock: FPricingFacade = {
        setMarketValueDriverSelection: jest.fn(),
      } as unknown as FPricingFacade;

      Object.defineProperty(component, 'fPricingFacade', {
        value: facadeMock,
      });

      component.marketValueDriverSelectionChanged(selection);
      expect(
        component.fPricingFacade.setMarketValueDriverSelection
      ).toHaveBeenCalledWith(selection);
    });
  });
});
