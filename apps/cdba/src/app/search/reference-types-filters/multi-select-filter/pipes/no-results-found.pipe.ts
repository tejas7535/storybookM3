import { Pipe, PipeTransform } from '@angular/core';

import { IdValue } from '../../../../core/store/reducers/search/models';

@Pipe({
  name: 'noResultsFound',
})
export class NoResultsFoundPipe implements PipeTransform {
  /**
   * Check if search has been active and no results are found.
   */
  public transform(
    filterOptions: IdValue[],
    selectedOptions: IdValue[],
    searchStr: string,
    autoCompleteLoading: boolean,
    debounceIsActive: boolean
  ): boolean {
    const noOptionsAtAll = filterOptions.length === 0;
    const onlySelectedOptions =
      filterOptions.filter(
        (it: IdValue) =>
          (selectedOptions && selectedOptions.find((sel) => sel === it)) ||
          (searchStr && !it.value.toLowerCase().includes(searchStr))
      ).length === filterOptions.length;

    return (
      (noOptionsAtAll || onlySelectedOptions) &&
      searchStr &&
      !autoCompleteLoading &&
      !debounceIsActive
    );
  }
}
