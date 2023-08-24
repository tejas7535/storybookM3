import { StringOption } from '@schaeffler/inputs';

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
      { id: '1', title: 'title1' } as StringOption,
      { id: '2', title: 'title2' } as StringOption,
      { id: '3', title: 'title3' } as StringOption,
    ];
    const result = pipe.transform(items);

    expect(result).toEqual('(3) title1,title2,title3');
  });
});
