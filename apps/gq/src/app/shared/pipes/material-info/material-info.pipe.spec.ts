import { MaterialDetails } from '../../models/quotation-detail';
import { MaterialInfoPipe } from './material-info.pipe';
import { MaterialTransformPipe } from '../material-transform/material-transform.pipe';

describe('MaterialInfoPipe', () => {
  let materialInfoPipe: MaterialInfoPipe;
  let materialTransformPipe: MaterialTransformPipe;
  beforeEach(() => {
    materialTransformPipe = new MaterialTransformPipe();
    materialInfoPipe = new MaterialInfoPipe(materialTransformPipe);
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
