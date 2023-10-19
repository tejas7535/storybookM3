import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LocalizationService } from '@gq/shared/ag-grid/services';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ColumnDefinitionService } from './config/column-definition.service';
import { ReferencePricingTableComponent } from './reference-pricing-table.component';

describe('ReferencePricingTableComponent', () => {
  let component: ReferencePricingTableComponent;
  let spectator: Spectator<ReferencePricingTableComponent>;

  const createComponent = createComponentFactory({
    component: ReferencePricingTableComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    providers: [
      MockProvider(LocalizationService),
      MockProvider(ColumnDefinitionService),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    test('should call init', () => {
      component['agGridStateService'].init = jest.fn();
      component.ngOnInit();
      expect(component['agGridStateService'].init).toHaveBeenCalledTimes(1);
    });
  });

  describe('onGridReady', () => {
    test('should set columnState', () => {
      const event = {
        columnApi: {
          applyColumnState: jest.fn(),
        },
        api: {
          sizeColumnsToFit: jest.fn(),
        },
      } as any;

      component['agGridStateService'].getColumnStateForCurrentView = jest
        .fn()
        .mockReturnValueOnce('test');
      component.onGridReady(event);

      expect(event.columnApi.applyColumnState).toHaveBeenCalledTimes(1);
      expect(event.api.sizeColumnsToFit).toHaveBeenCalledTimes(1);
    });
  });

  describe('onColumnChange', () => {
    test('should set column state', () => {
      const event = {
        columnApi: {
          getColumnState: jest.fn(),
        },
      } as any;
      component['agGridStateService'].setColumnStateForCurrentView = jest.fn();
      component.onColumnChange(event);

      expect(
        component['agGridStateService'].setColumnStateForCurrentView
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('comparableMaterialClicked', () => {
    test('should emit value', () => {
      component.comparedMaterialClicked.emit = jest.fn();
      component.comparableMaterialClicked('test');

      expect(component.comparedMaterialClicked.emit).toHaveBeenCalledTimes(1);
    });
  });
});
