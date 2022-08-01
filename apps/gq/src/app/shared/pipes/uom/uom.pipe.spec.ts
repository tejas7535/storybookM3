import { translate, TranslocoModule } from '@ngneat/transloco';

import { UomPipe } from './uom.pipe';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
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

  test('should NOT translate other units', () => {
    const pipe = new UomPipe();
    pipe.transform('kg');

    expect(translate).not.toHaveBeenCalled();
  });
});
