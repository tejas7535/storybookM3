import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { DragDialogDirective } from '@gq/shared/directives/drag-dialog/drag-dialog.directive';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockDirective } from 'ng-mocks';

import { InfoBannerComponent } from '../../info-banner/info-banner.component';
import { ConfirmationModalComponent } from './confirmation-modal.component';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let spectator: Spectator<ConfirmationModalComponent>;
  const matDialogRefMock = {
    updateSize: jest.fn(),
  };

  const createComponent = createComponentFactory({
    component: ConfirmationModalComponent,
    imports: [
      MatIconModule,
      InfoBannerComponent,
      MockDirective(DragDialogDirective),
    ],
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
});
