import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { ConfirmationModalComponent } from './confirmation-modal.component';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let spectator: Spectator<ConfirmationModalComponent>;
  const matDialogRefMock = {
    updateSize: jest.fn(),
  };

  const createComponent = createComponentFactory({
    component: ConfirmationModalComponent,
    imports: [MatIconModule],
    providers: [
      {
        provide: MatDialogRef,
        useValue: matDialogRefMock,
      },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          displayText: 'displayText',
          confirmButton: 'confirmButton',
          cancelButton: 'cancelButton',
          list: [{ id: '1', value: '2' }],
        },
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

      component.closeDialog(true);

      expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
      expect(component.dialogRef.close).toHaveBeenLastCalledWith(true);
    });
  });
  describe('trackByFn', () => {
    test('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });

  describe('ngOnInit should', () => {
    test('set dialog size', () => {
      component.ngOnInit();

      expect(matDialogRefMock.updateSize).toHaveBeenCalled();
    });
  });
});
