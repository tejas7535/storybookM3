import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import jsPDF from 'jspdf';

import { PdfFileSaveService } from './pdf-file-save.service';

describe('PdfFileSaveService', () => {
  let spectator: SpectatorService<PdfFileSaveService>;
  let service: PdfFileSaveService;
  const jsPDFObject = {
    save: jest.fn(),
  } as unknown as jsPDF;

  const createService = createServiceFactory({
    service: PdfFileSaveService,
    providers: [],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    service.saveAndOpenFile(jsPDFObject, 'someFile.pdf');

    expect(service).toBeTruthy();
  });

  describe('when file is saved', () => {
    it('should saving file in web environment', () => {
      service.saveAndOpenFile(jsPDFObject, 'someFile.pdf');

      expect(jsPDFObject.save).toHaveBeenCalledWith('someFile.pdf', {
        returnPromise: true,
      });
    });
  });
});
