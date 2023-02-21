import { Injectable } from '@angular/core';

import { Keyboard } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class MaterialNumberService {
  private readonly MATERIAL_NUMBER_PATTERN = /^\d{9}-\d{4}(-\d{2})?$/;

  public isValidMaterialNumber(inputString: string): boolean {
    return this.MATERIAL_NUMBER_PATTERN.test(inputString);
  }

  public formatStringAsMaterialNumber(value: string): string {
    if (value?.length === 15) {
      return `${value.slice(0, 9)}-${value.slice(9, 13)}-${value.slice(13)}`;
    } else if (value?.length === 13) {
      return `${value.slice(0, 9)}-${value.slice(9, 13)}`;
    } else {
      return value || Keyboard.DASH;
    }
  }

  /**
   * starts a 'startWith' comparison with  a no-dash materialNumber with a dashed or no-dashed materialNumber search string
   * @param matNumber material number string without dashes
   * @param searchVal the searchVal with or without '-'
   * @returns true if the matNumber startsWith the searchString
   * */
  public matNumberStartsWithSearchString(
    matNumber: string,
    searchVal: string
  ): boolean {
    return matNumber?.startsWith(searchVal.replace(/-/g, ''));
  }
}
