import { IdValue } from '../../../../core/store/models';
import { SelectValuePipe } from './select-value.pipe';

describe('MultiSelectValuePipe', () => {
  let pipe: SelectValuePipe;

  beforeEach(() => {
    pipe = new SelectValuePipe();
  });
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string if values is not set', () => {
    const result = pipe.transform(undefined);

    expect(result).toEqual('');
  });

  it('should return value of item', () => {
    const item = new IdValue('1', 'value1', false);
    const result = pipe.transform(item);

    expect(result).toEqual('value1');
  });

  it('should return empty string', () => {
    const result = pipe.transform(undefined);

    expect(result).toEqual('');
  });
});
