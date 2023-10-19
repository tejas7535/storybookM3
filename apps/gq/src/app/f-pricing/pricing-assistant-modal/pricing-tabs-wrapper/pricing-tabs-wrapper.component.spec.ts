import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ComparableLinkedTransaction } from '@gq/core/store/reducers/models';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ReferenceDataToShow } from '../models/reference-data-to-show.enum';
import { PricingTabsWrapperComponent } from './pricing-tabs-wrapper.component';

describe('PricingTabsWrapperComponent', () => {
  let component: PricingTabsWrapperComponent;
  let spectator: Spectator<PricingTabsWrapperComponent>;

  const createComponent = createComponentFactory({
    component: PricingTabsWrapperComponent,
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

  describe('ngOnInit', () => {
    test('should set referenceDataToShow to noReferenceData', () => {
      component.ngOnInit();
      expect(component.referenceDataVisible).toEqual(
        ReferenceDataToShow.noReferenceData
      );
    });

    test('should set referenceDataToShow to referencePricingTable', () => {
      component.referencePriceRowData = [
        {} as ComparableLinkedTransaction,
      ] as ComparableLinkedTransaction[];
      component.ngOnInit();
      expect(component.referenceDataVisible).toEqual(
        ReferenceDataToShow.referencePricingTable
      );
    });
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
});
