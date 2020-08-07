import { IdValue } from '../../../../core/store/reducers/search/models';
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
    it('should return nothing when idValue not defined', () => {
      let result = pipe.transform(undefined, true);
      expect(result).toBeUndefined();

      result = pipe.transform(undefined, false);
      expect(result).toEqual(`${undefined} | ${undefined}`);

      result = pipe.transform(undefined, undefined);
      expect(result).toEqual(`${undefined} | ${undefined}`);
    });

    it('should return value when autocomplete', () => {
      const idValue = new IdValue('001', 'Autocomplete', true);
      const result = pipe.transform(idValue, true);

      expect(result).toEqual(idValue.value);
    });

    it('should return id - value when non autocomplete', () => {
      const idValue = new IdValue('001', 'Autocomplete', true);
      const result = pipe.transform(idValue, false);

      expect(result).toEqual(`${idValue?.id} | ${idValue?.value}`);
    });
  });
});
