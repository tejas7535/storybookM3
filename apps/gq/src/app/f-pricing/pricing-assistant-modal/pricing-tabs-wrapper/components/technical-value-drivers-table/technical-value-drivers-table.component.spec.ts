import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { TechnicalValueDriversTableComponent } from './technical-value-drivers-table.component';

describe('TechnicalValueDriversTableComponent', () => {
  let component: TechnicalValueDriversTableComponent;
  let spectator: Spectator<TechnicalValueDriversTableComponent>;

  const createComponent = createComponentFactory({
    component: TechnicalValueDriversTableComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onTechnicalValueDriversValueChange', () => {
    it('should emit the changes', () => {
      const changedValue = 10;
      const id = 1;
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
      const emittedData = [
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
      component.technicalValueDriversChange.emit = jest.fn();

      component.dataSource = dataSource;

      component.onTechnicalValueDriversValueChange(changedValue, id);
      expect(component.technicalValueDriversChange.emit).toHaveBeenCalledWith(
        emittedData
      );
    });
  });
});
