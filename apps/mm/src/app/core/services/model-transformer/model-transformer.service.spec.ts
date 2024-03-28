import { ModelObject } from '@caeonline/dynamic-forms';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { BxApiModel, BxApiObjectModel } from '../../../shared/models';
import { ModelTransformer } from './model-transformer.service';

describe('ModelTransformer testing', () => {
  let service: ModelTransformer;
  let spectator: SpectatorService<ModelTransformer>;

  const createService = createServiceFactory({
    service: ModelTransformer,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  describe('#api2local', () => {
    it('should call api2localObject', () => {
      const spy = jest
        .spyOn(service, 'api2localObject')
        .mockImplementationOnce(() => ({}) as ModelObject);
      const mockApiModel = {} as BxApiModel;

      service.api2local(mockApiModel);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#api2localObject', () => {
    it('should return local object', () => {
      const mockApiModelInner = {
        type: 'mockType2',
        subTypes: ['mockSubtypes2'],
        children: [],
        childList: 'mockChildList2',
        properties: [
          {
            name: 'mockName2',
          },
          {
            name: 'IDCO_IDENTIFICATION',
            value: 'mockValue2',
          },
        ],
      } as BxApiObjectModel;
      const mockApiModel = {
        type: 'mockType',
        subTypes: ['mockSubtypes'],
        children: [mockApiModelInner],
        childList: 'mockChildList',
        properties: [
          {
            name: 'mockName',
          },
          {
            name: 'IDCO_IDENTIFICATION',
            value: 'mockValue',
          },
        ],
      } as BxApiObjectModel;

      const result = service.api2localObject(mockApiModel);

      expect(result).toBeTruthy();
    });

    it('should throw an error if root object does not have the correct property id', async () => {
      const mockApiModel = {
        type: 'mockType',
        subTypes: ['mockSubtypes'],
        children: [],
        childList: 'mockChildList',
        properties: [
          {
            name: 'mockName',
          },
        ],
      } as BxApiObjectModel;

      await expect(
        new Promise((resolve, reject) => {
          try {
            resolve(service.api2localObject(mockApiModel));
          } catch (error) {
            reject(error);
          }
        })
      ).rejects.toThrowError(new Error('Cannot find Object Id Property'));

      expect(true).toEqual(true);
    });
  });
});
