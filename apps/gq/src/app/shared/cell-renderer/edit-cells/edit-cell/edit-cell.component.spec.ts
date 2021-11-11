import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { Spectator, SpyObject } from '@ngneat/spectator';
import { createComponentFactory } from '@ngneat/spectator/jest';

import { QUOTATION_DETAIL_MOCK } from '../../../../../testing/mocks';
import { EditingModalComponent } from '../../../components/editing-modal/editing-modal.component';
import { ColumnFields } from '../../../services/column-utility-service/column-fields.enum';
import { EditCellComponent } from './edit-cell.component';

describe('EditCellComponent', () => {
  let component: EditCellComponent;
  let spectator: Spectator<EditCellComponent>;
  let matDialogSpyObject: SpyObject<MatDialog>;

  const createComponent = createComponentFactory({
    component: EditCellComponent,
    imports: [MatIconModule, MatDialogModule],
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
    test('should set params', () => {
      const params = {
        data: QUOTATION_DETAIL_MOCK,
        condition: {
          conditionField: ColumnFields.GPM,
        },
      } as any;
      component.agInit(params);

      expect(component.params).toEqual(params);
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
          width: '50%',
          height: '200px',
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
