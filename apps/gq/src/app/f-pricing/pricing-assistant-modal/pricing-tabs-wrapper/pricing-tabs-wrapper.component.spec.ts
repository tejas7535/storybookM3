import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

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
});
