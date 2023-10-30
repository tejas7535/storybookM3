import { MatDialogRef } from '@angular/material/dialog';

import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DeleteCustomViewModalComponent } from './delete-custom-view-modal.component';

describe('DeleteCustomViewModalComponent', () => {
  let component: DeleteCustomViewModalComponent;
  let spectator: Spectator<DeleteCustomViewModalComponent>;

  const createComponent = createComponentFactory({
    component: DeleteCustomViewModalComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), DialogHeaderModule],
    providers: [
      {
        provide: MatDialogRef,
        useValue: {},
      },
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('close dialog', () => {
    test('should close dialogRef and emit delete false', () => {
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(component['dialogRef'].close).toHaveBeenCalledWith({
        delete: false,
      });
    });
  });

  describe('confirm', () => {
    test('should close and emit delete true', () => {
      component['dialogRef'].close = jest.fn();

      component.confirm();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(component['dialogRef'].close).toHaveBeenCalledWith({
        delete: true,
      });
    });
  });
});
