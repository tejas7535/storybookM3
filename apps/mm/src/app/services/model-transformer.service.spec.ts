import { ModelObject } from '@caeonline/dynamic-forms';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import {
  BxApiModel,
  BxApiObjectModel,
  ModelTransformer,
} from './model-transformer.service';

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

  test('api2local', () => {
    const spy = jest
      .spyOn(service, 'api2localObject')
      .mockImplementationOnce(() => ({} as ModelObject));
    const mockApiModel = {} as BxApiModel;

    service.api2local(mockApiModel);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('api2localObject', () => {
    const mockApiModel = {
      type: 'mockType',
      subTypes: ['mockSubtypes'],
      children: [],
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
});
