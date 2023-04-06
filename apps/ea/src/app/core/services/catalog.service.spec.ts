import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';

import { firstValueFrom } from 'rxjs';

import { environment } from '@ea/environments/environment';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { CatalogService } from './catalog.service';
import { CatalogServiceBasicFrequenciesResult } from './catalog.service.interface';

describe('CatalogService', () => {
  let catalogService: CatalogService;
  let spectator: SpectatorService<CatalogService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: CatalogService,
    imports: [HttpClientTestingModule],
    providers: [CatalogService],
  });

  beforeEach(() => {
    spectator = createService();
    catalogService = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(catalogService).toBeDefined();
  });

  describe('getBearingIdFromDesignation', () => {
    it('should call the service to return a bearing id', waitForAsync(() => {
      const url = `${environment.baseUrl}/CatalogWebApi/v1/CatalogBearing/product/id?designation=abc`;
      const mockResult = { id: 'my-id' };

      firstValueFrom(catalogService.getBearingIdFromDesignation('abc')).then(
        (res) => {
          expect(res).toEqual(mockResult.id);
        }
      );

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockResult);
    }));

    it('should throw if no bearing designation is provided', () =>
      expect(
        firstValueFrom(catalogService.getBearingIdFromDesignation(undefined))
      ).rejects.toThrow());
  });

  describe('getBasicFrequencies', () => {
    it('should call the service to get the basic frequencies', waitForAsync(() => {
      const rawResult: CatalogServiceBasicFrequenciesResult = {
        data: {
          message: '',
          status: '',
          results: [
            {
              fields: [
                {
                  abbreviation: 'abc',
                  id: '2',
                  title: 'field-title',
                  values: [{ content: 'context', index: 3, unit: 'cm' }],
                },
              ],
              id: '1',
              title: 'my-title',
            },
          ],
        },
      };
      const url = `${environment.baseUrl}/CatalogWebApi/v1/CatalogBearing/product/basicfrequencies/my-id`;

      firstValueFrom(catalogService.getBasicFrequencies('my-id')).then(
        (res) => {
          expect(res).toMatchSnapshot();
        }
      );

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(rawResult);
    }));

    it('should throw if no bearing id is provided', () =>
      expect(
        firstValueFrom(catalogService.getBasicFrequencies(undefined))
      ).rejects.toThrow());
  });

  describe('getBasicFrequenciesPdf', () => {
    beforeEach(() => {
      global.URL.createObjectURL = jest.fn();
      global.document.createElement = jest.fn();
    });

    afterEach(() => {
      (global.document.createElement as jest.Mock).mockReset();
      (global.URL.createObjectURL as jest.Mock).mockReset();
    });

    it('should call the service to get basic frequencies as PDF', waitForAsync(() => {
      const url = `${environment.baseUrl}/CatalogWebApi/v1/CatalogBearing/product/basicfrequencies/pdf/my-id`;
      const mockResult = new Blob();

      firstValueFrom(catalogService.getBasicFrequenciesPdf('my-id')).then(
        (res) => {
          expect(res).toEqual(mockResult);
        }
      );

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockResult);
    }));
  });
});
