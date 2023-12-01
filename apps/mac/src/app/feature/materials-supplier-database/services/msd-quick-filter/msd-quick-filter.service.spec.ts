import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { MaterialClass, NavigationLevel } from '../../constants';
import { NewQuickFilterRequest, QuickFilter } from '../../models';
import { MsdQuickFilterService } from './msd-quick-filter.service';

describe('MsdQuickFilterService', () => {
  let spectator: SpectatorService<MsdQuickFilterService>;
  let service: MsdQuickFilterService;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: MsdQuickFilterService,
    imports: [HttpClientTestingModule],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(MsdQuickFilterService);
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
    httpMock.verify();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('createNewQuickFilter', (done) => {
    const request: NewQuickFilterRequest = {
      materialClass: MaterialClass.STEEL,
      navigationLevel: NavigationLevel.MATERIAL,
      title: 'test',
      description: 'test filter',
      filter: {
        co2PerTon: {
          filterType: 'number',
          type: 'greaterThan',
          filter: 2,
        },
      },
      columns: ['action', 'history', 'releasedStatus'],
    };

    const response: QuickFilter = {
      ...request,
      id: 100,
      maintainerId: '00000000-0000-0000-0000-000000000000',
      maintainerName: 'tester',
      timestamp: 170_076_440_796_175,
    };

    service.createNewQuickFilter(request).subscribe((result) => {
      expect(result).toEqual(response);
      done();
    });

    const req = httpMock.expectOne(service['BASE_URL']);
    expect(req.request.method).toBe('POST');
    req.flush(response);
  });

  test('updateQuickFilter', (done) => {
    const request: QuickFilter = {
      id: 100,
      materialClass: MaterialClass.STEEL,
      navigationLevel: NavigationLevel.MATERIAL,
      title: 'test updated',
      description: 'test filter updated',
      filter: {
        co2PerTon: {
          filterType: 'number',
          type: 'greaterThan',
          filter: 5,
        },
      },
      columns: ['action', 'history'],
    };

    const response: QuickFilter = {
      ...request,
      maintainerId: '00000000-0000-0000-0000-000000000000',
      maintainerName: 'tester',
      timestamp: 170_076_440_445,
    };

    service.updateQuickFilter(request).subscribe((result) => {
      expect(result).toEqual(response);
      done();
    });

    const req = httpMock.expectOne(service['BASE_URL']);
    expect(req.request.method).toBe('PUT');
    req.flush(response);
  });

  test('getPublishedQuickFilters', (done) => {
    const response: QuickFilter[] = [
      {
        id: 100,
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.MATERIAL,
        title: 'public 1',
        description: 'test public filter 1',
        filter: {
          co2PerTon: {
            filterType: 'number',
            type: 'greaterThan',
            filter: 5,
          },
        },
        columns: ['action', 'history'],
        maintainerId: '00000000-0000-0000-0000-000000000000',
        maintainerName: 'tester',
        timestamp: 170_076_440_445,
      },
      {
        id: 200,
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.MATERIAL,
        title: 'steel public',
        description: 'steel public filter',
        filter: {
          co2PerTon: {
            filterType: 'number',
            type: 'greaterThan',
            filter: 0.9,
          },
        },
        columns: ['col1'],
        maintainerId: '00000000-0000-0000-0000-000000000000',
        maintainerName: 'tester',
        timestamp: 222_076_440_445,
      },
    ];

    service
      .getPublishedQuickFilters(MaterialClass.STEEL, NavigationLevel.MATERIAL)
      .subscribe((result) => {
        expect(result).toEqual(response);
        done();
      });

    const req = httpMock.expectOne(
      `${service['BASE_URL']}/${MaterialClass.STEEL}/${NavigationLevel.MATERIAL}/maintained`
    );
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  test('getSubscribedQuickFilters', (done) => {
    const response: QuickFilter[] = [
      {
        id: 800,
        materialClass: MaterialClass.SAP_MATERIAL,
        navigationLevel: NavigationLevel.MATERIAL,
        title: 'sub 1',
        description: 'test sub filter 1',
        filter: {
          co2PerTon: {
            filterType: 'number',
            type: 'greaterThan',
            filter: 2,
          },
        },
        columns: ['history'],
        maintainerId: '00000000-0000-0000-0000-000000000000',
        maintainerName: 'tester2',
        timestamp: 170_076_440_445,
      },
      {
        id: 666,
        materialClass: MaterialClass.SAP_MATERIAL,
        navigationLevel: NavigationLevel.MATERIAL,
        title: 'steel public',
        description: 'steel public filter',
        filter: {
          co2PerTon: {
            filterType: 'number',
            type: 'greaterThan',
            filter: 0.9,
          },
        },
        columns: ['col10'],
        maintainerId: '00000000-0000-0000-0000-000000000000',
        maintainerName: 'tester',
        timestamp: 222_076_440_445,
      },
    ];

    service
      .getSubscribedQuickFilters(
        MaterialClass.SAP_MATERIAL,
        NavigationLevel.MATERIAL
      )
      .subscribe((result) => {
        expect(result).toEqual(response);
        done();
      });

    const req = httpMock.expectOne(
      `${service['BASE_URL']}/${MaterialClass.SAP_MATERIAL}/${NavigationLevel.MATERIAL}/subscribed`
    );
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  test('deleteQuickFilter', (done) => {
    const id = 999;

    service.deleteQuickFilter(id).subscribe(() => done());

    const req = httpMock.expectOne(`${service['BASE_URL']}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush('');
  });

  test('subscribeQuickFilter', (done) => {
    const id = 999;

    service.subscribeQuickFilter(id).subscribe(() => done());

    const req = httpMock.expectOne(`${service['BASE_URL']}/${id}/subscription`);
    expect(req.request.method).toBe('POST');
    req.flush('');
  });

  test('unsubscribeQuickFilter', (done) => {
    const id = 999;

    service.unsubscribeQuickFilter(id).subscribe(() => done());

    const req = httpMock.expectOne(`${service['BASE_URL']}/${id}/subscription`);
    expect(req.request.method).toBe('DELETE');
    req.flush('');
  });

  test('queryQuickFilters', (done) => {
    const response: QuickFilter[] = [
      {
        id: 100,
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.MATERIAL,
        title: 'public 1',
        description: 'test public filter 1',
        filter: {
          co2PerTon: {
            filterType: 'number',
            type: 'greaterThan',
            filter: 5,
          },
        },
        columns: ['action', 'history'],
        maintainerId: '00000000-0000-0000-0000-000000000000',
        maintainerName: 'tester',
        timestamp: 170_076_440_445,
      },
      {
        id: 200,
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.MATERIAL,
        title: 'steel public',
        description: 'steel public filter',
        filter: {
          co2PerTon: {
            filterType: 'number',
            type: 'greaterThan',
            filter: 0.9,
          },
        },
        columns: ['col1'],
        maintainerId: '00000000-0000-0000-0000-000000000000',
        maintainerName: 'tester',
        timestamp: 222_076_440_445,
      },
    ];

    const resultMaxSize = 10;
    const searchExpression = 'filt';

    service
      .queryQuickFilters(
        MaterialClass.STEEL,
        NavigationLevel.MATERIAL,
        resultMaxSize,
        searchExpression
      )
      .subscribe((result) => {
        expect(result).toEqual(response);
        done();
      });

    const req = httpMock.expectOne(
      `${service['BASE_URL']}/${MaterialClass.STEEL}/${NavigationLevel.MATERIAL}?resultMaxSize=${resultMaxSize}&searchExpression=${searchExpression}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });
});
