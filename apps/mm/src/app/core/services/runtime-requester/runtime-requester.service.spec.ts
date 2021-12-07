import { FormGroup } from '@angular/forms';

import { of } from 'rxjs';

import { ModelObject } from '@caeonline/dynamic-forms';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { BEARING_PREFLIGHT_RESPONSE_MOCK } from '../../../../testing/mocks/rest.service.mock';
import {
  IDMM_SHAFT_MATERIAL,
  RSY_BEARING,
  TBL_BEARING_PREFLIGHT,
  TBL_SHAFT_MATERIAL,
} from '../../../shared/constants/dialog-constant';
import { PreflightRequestBody } from '../../../shared/models';
import { RestService } from '../';
import { BEARING_MATERIAL_RESPONSE_MOCK } from './../../../../testing/mocks/rest.service.mock';
import { RuntimeRequesterService } from './runtime-requester.service';

describe('RuntimeRequesterService testing', () => {
  let service: RuntimeRequesterService;
  let spectator: SpectatorService<RuntimeRequesterService>;

  const createService = createServiceFactory({
    service: RuntimeRequesterService,
    providers: [
      {
        provide: RestService,
        useValue: {
          getBearingPreflightResponse: jest.fn(() =>
            of(BEARING_PREFLIGHT_RESPONSE_MOCK)
          ),
          getBearingsMaterialResponse: jest.fn(() =>
            of(BEARING_MATERIAL_RESPONSE_MOCK)
          ),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  describe('#getDataTable', () => {
    it('should call loadPreflight if id is preflight', () => {
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

    it('should call loadShaftMaterials if id is preflight', () => {
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

    it('should return an Obserable', () => {
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
  });

  describe('#loadPreflight', () => {
    it('should call getBearingPreflighResponse', () => {
      const mockModelObject = { id: RSY_BEARING } as ModelObject;
      const mockControlMap: Map<string, Map<string, FormGroup>> = new Map();

      const mockInnerControlMap: Map<string, FormGroup> = new Map();
      mockInnerControlMap.set(RSY_BEARING, {
        value: { value: 'mockValue' },
      } as FormGroup);
      mockControlMap.set(RSY_BEARING, mockInnerControlMap);

      service['loadPreflight'](mockModelObject, mockControlMap).subscribe();

      expect(
        service['restService'].getBearingPreflightResponse
      ).toHaveBeenCalledWith({
        IDCO_DESIGNATION: 'mockValue',
      } as PreflightRequestBody);
    });
  });

  describe('#loadShaftMaterials', () => {
    it('should call getBearingsMaterialResponse at loadShaftMaterials', () => {
      const mockMaterial = 'Gummistahl';
      const mockModelObject = { id: IDMM_SHAFT_MATERIAL } as ModelObject;
      const mockControlMap: Map<string, Map<string, FormGroup>> = new Map();

      const mockInnerControlMap: Map<string, FormGroup> = new Map();
      mockInnerControlMap.set(IDMM_SHAFT_MATERIAL, {
        value: { value: mockMaterial },
      } as FormGroup);
      mockControlMap.set(IDMM_SHAFT_MATERIAL, mockInnerControlMap);

      service['loadShaftMaterials'](
        mockModelObject,
        mockControlMap
      ).subscribe();

      expect(
        service['restService'].getBearingsMaterialResponse
      ).toHaveBeenCalledWith(mockMaterial);
    });
  });
});
