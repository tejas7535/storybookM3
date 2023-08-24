import { StringOption } from '@schaeffler/inputs';

import { NoResultsFoundPipe } from './no-results-found.pipe';

describe('NoResultsFoundPipe', () => {
  let pipe: NoResultsFoundPipe;

  beforeEach(() => {
    pipe = new NoResultsFoundPipe();
  });
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return false when no searchStr is provided', () => {
    const filterOptions = [{ id: '001', title: 'test' } as StringOption];
    const selected: StringOption[] = [];

    const autoCompleteLoading = false;
    const debounceIsActive = false;

    const result = pipe.transform(
      filterOptions,
      selected,
      undefined,
      autoCompleteLoading,
      debounceIsActive
    );

    expect(result).toBeFalsy();
  });

  it('should return false when debounceIsActive', () => {
    const filterOptions = [{ id: '001', title: 'test' } as StringOption];
    const selected: StringOption[] = [];

    const searchStr = 'te';

    const autoCompleteLoading = false;
    const debounceIsActive = true;

    const result = pipe.transform(
      filterOptions,
      selected,
      searchStr,
      autoCompleteLoading,
      debounceIsActive
    );

    expect(result).toBeFalsy();
  });

  it('should return false when autoCompleteLoading', () => {
    const filterOptions = [{ id: '001', title: 'test' } as StringOption];
    const selected: StringOption[] = [];

    const searchStr = 'te';

    const autoCompleteLoading = true;
    const debounceIsActive = false;

    const result = pipe.transform(
      filterOptions,
      selected,
      searchStr,
      autoCompleteLoading,
      debounceIsActive
    );

    expect(result).toBeFalsy();
  });

  it('should return true when no options avl', () => {
    const filterOptions: StringOption[] = [];
    const selected: StringOption[] = [];

    const searchStr = 'te';

    const autoCompleteLoading = false;
    const debounceIsActive = false;

    const result = pipe.transform(
      filterOptions,
      selected,
      searchStr,
      autoCompleteLoading,
      debounceIsActive
    );

    expect(result).toBeTruthy();
  });

  it('should return true when only selected options avl', () => {
    const opt = { id: '001', title: 'test' } as StringOption;
    const filterOptions: StringOption[] = [opt];
    const selected: StringOption[] = [opt];

    const searchStr = 'te';

    const autoCompleteLoading = false;
    const debounceIsActive = false;

    const result = pipe.transform(
      filterOptions,
      selected,
      searchStr,
      autoCompleteLoading,
      debounceIsActive
    );

    expect(result).toBeTruthy();
  });

  it('should return true when only selected options avl or searchStr is not part of filterOption', () => {
    const opt = { id: '001', title: 'test' } as StringOption;
    const opt2 = { id: '002', title: 'yikes' } as StringOption;
    const filterOptions: StringOption[] = [opt, opt2];
    const selected: StringOption[] = [opt];

    const searchStr = 'te';

    const autoCompleteLoading = false;
    const debounceIsActive = false;

    const result = pipe.transform(
      filterOptions,
      selected,
      searchStr,
      autoCompleteLoading,
      debounceIsActive
    );

    expect(result).toBeTruthy();
  });
});
