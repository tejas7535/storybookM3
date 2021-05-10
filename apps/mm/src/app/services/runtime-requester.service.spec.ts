import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { FormGroup } from '@angular/forms';

import { ModelObject } from '@caeonline/dynamic-forms';
import { HttpCacheInterceptorModule } from '@ngneat/cashew';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { environment } from '../../environments/environment';
import {
  IDMM_SHAFT_MATERIAL,
  RSY_BEARING,
  TBL_BEARING_PREFLIGHT,
  TBL_SHAFT_MATERIAL,
} from '../shared/constants/dialog-constant';
import { RuntimeRequesterService } from './runtime-requester.service';

describe('RuntimeRequesterService testing', () => {
  let service: RuntimeRequesterService;
  let spectator: SpectatorService<RuntimeRequesterService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: RuntimeRequesterService,
    imports: [HttpClientTestingModule, HttpCacheInterceptorModule],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('getDataTable should call loadPreflight if id is preflight', () => {
    const mockTableId = TBL_BEARING_PREFLIGHT;
    const mockModel = {
      rootObject: {} as ModelObject,
      method: 'mockMethod',
    };
    const mockObject = {} as ModelObject;
    const mockControlMap = {} as Map<string, Map<string, FormGroup>>;

    service['loadPreflight'] = jest.fn();

    service.getDataTable(mockTableId, mockModel, mockObject, mockControlMap);

    expect(service['loadPreflight']).toHaveBeenCalledTimes(1);
  });

  test('getDataTable should call loadShaftMaterials if id is preflight', () => {
    const mockTableId = TBL_SHAFT_MATERIAL;
    const mockModel = {
      rootObject: {} as ModelObject,
      method: 'mockMethod',
    };
    const mockObject = {} as ModelObject;
    const mockControlMap = {} as Map<string, Map<string, FormGroup>>;

    service['loadShaftMaterials'] = jest.fn();

    service.getDataTable(mockTableId, mockModel, mockObject, mockControlMap);

    expect(service['loadShaftMaterials']).toHaveBeenCalledTimes(1);
  });

  test('getDataTable should return an Obserable', () => {
    const mockTableId = 'prettymuchanything';
    const mockModel = {
      rootObject: {} as ModelObject,
      method: 'mockMethod',
    };
    const mockObject = {} as ModelObject;
    const mockControlMap = {} as Map<string, Map<string, FormGroup>>;

    expect(
      service.getDataTable(mockTableId, mockModel, mockObject, mockControlMap)
    ).toEqual({});
  });

  test('loadPreflight should trigger a preflight http POST request', () => {
    const mock = {} as any;
    const mockModelObject = { id: RSY_BEARING } as ModelObject;
    const mockControlMap: Map<string, Map<string, FormGroup>> = new Map();

    const mockInnerControlMap: Map<string, FormGroup> = new Map();
    mockInnerControlMap.set(RSY_BEARING, {
      value: { value: 'mockValue' },
    } as FormGroup);
    mockControlMap.set(RSY_BEARING, mockInnerControlMap);

    service['loadPreflight'](mockModelObject, mockControlMap).subscribe();

    const req = httpMock.expectOne(
      `${environment.apiMMBaseUrl}${environment.preflightPath}`
    );
    expect(req.request.method).toBe('POST');
    req.flush(mock);
  });

  test('loadShaftMaterials should trigger a bearingsmaterial response http GET request', () => {
    const mock = {} as any;
    const mockMaterial = 'Gummistahl';
    const mockModelObject = { id: IDMM_SHAFT_MATERIAL } as ModelObject;
    const mockControlMap: Map<string, Map<string, FormGroup>> = new Map();

    const mockInnerControlMap: Map<string, FormGroup> = new Map();
    mockInnerControlMap.set(IDMM_SHAFT_MATERIAL, {
      value: { value: mockMaterial },
    } as FormGroup);
    mockControlMap.set(IDMM_SHAFT_MATERIAL, mockInnerControlMap);

    service['loadShaftMaterials'](mockModelObject, mockControlMap).subscribe();

    const req = httpMock.expectOne(
      `${environment.apiMMBaseUrl}${environment.materialsPath}${mockMaterial}?cache$=true`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });
});
