import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { FileService } from './file.service';

describe('FileService', () => {
  let spectator: SpectatorService<FileService>;
  let service: FileService;

  const createService = createServiceFactory({
    service: FileService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should set and get co2UploadFile', () => {
    expect(service.getCo2UploadFile()).toBe(undefined);
    const file = new File([], 'file');
    service.setCo2UploadFile(file);
    expect(service.getCo2UploadFile()).toBe(file);
  });
});
