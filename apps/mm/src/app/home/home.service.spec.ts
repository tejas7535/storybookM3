import { FormControl, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import {
  BearinxPageVariableMember,
  ModelObject,
  NestedPropertyMeta,
  PageMemberType,
  PageMeta,
  PageMetaStatus,
  VariablePropertyMeta,
} from '@caeonline/dynamic-forms';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import {
  RSY_BEARING,
  RSY_BEARING_SERIES,
  RSY_BEARING_TYPE,
  RSY_PAGE_BEARING_TYPE,
} from '../shared/constants/dialog-constant';
import { HomeService } from './home.service';

describe('HomeService', () => {
  let spectator: SpectatorService<HomeService>;
  let service: HomeService;
  const createService = createServiceFactory(HomeService);
  const mockMeta = {
    page: {} as PageMeta,
    type: {} as PageMemberType,
    member: {} as BearinxPageVariableMember<any>,
    memberObject: {} as ModelObject,
    change$: new Observable(),
    writable: false,
    control: new FormGroup({ test1: new FormControl('test1') }),
  } as VariablePropertyMeta;
  const mockChild = {
    metas: [],
    children: [],
  } as NestedPropertyMeta;
  const mockNestedMeta = {
    page: {} as PageMetaStatus,
    metas: [mockMeta, mockMeta, mockMeta],
    children: [mockChild, mockChild],
  } as NestedPropertyMeta;
  const mockNestedMetas = [mockNestedMeta, mockNestedMeta, mockNestedMeta];

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('constructPageMetas', () => {
    it('should construct pagedMetas from nestedPropertyMetas', () => {
      const pagedMetas = service.constructPagedMetas(mockNestedMetas);

      expect(pagedMetas[0].valid$).toBeInstanceOf(Observable);
      expect(pagedMetas[0].children).toEqual([mockChild, mockChild]);
      expect(pagedMetas[0].metas).toEqual([mockMeta, mockMeta, mockMeta]);
    });
  });

  describe('extractMembers', () => {
    it('should return parent and child Metas at extractMembers', () => {
      const result = service['extractMembers'](mockNestedMeta);

      expect(result).toEqual([mockMeta, mockMeta, mockMeta]);
    });
  });

  describe('getBearingParams', () => {
    it('should return parent and child Metas at extractMembers', () => {
      const mockedPagedMeta = [
        {
          page: {
            id: RSY_PAGE_BEARING_TYPE,
          },
          metas: [
            {
              member: {
                id: RSY_BEARING_TYPE,
              },
            },
            {
              member: {
                id: RSY_BEARING_SERIES,
              },
            },
            {
              member: {
                id: RSY_BEARING,
              },
            },
          ],
          controls: [
            { value: 4, status: 'VALID' },
            { value: 'LB_ZNR31', status: 'VALID' },
            { value: 123, status: 'VALID' },
          ],
          children: [
            {
              page: {
                id: 'RSY_PAGE_BEARING_SERIES',
              },
              metas: [
                {
                  member: {
                    optionsUrl: 'mockUrl',
                  },
                },
              ],
            },
            {
              page: {
                id: 'RSY_PAGE_BEARING',
              },
              metas: [
                {
                  member: {
                    optionsUrl: 'mockUrl',
                  },
                },
              ],
            },
          ],
        },
      ] as any[];

      const result = service['getBearingParams'](mockedPagedMeta);

      expect(result).toEqual({
        id: 123,
        url: 'mockUrl',
        params: [
          {
            name: 'RSY_BEARING_TYPE',
            value: 4,
          },
          {
            name: 'RSY_BEARING_SERIES',
            value: 'LB_ZNR31',
          },
        ],
      });
    });
  });
});
