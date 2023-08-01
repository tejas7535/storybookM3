import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AttachmentFilesUploadModalComponent } from '../modal/attachment-files-upload-modal/attachment-files-upload-modal.component';
import { AttachmentFilesComponent } from './attachment-files.component';

describe('AttachmentFilesComponent', () => {
  let component: AttachmentFilesComponent;
  let spectator: Spectator<AttachmentFilesComponent>;

  const createComponent = createComponentFactory({
    component: AttachmentFilesComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    providers: [{ provide: MatDialog, useValue: {} }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should open upload dialog', () => {
    const openMock = jest.fn(
      () =>
        ({
          afterClosed: () => {},
        } as any)
    );
    component['dialog'].open = openMock;

    component.openAddFileDialog();

    expect(openMock).toBeCalledTimes(1);
    expect(openMock).toHaveBeenCalledWith(AttachmentFilesUploadModalComponent, {
      width: '634px',
      disableClose: true,
    });
  });

  test(
    'should set the observable after closed',
    marbles((m) => {
      expect(true).toBeTruthy();
      const expectedResult = m.cold('a', { a: ['file-1', 'file-2'] });
      const openMock = jest.fn(
        () =>
          ({
            afterClosed: () => expectedResult,
          } as any)
      );
      component.selectedFilesList$ = undefined;
      component['dialog'].open = openMock;

      expect(component.selectedFilesList$).toBeUndefined();
      component.openAddFileDialog();
      m.expect(component.selectedFilesList$).toBeObservable(expectedResult);
    })
  );
});
