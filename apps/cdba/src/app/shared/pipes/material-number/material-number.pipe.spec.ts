import { MaterialNumberPipe } from './material-number.pipe';

describe('MaterialNumberPipe', () => {
  let pipe: MaterialNumberPipe;

  beforeEach(() => {
    pipe = new MaterialNumberPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    let input: string;
    let result: string;
    beforeEach(() => {
      input = undefined;
      result = undefined;
    });

    it('should add a dash in a 13 digit material number', () => {
      input = '1111111112222';

      result = pipe.transform(input);

      expect(result).toEqual('111111111-2222');
    });

    it('should add two dashed in a 15 digit material number', () => {
      input = '111111111222233';

      result = pipe.transform(input);

      expect(result).toEqual('111111111-2222-33');
    });

    it('should not transform the input, if it is no 13/15 digits long', () => {
      input = '112233';

      result = pipe.transform(input);

      expect(result).toEqual('112233');
    });

    it('should return unefined if value is undefined', () => {
      input = undefined;

      result = pipe.transform(input);

      expect(result).toEqual(undefined);
    });
  });
});
