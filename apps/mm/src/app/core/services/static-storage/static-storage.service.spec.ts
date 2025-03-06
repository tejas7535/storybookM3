import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { TranslocoService } from '@jsverse/transloco';
import { environment } from '@mm/environments/environment';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import moment from 'moment';

import { openBanner } from '@schaeffler/banner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MaintenanceMessage } from '../../../shared/models';
import { StaticStorageService } from './static-storage.service';

describe('StaticStorageService', () => {
  let spectator: SpectatorService<StaticStorageService>;
  let service: StaticStorageService;
  let httpMock: HttpTestingController;
  let translocoService: TranslocoService;
  let store: Store;

  const createService = createServiceFactory({
    service: StaticStorageService,
    imports: [
      HttpClientTestingModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [StaticStorageService, provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(StaticStorageService);
    httpMock = spectator.inject(HttpTestingController);
    translocoService = spectator.inject(TranslocoService);
    store = spectator.inject(Store);
    store.dispatch = jest.fn();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getMessage', () => {
    let message: MaintenanceMessage;
    beforeEach(() => {
      message = {
        type: 'info',
        buttonText: {
          en: 'OK',
        },
        text: {
          en: 'Work in progress...',
        },
        validFrom: '',
        validTo: '',
      };
    });

    it('should get the maintenance message', (done) => {
      service.getMessage().subscribe((result) => {
        expect(result).toEqual(message);
        done();
      });

      const req = httpMock.expectOne(
        `${environment.staticStorageUrl}/${service.fileName}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(message);
    });
  });

  describe('dispatch message', () => {
    let message: MaintenanceMessage;

    beforeEach(() => {
      Date.now = jest
        .fn()
        .mockReturnValue(
          moment('27/09/2023 16:55:00', 'DD/MM/YYYY h:mm:ss').utc()
        );

      message = {
        type: 'info',
        buttonText: {
          en: 'OK',
          de: 'Okay',
        },
        text: {
          en: 'Work in progress...',
          de: 'Arbeit in Bearbeitung...',
        },
        validFrom: '26/09/2023 16:55:00',
        validTo: '28/09/2023 14:51:00',
      };
    });

    describe('when current date is in the selected timespan', () => {
      beforeEach(() => {
        Date.now = jest
          .fn()
          .mockReturnValue(
            moment('27/09/2023 16:55:00', 'DD/MM/YYYY h:mm:ss').utc()
          );
      });

      describe('when selected language is English', () => {
        beforeEach(() => {
          translocoService.getActiveLang = jest.fn(() => 'en');
        });

        it('should dispatch', () => {
          service.dispatchMessage(message);
          expect(store.dispatch).toHaveBeenCalledWith(
            openBanner({
              text: 'Work in progress...',
              buttonText: 'OK',
              icon: 'info',
              truncateSize: 0,
            })
          );
        });
      });

      describe('when selected language is German', () => {
        beforeEach(() => {
          translocoService.getActiveLang = jest.fn(() => 'de');
        });

        it('should dispatch', () => {
          service.dispatchMessage(message);
          expect(store.dispatch).toHaveBeenCalledWith(
            openBanner({
              text: 'Arbeit in Bearbeitung...',
              buttonText: 'Okay',
              icon: 'info',
              truncateSize: 0,
            })
          );
        });
      });

      describe('when selected language is not specified in message', () => {
        beforeEach(() => {
          translocoService.getActiveLang = jest.fn(() => 'es');
        });

        it('should dispatch with fallback to English', () => {
          service.dispatchMessage(message);
          expect(store.dispatch).toHaveBeenCalledWith(
            openBanner({
              text: 'Work in progress...',
              buttonText: 'OK',
              icon: 'info',
              truncateSize: 0,
            })
          );
        });
      });
    });

    describe('when current date is not in the selected timespan', () => {
      beforeEach(() => {
        Date.now = jest
          .fn()
          .mockReturnValue(
            moment('15/09/2023 16:55:00', 'DD/MM/YYYY h:mm:ss').utc()
          );
        translocoService.getActiveLang = jest.fn(() => 'en');
      });

      it('should not dispatch any message dispatch', () => {
        service.dispatchMessage(message);

        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });
  });
});
