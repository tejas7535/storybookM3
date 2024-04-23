import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator/jest';

import { MaterialDetails } from '../../models/quotation-detail';
import { MaterialNumberService } from '../../services/material-number/material-number.service';
import { MaterialInfoPipe } from './material-info.pipe';

describe('MaterialInfoPipe', () => {
  let spectator: SpectatorPipe<MaterialNumberService>;
  let materialInfoPipe: MaterialInfoPipe;
  let materialNumberService: MaterialNumberService;

  const createPipe = createPipeFactory({
    pipe: MaterialInfoPipe,
    providers: [MaterialNumberService],
  });

  beforeEach(() => {
    spectator = createPipe();
    materialNumberService = spectator.inject(MaterialNumberService);
    materialInfoPipe = new MaterialInfoPipe(materialNumberService);
  });

  test('create an instance', () => {
    expect(materialInfoPipe).toBeTruthy();
  });
  test('should transform material', () => {
    const materialNumberAndDescription = {
      materialNumber15: '1',
      materialDescription: 'test',
    } as MaterialDetails;
    const result = materialInfoPipe.transform(materialNumberAndDescription);

    expect(result).toBe(
      `${materialNumberAndDescription.materialNumber15} | ${materialNumberAndDescription.materialDescription}`
    );
  });
});
