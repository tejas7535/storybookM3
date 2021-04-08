import { MaterialDetails } from '../../../core/store/models';
import { MaterialInfoPipe } from './material-info.pipe';

describe('MaterialInfoPipe', () => {
  test('create an instance', () => {
    const pipe = new MaterialInfoPipe();
    expect(pipe).toBeTruthy();
  });
  test('should transform material', () => {
    const materialNumberAndDescription = ({
      materialNumber15: '1',
      materialDescription: 'test',
    } as unknown) as MaterialDetails;
    const pipe = new MaterialInfoPipe();
    const result = pipe.transform(materialNumberAndDescription);

    expect(result).toBe(
      `| ${materialNumberAndDescription.materialNumber15} | ${materialNumberAndDescription.materialDescription}`
    );
  });
});
