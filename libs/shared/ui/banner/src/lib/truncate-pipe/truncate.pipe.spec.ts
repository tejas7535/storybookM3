import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  let pipe: TruncatePipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  test('it should truncate correctly', () => {
    expect(pipe.transform('foobar', 3)).toEqual('foo ...');
  });

  test('should truncate after words', () => {
    expect(pipe.transform('foobar foobar foobar', 10, true)).toEqual(
      'foobar ...'
    );
    expect(pipe.transform('foobar foobar foobar', 15, true)).toEqual(
      'foobar foobar ...'
    );
  });

  test('should return correct ellipses', () => {
    expect(pipe.transform('foobar foobar foobar', 10, true, '***')).toEqual(
      'foobar ***'
    );
    expect(pipe.transform('foobar foobar foobar', 15, true, '***')).toEqual(
      'foobar foobar ***'
    );
  });

  test('should not set an ellipsis if limit is over string lenght', () => {
    expect(pipe.transform('test', 100, false)).toEqual('test');
  });
});
