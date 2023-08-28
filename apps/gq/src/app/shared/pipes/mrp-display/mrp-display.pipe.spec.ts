import { Keyboard, MrpData } from '@gq/shared/models';

import { MRP_DATA_MOCK } from '../../../../testing/mocks';
import { MrpDisplayPipe } from './mrp-display.pipe';

describe('MrpDisplayPipe', () => {
  test('create an instance', () => {
    const pipe = new MrpDisplayPipe();
    expect(pipe).toBeTruthy();
  });

  test('should transform data', () => {
    const pipe = new MrpDisplayPipe();
    const mrpData: MrpData = MRP_DATA_MOCK;
    const expected = `${mrpData.mrpController} | ${mrpData.mrpControllerName}`;
    const result = pipe.transform(mrpData);

    expect(result).toEqual(expected);
  });
  test('should return dash', () => {
    const pipe = new MrpDisplayPipe();
    const mrpData: MrpData = undefined as any;
    const result = pipe.transform(mrpData);

    expect(result).toEqual(Keyboard.DASH);
  });
});
