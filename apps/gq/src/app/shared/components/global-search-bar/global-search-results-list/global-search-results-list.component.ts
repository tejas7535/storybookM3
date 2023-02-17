import { Component, EventEmitter, Input, Output } from '@angular/core';

import { QuotationSearchResult } from '../../../models/quotation';

const INITIAL_ROW_COUNT = 3;
@Component({
  selector: 'gq-global-search-results-list',
  templateUrl: './global-search-results-list.component.html',
})
export class GlobalSearchResultsListComponent {
  @Input() gqCases: QuotationSearchResult[];
  @Input() searchVal = '';
  @Output() gqIdSelected = new EventEmitter<QuotationSearchResult>();

  public count = INITIAL_ROW_COUNT;

  /**
   * increase the count of items to display
   */
  public increaseCount(): void {
    this.count = this.gqCases
      ? Math.min(this.count + 5, this.gqCases.length)
      : 0;
  }
}
