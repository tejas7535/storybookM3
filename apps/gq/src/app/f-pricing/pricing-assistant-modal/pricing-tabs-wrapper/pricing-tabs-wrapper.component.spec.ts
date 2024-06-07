import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

import { FPricingFacade } from '@gq/core/store/f-pricing/f-pricing.facade';
import { ComparableMaterialsRowData } from '@gq/core/store/reducers/transactions/models/f-pricing-comparable-materials.interface';
import { MarketValueDriverSelection } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver.selection';
import { MaterialToCompare } from '@gq/shared/models/f-pricing/material-to-compare.interface';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { TableItem } from '../models/table-item';
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
      const materialDescription = 'test';
      const materialNumber = '1234';
      component.referencePriceRowData = [
        {
          identifier: 200,
          isShowMoreRow: true,
          parentMaterialDescription: materialDescription,
          parentMaterialNumber: materialNumber,
        } as ComparableMaterialsRowData,
      ];
      const materialToCompare: MaterialToCompare = {
        description: materialDescription,
        number: materialNumber,
      };
      component.onComparedMaterialClicked(materialDescription);
      expect(component.comparedMaterialClicked.emit).toHaveBeenCalledWith(
        materialToCompare
      );
    });
  });

  describe('onTechnicalValueDriversChange', () => {
    test('should dispatch updateTechnicalValueDriver', () => {
      const changedValue = {
        id: 1,
        description: 'description',
        editableValue: 20,
        value: '20%',
        additionalDescription: 'additionalDescription',
      } as TableItem;

      component.fPricingFacade.updateTechnicalValueDriver = jest.fn();

      component.onTechnicalValueDriversChange(changedValue);
      expect(
        component.fPricingFacade.updateTechnicalValueDriver
      ).toHaveBeenCalledWith(changedValue);
    });
  });
  describe('marketValueDriverSelectionChanged', () => {
    test('should fPricingFacade be called', () => {
      const selection: MarketValueDriverSelection = {
        questionId: 1,
        selectedOptionId: 1,
        surcharge: 10,
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
  describe('selectedTabChanged', () => {
    test('Should emit marketValueDriverTabActivated', () => {
      const tabChangedEvent = {
        index: 2,
      } as unknown as MatTabChangeEvent;

      component.marketValueDriverTabActivated.emit = jest.fn();

      component.selectedTabChanged(tabChangedEvent);
      expect(component.marketValueDriverTabActivated.emit).toHaveBeenCalled();
    });

    test('should not emit marketValueDriverTabActivated', () => {
      const tabChangedEvent = {
        index: 1,
      } as unknown as MatTabChangeEvent;

      component.marketValueDriverTabActivated.emit = jest.fn();

      component.selectedTabChanged(tabChangedEvent);
      expect(
        component.marketValueDriverTabActivated.emit
      ).not.toHaveBeenCalled();
    });
  });
});
