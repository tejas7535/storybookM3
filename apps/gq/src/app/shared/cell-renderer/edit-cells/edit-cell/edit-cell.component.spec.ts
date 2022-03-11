import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { Spectator, SpyObject } from '@ngneat/spectator';
import { createComponentFactory } from '@ngneat/spectator/jest';

import {
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../../../testing/mocks';
import { ColumnFields } from '../../../ag-grid/constants/column-fields.enum';
import { EditingModalComponent } from '../../../components/editing-modal/editing-modal.component';
import { EditCellComponent } from './edit-cell.component';

describe('EditCellComponent', () => {
  let component: EditCellComponent;
  let spectator: Spectator<EditCellComponent>;
  let matDialogSpyObject: SpyObject<MatDialog>;

  const createComponent = createComponentFactory({
    component: EditCellComponent,
    imports: [MatIconModule, MatDialogModule],
    mocks: [MatDialog],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
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
    test('should set params and allow cellEditing', () => {
      const params = {
        data: QUOTATION_DETAIL_MOCK,
        condition: {
          enabled: true,
          conditionField: ColumnFields.GPC,
        },
        context: { quotation: QUOTATION_MOCK },
      } as any;
      component.agInit(params);

      expect(component.params).toEqual(params);
      expect(component.isCellEditingAllowed).toBeTruthy();
    });
    test('should set params and disable cellEditing for missing price', () => {
      const params = {
        data: { price: undefined },
        condition: {
          enabled: true,
          conditionField: ColumnFields.PRICE,
        },
        context: { quotation: QUOTATION_MOCK },
      } as any;
      component.agInit(params);

      expect(component.params).toEqual(params);
      expect(component.isCellEditingAllowed).toBeFalsy();
    });
    test('should set params but disabled cellEditing for orderQuantity', () => {
      const params = {
        data: QUOTATION_DETAIL_MOCK,
        condition: {
          enabled: true,
        },
        field: ColumnFields.ORDER_QUANTITY,
        context: { quotation: QUOTATION_MOCK },
      } as any;
      component.agInit(params);

      expect(component.params).toEqual(params);
      expect(component.isCellEditingAllowed).toBeFalsy();
    });
  });

  describe('onIconClick', () => {
    test('should open dialog', () => {
      component.params = {
        data: QUOTATION_DETAIL_MOCK,
        condition: {},
        field: ColumnFields.GPM,
      } as any;
      component.onIconClick();

      expect(matDialogSpyObject.open).toHaveBeenCalledWith(
        EditingModalComponent,
        {
          width: '634px',
          data: {
            quotationDetail: QUOTATION_DETAIL_MOCK,
            field: ColumnFields.GPM,
          },
          disableClose: true,
        }
      );
    });
  });
});
