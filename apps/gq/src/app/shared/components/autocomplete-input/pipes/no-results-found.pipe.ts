import { Pipe, PipeTransform } from '@angular/core';

import { IdValue } from '../../../models/search';

@Pipe({
  name: 'noResultsFoundPipe',
})
export class NoResultsFoundPipe implements PipeTransform {
  /**
   * Check if search has been active and no results are found.
   */
  public transform(
    filterOptions: IdValue[],
    selectedOption: IdValue,
    searchStr: string,
    autoCompleteLoading: boolean,
    debounceIsActive: boolean
  ): boolean {
    const noOptionsAtAll = filterOptions.length === 0;

    return (
      (noOptionsAtAll || selectedOption) &&
      searchStr &&
      !autoCompleteLoading &&
      !debounceIsActive
    );
  }
}
