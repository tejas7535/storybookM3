import { Pipe, PipeTransform } from '@angular/core';

import { StringOption } from '@schaeffler/inputs';

@Pipe({
  name: 'noResultsFound',
  standalone: false,
})
export class NoResultsFoundPipe implements PipeTransform {
  /**
   * Check if search has been active and no results are found.
   */
  public transform(
    filterOptions: StringOption[],
    selectedOptions: StringOption[],
    searchStr: string,
    autoCompleteLoading: boolean,
    debounceIsActive: boolean
  ): boolean {
    const noOptionsAtAll = filterOptions.length === 0;
    const onlySelectedOptions =
      filterOptions.filter(
        (it: StringOption) =>
          (selectedOptions && selectedOptions.find((sel) => sel === it)) ||
          (searchStr && !it.title.toLowerCase().includes(searchStr))
      ).length === filterOptions.length;

    return (
      (noOptionsAtAll || onlySelectedOptions) &&
      searchStr &&
      !autoCompleteLoading &&
      !debounceIsActive
    );
  }
}
