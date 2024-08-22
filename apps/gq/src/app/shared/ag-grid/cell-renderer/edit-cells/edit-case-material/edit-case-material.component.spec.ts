import { CommonModule } from '@angular/common';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { of } from 'rxjs';

import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { AutoCompleteFacade } from '@gq/core/store/facades';
import { ProcessCaseFacade } from '@gq/core/store/process-case';
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { ICellRendererParams } from 'ag-grid-community';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MATERIAL_TABLE_ITEM_MOCK } from '../../../../../../testing/mocks';
import { AutocompleteRequestDialog } from '../../../../components/autocomplete-input/autocomplete-request-dialog.enum';
import { EditingMaterialModalComponent } from '../../../../components/modal/editing-material-modal/editing-material-modal.component';
import { MaterialTableItem } from '../../../../models/table';
import { MaterialColumnFields } from '../../../constants/column-fields.enum';
import { EditCaseMaterialComponent } from './edit-case-material.component';

describe('EditCaseMaterialComponent', () => {
  let component: EditCaseMaterialComponent;
  let spectator: Spectator<EditCaseMaterialComponent>;
  let matDialogSpyObject: SpyObject<MatDialog>;

  const createComponent = createComponentFactory({
    component: EditCaseMaterialComponent,
    imports: [
      MatIconModule,
      CommonModule,
      MatDialogModule,
      provideTranslocoTestingModule({}),
    ],
    providers: [
      MockProvider(AutoCompleteFacade, {
        initFacade: jest.fn(),
        resetAutocompleteMaterials: jest.fn(),
      }),
      MockProvider(CreateCaseFacade, {
        validateMaterialsOnCustomerAndSalesOrg: jest.fn(),
        updateRowDataItem: jest.fn(),
      }),
      MockProvider(ProcessCaseFacade, {
        validateMaterialTableItems: jest.fn(),
        updateItemFromMaterialTable: jest.fn(),
      }),
      provideMockStore({}),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    mocks: [MatDialog],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    matDialogSpyObject = spectator.inject(MatDialog);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set params and cellValue', () => {
      const params = {
        value: 'test',
      } as any as ICellRendererParams;
      component.getValueToDisplay = jest.fn(() => 'value');

      component.agInit(params);

      expect(component.params).toEqual(params);
      expect(component.cellValue).toEqual('value');
    });
  });

  describe('refresh', () => {
    test('should return true and setCellValue', () => {
      component.cellValue = 'currentCellValue';
      const newValue = 'newValue';

      const params = { value: newValue };

      const result = component.refresh(params as any);

      expect(component.cellValue).toEqual(newValue);
      expect(result).toBeTruthy();
    });
  });

  describe('getValueToDisplay', () => {
    test('should return valueFormatted', () => {
      const params = { valueFormatted: 'valueFormatted', value: 'value' };

      const result = component.getValueToDisplay(params as any);

      expect(result).toEqual(params.valueFormatted);
    });
    test('should return value', () => {
      const params = { valueFormatted: undefined as any, value: 'value' };

      const result = component.getValueToDisplay(params as any);

      expect(result).toEqual(params.value);
    });
  });

  describe('onIconClick', () => {
    beforeEach(() => {
      matDialogSpyObject.open.andReturn({
        afterClosed: jest.fn(() => of(MATERIAL_TABLE_ITEM_MOCK)),
      });

      component.params = {
        colDef: {
          field: MaterialColumnFields.MATERIAL,
        },
        data: MATERIAL_TABLE_ITEM_MOCK,
      } as any;
    });
    test('should open dialog', () => {
      component.onIconClick();

      expect(matDialogSpyObject.open).toHaveBeenCalledWith(
        EditingMaterialModalComponent,
        {
          width: '660px',
          data: {
            material: MATERIAL_TABLE_ITEM_MOCK,
            field: MaterialColumnFields.MATERIAL,
          },
          autoFocus: false,
        }
      );
    });
    test('should dispatch actions afterClosed', () => {
      component.checkValidationNeeded = jest.fn();

      component.onIconClick();

      expect(component.checkValidationNeeded).toHaveBeenCalled();
      expect(
        component['autoCompleteFacade'].resetAutocompleteMaterials
      ).toHaveBeenCalled();
      expect(component['autoCompleteFacade'].initFacade).toHaveBeenCalledWith(
        AutocompleteRequestDialog.ADD_ENTRY
      );
    });
    test('should initAutoCompleteFacade with CREATE_CASE', () => {
      component.isCaseView = true;
      component.newCaseCreation = true;
      component.onIconClick();

      expect(component['autoCompleteFacade'].initFacade).toHaveBeenCalledWith(
        AutocompleteRequestDialog.CREATE_CASE
      );
    });
  });

  describe('checkValidationNeeded', () => {
    test('should call method with validation', () => {
      component.dispatchUpdateActionAndValidationAction = jest.fn();
      component.dispatchUpdateAction = jest.fn();
      const previousData: MaterialTableItem = {
        id: 1,
        materialDescription: 'desc',
      } as MaterialTableItem;
      const recentData: MaterialTableItem = {
        id: 1,
        materialDescription: 'descUpdated',
      } as MaterialTableItem;
      component.checkValidationNeeded(previousData, recentData);
      expect(
        component.dispatchUpdateActionAndValidationAction
      ).toHaveBeenCalled();
      expect(component.dispatchUpdateAction).not.toHaveBeenCalled();
    });
    test('should call method without validation', () => {
      component.dispatchUpdateActionAndValidationAction = jest.fn();
      component.dispatchUpdateAction = jest.fn();
      const previousData: MaterialTableItem = {
        id: 1,
        quantity: 150,
      } as MaterialTableItem;
      const recentData: MaterialTableItem = {
        id: 1,
        quantity: 100,
      } as MaterialTableItem;
      component.checkValidationNeeded(previousData, recentData);
      expect(
        component.dispatchUpdateActionAndValidationAction
      ).not.toHaveBeenCalled();
      expect(component.dispatchUpdateAction).toHaveBeenCalled();
    });
  });
  describe('dispatchUpdateAction', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    test('should dispatch updateAction for createCase', () => {
      component.isCaseView = true;
      const recentData: MaterialTableItem = {
        id: 1,
        quantity: 100,
      } as MaterialTableItem;
      component.dispatchUpdateAction(recentData);

      expect(
        component['createCaseFacade'].updateRowDataItem
      ).toHaveBeenCalledWith(recentData, false);
      expect(
        component['processCaseFacade'].updateItemFromMaterialTable
      ).not.toHaveBeenCalled();
    });
    test('should dispatch updateAction for createCase with revalidate true', () => {
      component.isCaseView = true;
      const recentData: MaterialTableItem = {
        id: 1,
        quantity: 100,
      } as MaterialTableItem;
      component.dispatchUpdateAction(recentData, true);

      expect(
        component['createCaseFacade'].updateRowDataItem
      ).toHaveBeenCalledWith(recentData, true);
      expect(
        component['processCaseFacade'].updateItemFromMaterialTable
      ).not.toHaveBeenCalled();
    });
    test('should dispatch updateAction for processCase', () => {
      component.isCaseView = false;
      const recentData: MaterialTableItem = {
        id: 1,
        quantity: 100,
      } as MaterialTableItem;
      component.dispatchUpdateAction(recentData);

      expect(
        component['createCaseFacade'].updateRowDataItem
      ).not.toHaveBeenCalled();
      expect(
        component['processCaseFacade'].updateItemFromMaterialTable
      ).toHaveBeenCalledWith(recentData, false);
    });

    test('should dispatch updateAction for processCase and revalidate true', () => {
      component.isCaseView = false;
      const recentData: MaterialTableItem = {
        id: 1,
        quantity: 100,
      } as MaterialTableItem;
      component.dispatchUpdateAction(recentData, true);

      expect(
        component['createCaseFacade'].updateRowDataItem
      ).not.toHaveBeenCalled();
      expect(
        component['processCaseFacade'].updateItemFromMaterialTable
      ).toHaveBeenCalledWith(recentData, true);
    });
  });

  describe('dispatchUpdateActionAndValidationAction', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    test('should dispatch the actions for createCase', () => {
      component.isCaseView = true;
      const recentData: MaterialTableItem = {
        id: 1,
        quantity: 100,
      } as MaterialTableItem;
      component.dispatchUpdateAction = jest.fn();

      component.dispatchUpdateActionAndValidationAction(recentData);
      expect(component.dispatchUpdateAction).toHaveBeenCalledWith(
        recentData,
        true
      );

      expect(
        component['createCaseFacade'].validateMaterialsOnCustomerAndSalesOrg
      ).toHaveBeenCalled();
      expect(
        component['processCaseFacade'].validateMaterialTableItems
      ).not.toHaveBeenCalled();
    });
    test('should dispatch the actions for processCase', () => {
      component.isCaseView = false;
      const recentData: MaterialTableItem = {
        id: 1,
        quantity: 100,
      } as MaterialTableItem;
      component.dispatchUpdateAction = jest.fn();

      component.dispatchUpdateActionAndValidationAction(recentData);

      expect(component.dispatchUpdateAction).toHaveBeenCalledWith(
        recentData,
        true
      );
      expect(
        component['createCaseFacade'].validateMaterialsOnCustomerAndSalesOrg
      ).not.toHaveBeenCalled();
      expect(
        component['processCaseFacade'].validateMaterialTableItems
      ).toHaveBeenCalled();
    });
  });
});
