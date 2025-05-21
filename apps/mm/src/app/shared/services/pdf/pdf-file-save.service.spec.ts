/* eslint-disable unicorn/no-useless-undefined */
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { FileOpener } from '@capacitor-community/file-opener';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import jsPDF from 'jspdf';

import { PDFDocument } from '@schaeffler/pdf-generator';

import { PdfFileSaveService } from './pdf-file-save.service';

// Mock Capacitor
jest.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: jest.fn(),
    getPlatform: jest.fn(),
  },
}));

// Mock Filesystem
jest.mock('@capacitor/filesystem', () => ({
  Directory: {
    Cache: 'CACHE',
    Data: 'DATA',
  },
  Filesystem: {
    writeFile: jest.fn().mockResolvedValue({ uri: 'mock-uri' }),
    getUri: jest.fn().mockResolvedValue({ uri: 'mock-path' }),
  },
}));

// Mock Share
jest.mock('@capacitor/share', () => ({
  Share: {
    share: jest.fn().mockResolvedValue({ success: true }),
  },
}));

// Mock FileOpener
jest.mock('@capacitor-community/file-opener', () => ({
  FileOpener: {
    open: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('PdfFileSaveService', () => {
  let spectator: SpectatorService<PdfFileSaveService>;
  let service: PdfFileSaveService;
  const mockOutput = 'datauristring output';

  const jsPDFObject = {
    save: jest.fn().mockResolvedValue(undefined),
    output: jest.fn().mockReturnValue(mockOutput),
  } as unknown as jsPDF;

  const mockPdfDocument = {
    pdfDoc: jsPDFObject,
  } as unknown as PDFDocument;

  const createService = createServiceFactory({
    service: PdfFileSaveService,
    providers: [],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when running in web environment', () => {
    beforeEach(() => {
      (Capacitor.isNativePlatform as jest.Mock).mockReturnValue(false);
    });

    it('should save file in web environment', async () => {
      await service.saveAndOpenFile(mockPdfDocument, 'someFile.pdf');

      expect(jsPDFObject.save).toHaveBeenCalledWith('someFile.pdf', {
        returnPromise: true,
      });
    });
  });

  describe('when running on iOS', () => {
    beforeEach(() => {
      (Capacitor.isNativePlatform as jest.Mock).mockReturnValue(true);
      (Capacitor.getPlatform as jest.Mock).mockReturnValue('ios');
    });

    it('should write file to cache and share it', async () => {
      await service.saveAndOpenFile(mockPdfDocument, 'someFile.pdf');

      expect(Filesystem.writeFile).toHaveBeenCalledWith({
        path: 'someFile.pdf',
        data: `${mockOutput}`,
        directory: Directory.Cache,
        recursive: true,
      });

      expect(Share.share).toHaveBeenCalledWith({
        files: ['mock-uri'],
      });
    });
  });

  describe('when running on Android', () => {
    beforeEach(() => {
      (Capacitor.isNativePlatform as jest.Mock).mockReturnValue(true);
      (Capacitor.getPlatform as jest.Mock).mockReturnValue('android');
    });

    it('should write file to data directory and open it', async () => {
      await service.saveAndOpenFile(mockPdfDocument, 'someFile.pdf');

      expect(Filesystem.writeFile).toHaveBeenCalledWith({
        path: 'someFile.pdf',
        data: `${mockOutput}`,
        directory: Directory.Data,
        recursive: true,
      });

      expect(Filesystem.getUri).toHaveBeenCalledWith({
        directory: Directory.Data,
        path: 'someFile.pdf',
      });

      // We need to wait for promises to resolve
      await new Promise(process.nextTick);

      expect(FileOpener.open).toHaveBeenCalledWith({
        filePath: 'mock-path',
        contentType: 'application/pdf',
      });
    });
  });
});
