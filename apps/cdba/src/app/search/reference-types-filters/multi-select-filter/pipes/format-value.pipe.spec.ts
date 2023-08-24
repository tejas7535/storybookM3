import { StringOption } from '@schaeffler/inputs';

import { FormatValuePipe } from './format-value.pipe';

describe('FormatValuePipe', () => {
  let pipe: FormatValuePipe;

  beforeEach(() => {
    pipe = new FormatValuePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should return nothing when option not defined', () => {
      let result = pipe.transform(undefined, true);
      expect(result).toBeUndefined();

      result = pipe.transform(undefined, false);
      expect(result).toEqual(`${undefined} | ${undefined}`);

      result = pipe.transform(undefined, undefined);
      expect(result).toEqual(`${undefined} | ${undefined}`);
    });

    it('should return title when autocomplete', () => {
      const option = { id: '001', title: 'Autocomplete' } as StringOption;
      const result = pipe.transform(option, true);

      expect(result).toEqual(option.title);
    });

    it('should return id - title when non autocomplete', () => {
      const option = { id: '001', title: 'Autocomplete' } as StringOption;
      const result = pipe.transform(option, false);

      expect(result).toEqual(`${option?.id} | ${option?.title}`);
    });
  });
});
