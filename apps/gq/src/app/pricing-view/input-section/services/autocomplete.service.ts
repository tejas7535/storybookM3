import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '../../../core/http/data.service';
import { FilterItem, IdValue, TextSearch } from '../../../core/store/models';

/**
 *  Auto-complete service
 */

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  private readonly PARAM_SEARCH_FOR = 'search_for';
  private readonly AUTO_COMPLETE = 'auto-complete';

  constructor(private readonly dataService: DataService) {}

  public autocomplete(textSearch: TextSearch): Observable<FilterItem> {
    const httpParams = new HttpParams().set(
      this.PARAM_SEARCH_FOR,
      textSearch.searchFor
    );

    return this.dataService
      .getAll<FilterItem>(
        `${this.AUTO_COMPLETE}/${textSearch.filter}`,
        httpParams
      )
      .pipe(
        map((item: FilterItem) => ({
          ...item,
          options: item.options,
        }))
      );
  }

  public mergeOptionsWithSelectedOptions(
    options: IdValue[],
    selectedOptions: IdValue[]
  ): IdValue[] {
    const currentSelections: IdValue[] = [];
    const newItems = options.map((option: IdValue) => ({
      ...option,
      selected: selectedOptions.find(
        (selectedOption) => selectedOption.id === option.id
      )
        ? true
        : option.selected,
    }));

    selectedOptions.forEach((option: IdValue) => {
      const selectedOptionFound = newItems.find(
        (item) => item.id === option.id
      );
      if (!selectedOptionFound) {
        currentSelections.push(option);
      }
    });

    return newItems.concat(currentSelections);
  }
}
