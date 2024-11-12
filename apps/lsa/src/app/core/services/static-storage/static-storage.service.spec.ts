import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { of, Subject } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { openBanner } from '@schaeffler/banner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  MaintenanceMessage,
  StaticStorageService,
} from './static-storage.service';

describe('StaticStorageService', () => {
  let spectator: SpectatorService<StaticStorageService>;
  let service: StaticStorageService;
  let store: Store;

  const createService = createServiceFactory({
    service: StaticStorageService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      StaticStorageService,
      provideMockStore({}),
      provideHttpClient(),
      provideHttpClientTesting(),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(StaticStorageService);

    store = spectator.inject(Store);
    store.dispatch = jest.fn();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('displayMaintenanceMessages', () => {
    it('should call getMessage and dispatchMessage in displayMaintenanceMessages', () => {
      const message = {
        content: 'Maintenance message',
      } as Partial<MaintenanceMessage> as MaintenanceMessage;
      const httpClient = spectator.inject(HttpClient);
      const dispatchMessageSpy = jest.spyOn(
        spectator.service as any,
        'dispatchMessage'
      );

      jest.spyOn(httpClient, 'get').mockReturnValue(of(message));

      spectator.service.displayMaintenanceMessages();

      expect(httpClient.get).toHaveBeenCalledWith(
        `${spectator.service['storageUrl']}/${spectator.service['fileName']}`
      );

      expect(dispatchMessageSpy).toHaveBeenCalledWith(message);
    });

    it('should dispatch message on language change', () => {
      const message = {
        content: 'Maintenance message',
        validFrom: '29/11/2023 01:00:00',
        validTo: '29/10/2024 23:51:00',
      } as Partial<MaintenanceMessage> as MaintenanceMessage;
      const translocoService = spectator.inject(TranslocoService);
      const dispatchSpy = jest.spyOn(spectator.service as any, 'dispatch');

      jest
        .spyOn(translocoService.langChanges$, 'pipe')
        .mockReturnValue(of('en', 'fr'));
      jest
        .spyOn(spectator.service as any, 'getMessage')
        .mockReturnValue(of(message));

      spectator.service.displayMaintenanceMessages();

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(message);
    });

    it('should complete destroy$ on ngOnDestroy', () => {
      const destroy$ = spectator.service['destroy$'] as Subject<void>;
      const completeSpy = jest.spyOn(destroy$, 'complete');

      spectator.service.ngOnDestroy();

      expect(completeSpy).toHaveBeenCalled();
    });

    it('should dispatch the message if conditions are met', () => {
      const message: MaintenanceMessage = {
        type: 'info',
        content: 'Test message',
        text: {
          en: 'Localized message',
        },
        buttonText: {
          en: 'Localized button text',
        },
        validFrom: '29/11/2023 01:00:00',
        validTo: '29/10/2024 23:51:00',
      } as Partial<MaintenanceMessage> as MaintenanceMessage;

      const shouldDispatchMessageSpy = jest
        .spyOn(spectator.service as any, 'shouldDispatchMessage')
        .mockReturnValue(true);

      const dispatchSpy = jest.spyOn(store, 'dispatch');

      spectator.service['dispatch'](message);

      expect(shouldDispatchMessageSpy).toHaveBeenCalledWith(message);

      expect(dispatchSpy).toHaveBeenCalledWith(
        openBanner({
          text: 'Localized message',
          buttonText: 'Localized button text',
          icon: message.type,
          truncateSize: 0,
        })
      );
    });
  });
});
