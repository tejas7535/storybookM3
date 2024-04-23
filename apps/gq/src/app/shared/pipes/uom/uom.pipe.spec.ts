import { translate, TranslocoModule } from '@jsverse/transloco';

import { UomPipe } from './uom.pipe';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('UomPipe', () => {
  it('create an instance', () => {
    const pipe = new UomPipe();
    expect(pipe).toBeTruthy();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("should translate 'ST' units", () => {
    const pipe = new UomPipe();
    pipe.transform('ST');

    expect(translate).toHaveBeenCalledTimes(1);
    expect(translate).toHaveBeenCalledWith('shared.quotationDetailsTable.ST');
  });
  test("should translate 'PC' units", () => {
    const pipe = new UomPipe();
    pipe.transform('PC');

    expect(translate).toHaveBeenCalledTimes(1);
    expect(translate).toHaveBeenCalledWith('shared.quotationDetailsTable.ST');
  });

  test('should NOT translate other units', () => {
    const pipe = new UomPipe();
    pipe.transform('kg');

    expect(translate).not.toHaveBeenCalled();
  });
});
