import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { PriceService } from '@gq/shared/services/price-service/price.service';

import { QuotationSearchResult } from '../../../models/quotation';
@Component({
  selector: 'gq-global-search-results-item',
  templateUrl: './global-search-results-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchResultsItemComponent {
  @Input() set searchResult(searchResult: QuotationSearchResult) {
    this.quotationSummary = searchResult;

    this.materialGpi = PriceService.calculateMargin(
      PriceService.roundValue(
        searchResult.materialPrice,
        searchResult.materialQuantity
      ),
      PriceService.roundValue(
        searchResult.materialGpc,
        searchResult.materialQuantity
      )
    );
  }
  @Output() gqIdSelected = new EventEmitter<QuotationSearchResult>();

  materialGpi: number;
  quotationSummary: QuotationSearchResult;
}
