import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DeletingAttachmentModalComponent } from './delete-attachment-modal.component';

describe('DeletingAttachmentModalComponent', () => {
  let component: DeletingAttachmentModalComponent;
  let spectator: Spectator<DeletingAttachmentModalComponent>;

  const createComponent = createComponentFactory({
    component: DeletingAttachmentModalComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    providers: [
      { provide: MatDialogRef, useValue: {} },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          attachment: {},
        },
      },
      MockProvider(ActiveCaseFacade),
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

      const facadeMock: ActiveCaseFacade = {
        deleteAttachmentSuccess$: of(true),
        deleteAttachment: jest.fn(),
      } as unknown as ActiveCaseFacade;

      Object.defineProperty(component, 'activeCaseFacade', {
        value: facadeMock,
      });

      component.confirmDelete();

      expect(closeDialogSpy).toHaveBeenCalledTimes(1);
    });
  });
});
