import { IdValue } from '../../../models/search';
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
    const filterOptions = [new IdValue('001', 'test', false)];
    const selected = new IdValue('002', 'test2', false);

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
    const filterOptions = [new IdValue('001', 'test', false)];
    const selected = new IdValue('002', 'test2', false);

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
    const filterOptions = [new IdValue('001', 'test', false)];
    const selected = new IdValue('002', 'test2', false);

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
    const filterOptions: IdValue[] = [];
    const selected = new IdValue('002', 'test2', false);

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
    const opt = new IdValue('001', 'test', false);
    const filterOptions: IdValue[] = [opt];
    const selected: IdValue = opt;

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
    const opt = new IdValue('001', 'test', false);
    const opt2 = new IdValue('002', 'yikes', false);
    const filterOptions: IdValue[] = [opt, opt2];
    const selected: IdValue = opt;

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
