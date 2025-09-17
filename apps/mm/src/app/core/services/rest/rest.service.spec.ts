import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';

import { firstValueFrom } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import {
  CalculationRequestPayload,
  MMBearingPreflightResponse,
  PreflightRequestBody,
  SearchResult,
  ShaftMaterialResponse,
  SimpleListResponse,
} from '@mm/shared/models';
import { withCache } from '@ngneat/cashew';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { BearinxOnlineResult } from '../bearinx-result.interface';
import { environment } from './../../../../environments/environment';
import {
  BEARING_MATERIAL_RESPONSE_MOCK,
  BEARING_PREFLIGHT_RESPONSE_MOCK,
  BEARING_SEARCH_RESULT_MOCK,
  REPORT_RESPONSE_MOCK,
  SIMPLE_LIST_RESPONSE,
} from './../../../../testing/mocks/rest.service.mock';
import { RestService } from './rest.service';

describe('RestService', () => {
  let spectator: SpectatorService<RestService>;
  let service: RestService;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: RestService,
    imports: [],
    providers: [
      RestService,
      provideHttpClient(),
      provideHttpClientTesting(),
      {
        provide: TranslocoService,
        useValue: { getActiveLang: jest.fn(() => 'en') },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(RestService);
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getBearingSearch', () => {
    it('should send a bearing search request with given query', (done) => {
      service.getBearingSearch('theQuery').subscribe((result: SearchResult) => {
        expect(result).toEqual(BEARING_SEARCH_RESULT_MOCK);
        done();
      });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/bearings/search?pattern=theQuery&page=1&size=1000`
      );
      expect(req.request.method).toBe('GET');
      req.flush(BEARING_SEARCH_RESULT_MOCK);
    });
  });

  describe('#searchBearings', () => {
    it('should search bearings and map response to BearingOption array', (done) => {
      const mockSearchResult = {
        data: [
          {
            name: 'Bearing-1',
            isThermal: true,
            isMechanical: false,
            isHydraulic: true,
          },
          {
            name: 'Bearing-2',
            isThermal: false,
            isMechanical: true,
            isHydraulic: false,
          },
        ],
      };

      service.searchBearings('test-query').subscribe((result) => {
        expect(result).toMatchSnapshot();
        done();
      });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/bearings/search?pattern=test-query&page=1&size=1000`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockSearchResult);
    });

    it('should filter out bearings with all flags set to false', (done) => {
      const mockSearchResult = {
        data: [
          {
            name: 'Valid-Bearing-1',
            isThermal: true,
            isMechanical: false,
            isHydraulic: false,
          },
          {
            name: 'Invalid-Bearing',
            isThermal: false,
            isMechanical: false,
            isHydraulic: false,
          },
          {
            name: 'Valid-Bearing-2',
            isThermal: false,
            isMechanical: true,
            isHydraulic: false,
          },
        ],
      };

      service.searchBearings('test-query').subscribe((result) => {
        expect(result).toHaveLength(2);
        expect(result.map((bearing) => bearing.id)).toEqual([
          'Valid-Bearing-1',
          'Valid-Bearing-2',
        ]);
        expect(result).toMatchSnapshot();
        done();
      });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/bearings/search?pattern=test-query&page=1&size=1000`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockSearchResult);
    });
  });

  describe('#fetchBearingInfo', () => {
    it('should fetch bearing details and map them correctly', (done) => {
      const bearingId = 'ABC123';
      const mockApiResponse = {
        id: 'ABC123',
        name: 'Test Bearing',
        isThermal: true,
        isMechanical: false,
        isHydraulic: true,
      };

      service.fetchBearingInfo(bearingId).subscribe((result) => {
        expect(result).toMatchSnapshot();
        done();
      });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/cancalculate?designation=${encodeURIComponent(bearingId)}`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.context).toEqual(withCache({ version: 'en' }));
      req.flush(mockApiResponse);
    });

    it('should handle missing properties with fallback values', (done) => {
      const bearingId = 'DEF456';
      const mockApiResponse = {
        name: 'Partial Bearing',
        isMechanical: true, // At least one flag must be true
        // Missing id, isThermal, isHydraulic
      };

      service.fetchBearingInfo(bearingId).subscribe((result) => {
        expect(result).toMatchSnapshot();
        done();
      });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/cancalculate?designation=${encodeURIComponent(bearingId)}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponse);
    });

    it('should handle missing title with fallback to empty string', (done) => {
      const bearingId = 'GHI789';
      const mockApiResponse = {
        id: 'GHI789',
        isThermal: false,
        isMechanical: true,
        isHydraulic: false,
        // Missing name/title
      };

      service.fetchBearingInfo(bearingId).subscribe((result) => {
        expect(result).toMatchSnapshot();
        done();
      });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/cancalculate?designation=${encodeURIComponent(bearingId)}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponse);
    });

    it('should throw error when bearing has all flags set to false', (done) => {
      const bearingId = 'INVALID123';
      const mockApiResponse = {
        id: 'INVALID123',
        name: 'Invalid Bearing',
        isThermal: false,
        isMechanical: false,
        isHydraulic: false,
      };

      service.fetchBearingInfo(bearingId).subscribe({
        next: () => {
          done.fail('Should have thrown an error');
        },
        error: (error) => {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe(
            `Invalid bearing configuration: Bearing "${bearingId}" has no valid type flags set`
          );
          done();
        },
      });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/cancalculate?designation=${encodeURIComponent(bearingId)}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponse);
    });
  });

  describe('#getBearingCalculationResult', () => {
    it('should send a bearing calculation request with given form properties', (done) => {
      service
        .getBearingCalculationResult(
          {} as Partial<CalculationRequestPayload> as CalculationRequestPayload
        )
        .subscribe((result: BearinxOnlineResult) => {
          expect(result).toEqual(REPORT_RESPONSE_MOCK);
          done();
        });

      const req = httpMock.expectOne(`${environment.baseUrl}/calculate`);
      expect(req.request.method).toBe('POST');
      req.flush(REPORT_RESPONSE_MOCK);
    });
  });

  describe('#getBearingPreflightResponse', () => {
    it('should send a bearing preflight request with given body', (done) => {
      service
        .getBearingPreflightResponse({} as PreflightRequestBody)
        .subscribe((result: MMBearingPreflightResponse) => {
          expect(result).toEqual(BEARING_PREFLIGHT_RESPONSE_MOCK);
          done();
        });

      const req = httpMock.expectOne(`${environment.baseUrl}/dialog`);
      expect(req.request.method).toBe('POST');
      req.flush(BEARING_PREFLIGHT_RESPONSE_MOCK);
    });
  });

  describe('#getBearingMaterialResponse', () => {
    it('should send a bearing material request with given material', (done) => {
      const mockShaftMaterial = 'material1';
      service
        .getBearingsMaterialResponse(mockShaftMaterial)
        .subscribe((result: ShaftMaterialResponse) => {
          expect(result).toEqual(BEARING_MATERIAL_RESPONSE_MOCK);
          done();
        });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/materials/${mockShaftMaterial}`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.context).toEqual(withCache({ version: 'en' }));
      req.flush(BEARING_MATERIAL_RESPONSE_MOCK);
    });
  });

  describe('#getLoadOptions', () => {
    it('should send a load option request with given url', (done) => {
      service
        .getLoadOptions<SimpleListResponse[]>('aUrl')
        .subscribe((result) => {
          expect(result).toEqual(SIMPLE_LIST_RESPONSE);
          done();
        });

      const req = httpMock.expectOne('aUrl');
      expect(req.request.method).toBe('GET');
      expect(req.request.context).toEqual(withCache({ version: 'en' }));
      req.flush(SIMPLE_LIST_RESPONSE);
    });
  });

  describe('getBearinxVersions', () => {
    it('should call the service to get bearinx versions', waitForAsync(() => {
      const mockResult = [
        {
          name: 'bearinx',
          version: '1',
        },
      ];

      firstValueFrom(service.getBearinxVersions()).then((res) => {
        expect(res).toMatchSnapshot();
      });

      const req = httpMock.expectOne(
        `${environment.bearinxApiBaseUrl}/version`
      );
      expect(req.request.method).toBe('GET');

      req.flush(mockResult);
    }));
  });

  describe('getToleranceClasses', () => {
    it('should call the service to get tolerance classes', (done) => {
      const bearingDesignation = 'ABC123';

      service.getToleranceClasses(bearingDesignation).subscribe((result) => {
        expect(result).toEqual(['class1', 'class2']);
        done();
      });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/bearings/toleranceclasses?designation=${bearingDesignation}`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.context).toEqual(withCache({ version: 'en' }));
      req.flush(['class1', 'class2']);
    });
  });

  describe('getThermalBearingCalculationResult', () => {
    it('should send a thermal bearing calculation request with given form properties', (done) => {
      service
        .getThermalBearingCalculationResult({} as any)
        .subscribe((result: BearinxOnlineResult) => {
          expect(result).toEqual(REPORT_RESPONSE_MOCK);
          done();
        });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/calculate/thermal`
      );
      expect(req.request.method).toBe('POST');
      req.flush(REPORT_RESPONSE_MOCK);
    });
  });

  describe('#getBearingSeats', () => {
    it('should fetch bearing seats and map them correctly', (done) => {
      const bearingId = 'test-bearing-123';
      const mockResponse = {
        bearingSeats: [
          { id: 'seat1', title: 'Bearing Seat 1', image: 'seat1.png' },
          { id: 'seat2', title: 'Bearing Seat 2', image: undefined },
        ],
      };

      service.getBearingSeats(bearingId).subscribe((result) => {
        expect(result).toMatchSnapshot();
        done();
      });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/bearings?designation=${encodeURIComponent(bearingId)}`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.context).toEqual(withCache({ version: 'en' }));
      req.flush(mockResponse);
    });
  });

  describe('#getMeasurementMethods', () => {
    it('should fetch measurement methods and map them correctly', (done) => {
      const bearingId = 'test-bearing-456';
      const mockResponse = [
        { id: 'method1', title: 'Measurement Method 1', image: 'method1.png' },
        { id: 'method2', title: 'Measurement Method 2', image: undefined },
      ];

      service.getMeasurementMethods(bearingId).subscribe((result) => {
        expect(result).toMatchSnapshot();
        done();
      });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/bearings/measuringmethods?designation=${encodeURIComponent(bearingId)}`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.context).toEqual(withCache({ version: 'en' }));
      req.flush(mockResponse);
    });
  });

  describe('#getThermalBearingMountingMethods', () => {
    it('should fetch thermal bearing mounting methods and map them correctly', (done) => {
      const bearingId = 'thermal-bearing-789';
      const mockResponse = [
        { id: 'thermal1', title: 'Thermal Mount 1', image: 'thermal1.png' },
        { id: 'thermal2', title: 'Thermal Mount 2', image: undefined },
      ];

      service
        .getThermalBearingMountingMethods(bearingId)
        .subscribe((result) => {
          expect(result).toMatchSnapshot();
          done();
        });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/bearings/mountingmethods?designation=${encodeURIComponent(bearingId)}`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.context).toEqual(withCache({ version: 'en' }));
      req.flush(mockResponse);
    });
  });

  describe('#getNonThermalBearingMountingMethods', () => {
    it('should fetch non-thermal bearing mounting methods and map them correctly', (done) => {
      const bearingId = 'non-thermal-bearing-101';
      const bearingSeatId = 'seat-abc';
      const measurementMethodId = 'method-xyz';
      const mockResponse = [
        { id: 'mount1', title: 'Mounting Method 1', image: 'mount1.png' },
        { id: 'mount2', title: 'Mounting Method 2', image: undefined },
      ];

      service
        .getNonThermalBearingMountingMethods(
          bearingId,
          bearingSeatId,
          measurementMethodId
        )
        .subscribe((result) => {
          expect(result).toMatchSnapshot();
          done();
        });

      const expectedUrl = `${environment.baseUrl}/bearings/seats/${bearingSeatId}/measuringmethods/${measurementMethodId}/mountingmethods?designation=${encodeURIComponent(bearingId)}`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.context).toEqual(withCache({ version: 'en' }));
      req.flush(mockResponse);
    });
  });

  describe('private helper methods', () => {
    describe('mapToListValues', () => {
      it('should map items with images correctly', (done) => {
        // Test through getBearingSeats to access private method
        const bearingId = 'test-mapping';
        const mockResponse = {
          bearingSeats: [
            { id: 'item1', title: 'Item with Image', image: 'test.png' },
            { id: 'item2', title: 'Item without Image', image: undefined },
          ],
        };

        service.getBearingSeats(bearingId).subscribe((result) => {
          expect(result).toHaveLength(2);
          expect(result[0]).toEqual({
            id: 'item1',
            text: 'Item with Image',
            imageUrl: expect.stringContaining('/images/test.png'),
          });
          expect(result[1]).toEqual({
            id: 'item2',
            text: 'Item without Image',
            imageUrl: undefined,
          });
          done();
        });

        const req = httpMock.expectOne(
          `${environment.baseUrl}/bearings?designation=${encodeURIComponent(bearingId)}`
        );
        req.flush(mockResponse);
      });
    });

    describe('getImageUrl', () => {
      it('should construct correct image URL', (done) => {
        // Test through getBearingSeats to access private method
        const bearingId = 'test-image-url';
        const mockResponse = {
          bearingSeats: [
            { id: 'item1', title: 'Test Item', image: 'example.jpg' },
          ],
        };

        service.getBearingSeats(bearingId).subscribe((result) => {
          const expectedBaseUrl = environment.baseUrl.replace(
            '/v3/mountingmanager',
            ''
          );
          expect(result[0].imageUrl).toBe(
            `${expectedBaseUrl}/images/example.jpg`
          );
          done();
        });

        const req = httpMock.expectOne(
          `${environment.baseUrl}/bearings?designation=${encodeURIComponent(bearingId)}`
        );
        req.flush(mockResponse);
      });
    });
  });
});
