import { IdValue } from '../../../core/store/reducers/search/models';
import { MultiSelectValuePipe } from './multi-select-value.pipe';

describe('MultiSelectValuePipe', () => {
  let pipe: MultiSelectValuePipe;

  beforeEach(() => {
    pipe = new MultiSelectValuePipe();
  });
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string if values is not set', () => {
    const result = pipe.transform(undefined);

    expect(result).toEqual('');
  });

  it('should return number of values as prefix including joined items', () => {
    const items = [
      new IdValue('1', 'value1', false),
      new IdValue('2', 'value2', false),
      new IdValue('3', 'value3', false),
    ];
    const result = pipe.transform(items);

    expect(result).toEqual('(3) value1,value2,value3');
  });
});
