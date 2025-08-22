import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import { Attachment } from '@gq/shared/services/rest/attachments/models/attachment.interface';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DialogHeaderModule } from '../../header/dialog-header/dialog-header.module';
import { DeletingAttachmentModalComponent } from './delete-attachment-modal.component';

describe('DeletingAttachmentModalComponent', () => {
  let component: DeletingAttachmentModalComponent<any>;
  let spectator: Spectator<DeletingAttachmentModalComponent<any>>;

  const createComponent = createComponentFactory({
    component: DeletingAttachmentModalComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      PushPipe,
      MockModule(DialogHeaderModule),
    ],
    providers: [
      { provide: MatDialogRef, useValue: {} },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {},
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('closeDialog', () => {
    test('should call dialogRef.close() when closeDialog is called', () => {
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete attachment', () => {
    test('should deleted attachment', () => {
      const closeDialogSpy = jest.spyOn(component, 'closeDialog');
      closeDialogSpy.mockImplementation();

      component.modalData.delete = jest.fn();
      // eslint-disable-next-line unicorn/no-useless-undefined
      component.modalData.deleteSuccess$ = of(undefined);
      component.modalData.attachment = { gqId: 123 } as unknown as Attachment;

      component.confirmDelete();

      expect(closeDialogSpy).toHaveBeenCalledTimes(1);
      expect(component.modalData.delete).toHaveBeenCalledTimes(1);
      expect(component.modalData.delete).toHaveBeenCalledWith(
        component.modalData.attachment
      );
    });
  });
});
