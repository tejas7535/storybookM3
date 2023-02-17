import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { QuotationSearchResult } from '../../../models/quotation';
@Component({
  selector: 'gq-global-search-results-item',
  templateUrl: './global-search-results-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchResultsItemComponent {
  @Input() searchResult: QuotationSearchResult;
  @Output() gqIdSelected = new EventEmitter<QuotationSearchResult>();
}
