import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of, Subject } from 'rxjs';

import {
  ColumnUtilityService,
  LocalizationService,
} from '@gq/shared/ag-grid/services';
import { BaseResultTableComponent } from '@gq/shared/components/global-search-bar/base-result-table/base-result-table.component';
import { UserSettingsService } from '@gq/shared/services/rest/user-settings/user-settings.service';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { FilterChangedEvent, GridReadyEvent } from 'ag-grid-enterprise';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ColumnDefinitionService } from '../config/column-definition-service';
import { CasesCriteriaSelection } from './cases-criteria-selection.enum';
import { CasesResultTableComponent } from './cases-result-table.component';
describe('CasesResultTableComponent', () => {
  let component: CasesResultTableComponent;
  let spectator: Spectator<CasesResultTableComponent>;

  const createComponent = createComponentFactory({
    component: CasesResultTableComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],

    providers: [
      MockProvider(ColumnDefinitionService, {
        CASES_TABLE_COLUMN_DEFS: [],
      }),
      MockProvider(LocalizationService, {
        locale$: jest.fn(),
      } as unknown),
      MockProvider(ColumnUtilityService),
      mockProvider(TranslocoLocaleService),
      mockProvider(UserSettingsService, {
        updateUserSetting: jest.fn(),
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    Object.defineProperty(component, 'agGridStateService', {
      value: { init: jest.fn(), saveUserSettings: jest.fn() },
    });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  test('should reset criteriaSelectedValue when resetInputs$ emits', () => {
    // Arrange
    const resetInputs$ = new Subject<void>();
    component.resetInputs$ = resetInputs$;
    component.criteriaSelectedValue = CasesCriteriaSelection.CUSTOMER_NAME;

    // Act
    component.ngOnInit();
    resetInputs$.next();

    // Assert
    expect(component.criteriaSelectedValue).toBe(CasesCriteriaSelection.GQ_ID);
  });

  describe('ngOnInit', () => {
    it('should initialize localeText$', () => {
      component.ngOnInit();
      expect(component.localeText$).toBeDefined();
    });

    it('should call agGridStateService.init', () => {
      const initSpy = jest.spyOn(component['agGridStateService'], 'init');
      component.ngOnInit();
      expect(initSpy).toHaveBeenCalledWith(component['TABLE_KEY']);
    });
    test('should emit criteriaSelectedValue', () => {
      component.criteriaSelectedValue = CasesCriteriaSelection.GQ_ID;
      const emitSpy = jest.spyOn(component.criteriaSelected, 'emit');
      component.ngOnInit();
      expect(emitSpy).toHaveBeenCalledWith(component.criteriaSelectedValue);
    });

    test('should subscribe to resetInputs$ and set criteriaSelectedValue', () => {
      const resetInputs$ = of();
      component.resetInputs$ = resetInputs$;
      component.criteriaSelectedValue = CasesCriteriaSelection.GQ_ID;
      component.ngOnInit();
      resetInputs$.subscribe(() => {
        expect(component.criteriaSelectedValue).toBe(
          CasesCriteriaSelection.GQ_ID
        );
        expect(component.criteriaSelected).toBeCalledWith(
          CasesCriteriaSelection.GQ_ID
        );
      });
    });
  });

  describe('radioButtonChanged', () => {
    test('should emit criteriaSelectedValue', () => {
      component.criteriaSelectedValue = CasesCriteriaSelection.GQ_ID;
      const emitSpy = jest.spyOn(component.criteriaSelected, 'emit');
      component.radioButtonChanged();
      expect(emitSpy).toHaveBeenCalledWith(component.criteriaSelectedValue);
    });
  });

  describe('ngOnDestroy', () => {
    test('should save userSettings', () => {
      component['agGridStateService'].saveUserSettings = jest.fn();

      component.ngOnDestroy();

      expect(
        component['agGridStateService'].saveUserSettings
      ).toHaveBeenCalled();
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
