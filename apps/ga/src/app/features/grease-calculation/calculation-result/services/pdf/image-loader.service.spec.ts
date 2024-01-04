import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { BehaviorSubject, Observable, of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { SettingsFacade } from '@ga/core/store/facades/settings.facade';
import { PartnerVersion } from '@ga/shared/models';

import { ImageLoaderService } from './image-loader.service';

describe('ImageLoaderService', () => {
  let spectator: SpectatorService<ImageLoaderService>;
  let service: ImageLoaderService;
  let httpMock: HttpTestingController;
  const partnerVersion$$ = new BehaviorSubject<string | undefined>(undefined);
  const partnerVersionObservable$: Observable<string | undefined> =
    partnerVersion$$.asObservable();

  const settingsFacadeMock = {
    partnerVersion$: partnerVersionObservable$,
  };

  const createService = createServiceFactory({
    service: ImageLoaderService,
    imports: [HttpClientTestingModule],
    providers: [
      {
        provide: SettingsFacade,
        useFactory: () => settingsFacadeMock,
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load image from URL', () => {
    const spyReadBlob = jest
      .spyOn(service as any, 'readBlob')
      .mockReturnValue(of('data:image/png;base64,iVBORw0KGg...'));

    service.schaefflerLogo$.subscribe((result) => {
      expect(result).toBe('data:image/png;base64,iVBORw0KGg...');
    });

    const req = httpMock.expectOne('/assets/images/schaeffler-logo.png');
    expect(req.request.method).toBe('GET');
    req.flush(new Blob([''], { type: 'image/png' }));

    expect(spyReadBlob).toHaveBeenCalled();
  });

  describe('when partner version is provided', () => {
    beforeEach(() => {
      partnerVersion$$.next(PartnerVersion.Schmeckthal);
    });

    test('should fetch the logo image for Schmeckthal partner version', () => {
      service.partnerVersionlogo$.subscribe();

      const req = httpMock.expectOne(
        '/assets/images/partner-version-logos/schmeckthal-gruppe.png'
      );
      expect(req.request.method).toBe('GET');
    });
  });

  describe('when partner version is not provided', () => {
    beforeEach(() => {
      partnerVersion$$.next(undefined);
    });

    // eslint-disable-next-line jest/expect-expect
    test('should not fetch the logo if partner version not provided', () => {
      service.partnerVersionlogo$.subscribe();

      httpMock.expectNone(
        '/assets/images/partner-version-logos/schmeckthal-gruppe.png'
      );
    });
  });

  describe('read blob', () => {
    it('should read blob', (done) => {
      const blob = new Blob([JSON.stringify({ data: 'test' })], {
        type: 'string',
      });

      service['readBlob'](blob).subscribe((result) => {
        expect(typeof result).toEqual('string');
        done();
      });
    });
  });
});
