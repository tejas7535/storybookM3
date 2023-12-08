import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import jsPDF from 'jspdf';

import { GreaseReportPdfFileSaveService } from './grease-report-pdf-file-save.service';

describe('GreaseReportPdfFileSaveService', () => {
  let spectator: SpectatorService<GreaseReportPdfFileSaveService>;
  let service: GreaseReportPdfFileSaveService;
  const jsPDFObject = {
    save: jest.fn(),
  } as unknown as jsPDF;

  const createService = createServiceFactory({
    service: GreaseReportPdfFileSaveService,
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
