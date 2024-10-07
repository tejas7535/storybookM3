import { BehaviorSubject, Subject } from 'rxjs';

// eslint-disable-next-line import/no-extraneous-dependencies
import { AdvertisingId } from '@capacitor-community/advertising-id';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

jest.mock('@capacitor-community/advertising-id', () => ({
  AdvertisingId: {
    getAdvertisingStatus: jest.fn(),
  },
}));

import { AdvertisingIdService } from './advertising-id.service';

describe('AdvertisingIdService', () => {
  let spectator: SpectatorService<AdvertisingIdService>;
  let service: AdvertisingIdService;
  let statusSubject: Subject<{ status: string }>;

  const createService = createServiceFactory(AdvertisingIdService);

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;

    statusSubject = new BehaviorSubject<{ status: string }>({
      status: 'initial',
    });
    (AdvertisingId.getAdvertisingStatus as jest.Mock).mockReturnValue(
      statusSubject.asObservable()
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize status observable and emit status', (done) => {
    const mockStatus = { status: 'authorized' };
    statusSubject.next(mockStatus);

    service.initializeStatusObservable();

    service.getAddStatus().subscribe((status) => {
      expect(status).toBe(mockStatus.status);

      done();
    });
  });
});
