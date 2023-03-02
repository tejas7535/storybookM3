import { CommonModule } from '@angular/common';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { of } from 'rxjs';

import {
  resetAutocompleteMaterials,
  setRequestingAutoCompleteDialog,
  updateMaterialRowDataItem,
  updateRowDataItem,
} from '@gq/core/store/actions';
import { Spectator, SpyObject } from '@ngneat/spectator';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { ICellRendererParams } from 'ag-grid-community';

import { MATERIAL_TABLE_ITEM_MOCK } from '../../../../../../testing/mocks';
import { AutocompleteRequestDialog } from '../../../../components/autocomplete-input/autocomplete-request-dialog.enum';
import { EditingMaterialModalComponent } from '../../../../components/modal/editing-material-modal/editing-material-modal.component';
import { MaterialColumnFields } from '../../../constants/column-fields.enum';
import { EditCaseMaterialComponent } from './edit-case-material.component';

describe('EditCaseMaterialComponent', () => {
  let component: EditCaseMaterialComponent;
  let spectator: Spectator<EditCaseMaterialComponent>;
  let matDialogSpyObject: SpyObject<MatDialog>;

  const createComponent = createComponentFactory({
    component: EditCaseMaterialComponent,
    imports: [MatIconModule, CommonModule, MatDialogModule],
    providers: [
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
      component['store'].dispatch = jest.fn();
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
        }
      );
    });
    test('should dispatch actions afterClosed for processCaseView', () => {
      component.onIconClick();

      expect(component['store'].dispatch).toHaveBeenCalledTimes(3);
      expect(component['store'].dispatch).toHaveBeenCalledWith(
        updateMaterialRowDataItem({ item: MATERIAL_TABLE_ITEM_MOCK })
      );
      expect(component['store'].dispatch).toHaveBeenCalledWith(
        resetAutocompleteMaterials()
      );
      expect(component['store'].dispatch).toHaveBeenCalledWith(
        setRequestingAutoCompleteDialog({
          dialog: AutocompleteRequestDialog.ADD_ENTRY,
        })
      );
    });
    test('should dispatch actions afterClosed for caseView', () => {
      component.isCaseView = true;
      component.onIconClick();

      expect(component['store'].dispatch).toHaveBeenCalledTimes(3);
      expect(component['store'].dispatch).toHaveBeenCalledWith(
        updateRowDataItem({ item: MATERIAL_TABLE_ITEM_MOCK })
      );
      expect(component['store'].dispatch).toHaveBeenCalledWith(
        resetAutocompleteMaterials()
      );
      expect(component['store'].dispatch).toHaveBeenCalledWith(
        setRequestingAutoCompleteDialog({
          dialog: AutocompleteRequestDialog.ADD_ENTRY,
        })
      );
    });
  });
});
