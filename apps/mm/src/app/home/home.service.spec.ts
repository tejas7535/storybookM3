import { FormControl, FormGroup } from '@angular/forms';
import {
  BearinxPageVariableMember,
  ModelObject,
  NestedPropertyMeta,
  PageMemberType,
  PageMeta,
  PageMetaStatus,
  VariablePropertyMeta,
} from '@caeonline/dynamic-forms';
import { SpectatorService, createServiceFactory } from '@ngneat/spectator';
import { Observable } from 'rxjs';

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

  describe('#constructPageMetas', () => {
    it('should construct pagedMetas from nestedPropertyMetas', () => {
      const pagedMetas = service.constructPagedMetas(mockNestedMetas);

      expect(pagedMetas[0].valid$).toBeInstanceOf(Observable);
      expect(pagedMetas[0].children).toEqual([mockChild, mockChild]);
      expect(pagedMetas[0].metas).toEqual([mockMeta, mockMeta, mockMeta]);
    });
  });

  describe('#extractMembers', () => {
    it('should return parent and child Metas at extractMembers', () => {
      const result = service['extractMembers'](mockNestedMeta);

      expect(result).toEqual([mockMeta, mockMeta, mockMeta]);
    });
  });
});
