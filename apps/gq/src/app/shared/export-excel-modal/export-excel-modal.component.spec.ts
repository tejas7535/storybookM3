import { MatDialogRef } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { ExportExcelModalComponent } from './export-excel-modal.component';
import { ExportExcel } from './export-excel.enum';

describe('ConfirmationModalComponent', () => {
  let component: ExportExcelModalComponent;
  let spectator: Spectator<ExportExcelModalComponent>;

  const createComponent = createComponentFactory({
    component: ExportExcelModalComponent,
    providers: [
      {
        provide: MatDialogRef,
        useValue: {},
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('closeDialog', () => {
    test('should close dialog', () => {
      component.dialogRef.close = jest.fn();

      component.closeDialog();

      expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
      expect(component.dialogRef.close).toHaveBeenLastCalledWith(
        ExportExcel.BASIC_DOWNLOAD
      );
    });
  });
});
