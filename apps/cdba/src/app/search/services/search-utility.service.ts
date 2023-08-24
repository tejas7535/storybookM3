import { Injectable } from '@angular/core';

import { StringOption } from '@schaeffler/inputs';

@Injectable({
  providedIn: 'root',
})
export class SearchUtilityService {
  /**
   * Merge provided selected options with given options of a filter item.
   */
  public mergeOptionsWithSelectedOptions(
    options: StringOption[],
    selectedOptions: StringOption[]
  ): StringOption[] {
    if (selectedOptions.length > 0) {
      const selectionsToMerge: StringOption[] = [];
      const tmpOptions = [...options];

      selectedOptions.forEach((selectedOption: StringOption) => {
        const selectedOptionFound = tmpOptions.find(
          (item) => item.id === selectedOption.id
        );
        if (!selectedOptionFound) {
          selectionsToMerge.push(selectedOption);
        } else {
          /**
           * if selectedOption is in the options array then remove it from options
           * move it to the top of options and preserve selection order
           *
           */
          const index = tmpOptions.findIndex(
            (item) => item.id === selectedOption.id
          );
          tmpOptions.splice(index, 1);
          selectionsToMerge.push(selectedOption);
        }
      });

      return [...selectionsToMerge, ...tmpOptions];
    }

    return [...options];
  }
}
