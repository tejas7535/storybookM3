import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { BehaviorSubject } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MsdDataService } from '@mac/feature/materials-supplier-database/services';

import * as en from '../../../../../../assets/i18n/en.json';
import { PdfViewerComponent } from './pdf-viewer.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string.split('.').pop()),
}));

describe('PdfViewerComponent', () => {
  let component: PdfViewerComponent;
  let spectator: Spectator<PdfViewerComponent>;

  // very small valid PDF base64 encoded
  const base64 =
    'data:application/pdf;base64,JVBERi0xLjAKMSAwIG9iajw8L1BhZ2VzIDIgMCBSPj5lbmRvYmogMiAwIG9iajw8L0tpZHNbMyAw\nIFJdL0NvdW50IDE+PmVuZG9iaiAzIDAgb2JqPDwvTWVkaWFCb3hbMCAwIDMgM10+PmVuZG9iagp0\ncmFpbGVyPDwvUm9vdCAxIDAgUj4+Cg==';
  const subject = new BehaviorSubject(base64);
  const createComponent = createComponentFactory({
    component: PdfViewerComponent,
    imports: [provideTranslocoTestingModule({ en })],
    providers: [
      MockProvider(MatDialogRef, { close: jest.fn() }),
      MockProvider(MsdDataService, {
        getUploadFile: jest.fn(() => subject),
      }),
      {
        provide: MAT_DIALOG_DATA,
        useValue: 55,
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
