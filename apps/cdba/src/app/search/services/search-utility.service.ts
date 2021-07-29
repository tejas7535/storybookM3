import { Injectable } from '@angular/core';

import { IdValue } from '../../core/store/reducers/search/models';

@Injectable({
  providedIn: 'root',
})
export class SearchUtilityService {
  /**
   * Merge provided selected options with given options of a filter item.
   */
  public mergeOptionsWithSelectedOptions(
    options: IdValue[],
    selectedOptions: IdValue[]
  ): IdValue[] {
    const currentSelections: IdValue[] = [];
    let newItems = options.map((it: IdValue) => ({
      ...it,
      selected:
        selectedOptions.some((item) => item.id === it.id) || it.selected,
    }));

    selectedOptions.forEach((option: IdValue) => {
      const selectedOptionFound = newItems.find((it) => it.id === option.id);
      if (!selectedOptionFound) {
        currentSelections.push(option);
      }
    });

    newItems = [...newItems, ...currentSelections];

    return newItems;
  }
}
