import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';

import { RolesFacade } from '@gq/core/store/facades';
import { LocalizationService } from '@gq/shared/ag-grid/services/localization.service';
import { BaseResultTableComponent } from '@gq/shared/components/global-search-bar/base-result-table.component';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import {
  FilterChangedEvent,
  GridReadyEvent,
} from 'ag-grid-community/dist/lib/events';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ColumnDefinitionService } from '../config/column-definition-service';
import { ColumnUtilityService } from '../config/column-utility.service';
import { MaterialsCriteriaSelection } from './material-criteria-selection.enum';
import { MaterialsResultTableComponent } from './materials-result-table.component';

describe('CasesResultTableComponent', () => {
  let component: MaterialsResultTableComponent;
  let spectator: Spectator<MaterialsResultTableComponent>;

  const createComponent = createComponentFactory({
    component: MaterialsResultTableComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    providers: [
      MockProvider(ColumnDefinitionService, {
        MATERIALS_TABLE_COLUMN_DEFS: [],
      }),
      MockProvider(LocalizationService, {
        locale$: jest.fn(),
      } as unknown),
      MockProvider(ColumnUtilityService),
      MockProvider(RolesFacade, {
        userHasGPCRole$: of(true),
      }),
      mockProvider(TranslocoLocaleService),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize localeText$', () => {
      expect(component.localeText$).toBeDefined();
    });

    it('should call agGridStateService.init', () => {
      const initSpy = jest.spyOn(component['agGridStateService'], 'init');
      component.ngOnInit();
      expect(initSpy).toHaveBeenCalledWith(component['TABLE_KEY']);
    });
    it('should emit criteriaSelectedValue', () => {
      component.criteriaSelectedValue =
        MaterialsCriteriaSelection.MATERIAL_NUMBER;
      const emitSpy = jest.spyOn(component.criteriaSelected, 'emit');
      component.ngOnInit();
      expect(emitSpy).toHaveBeenCalledWith(component.criteriaSelectedValue);
    });
  });

  describe('radioButtonChanged', () => {
    it('should emit criteriaSelectedValue', () => {
      component.criteriaSelectedValue =
        MaterialsCriteriaSelection.MATERIAL_NUMBER;
      const emitSpy = jest.spyOn(component.criteriaSelected, 'emit');
      component.radioButtonChanged();
      expect(emitSpy).toHaveBeenCalledWith(component.criteriaSelectedValue);
    });
  });

  describe('onGridReady', () => {
    test('should call base class onGridReady method', () => {
      const onGridReady = jest.spyOn(
        BaseResultTableComponent.prototype,
        'onGridReady'
      );
      onGridReady.mockImplementationOnce(() => {});
      component.onGridReady({} as GridReadyEvent);
      expect(onGridReady).toHaveBeenCalled();
    });
  });

  describe('onFilterChanged', () => {
    test('should call base class onFilterChanged method', () => {
      const onFilterChanged = jest.spyOn(
        BaseResultTableComponent.prototype,
        'onFilterChanged'
      );
      onFilterChanged.mockImplementationOnce(() => {});
      component.onFilterChanged({} as FilterChangedEvent);
      expect(onFilterChanged).toHaveBeenCalled();
    });
  });
});
