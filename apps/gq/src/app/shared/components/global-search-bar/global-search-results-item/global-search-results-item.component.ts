import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { HelperService } from '@gq/shared/services/helper/helper.service';
import { PriceService } from '@gq/shared/services/price/price.service';

import { QuotationSearchResult } from '../../../models/quotation';
@Component({
  selector: 'gq-global-search-results-item',
  templateUrl: './global-search-results-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchResultsItemComponent {
  @Input() set searchResult(searchResult: QuotationSearchResult) {
    this.quotationSummary = searchResult;

    const gpi = PriceService.calculateMargin(
      PriceService.roundValue(
        searchResult.materialPrice,
        searchResult.materialQuantity
      ),
      PriceService.roundValue(
        searchResult.materialGpc,
        searchResult.materialQuantity
      )
    );

    this.materialGpi = this.helperService.transformPercentage(
      PriceService.roundToTwoDecimals(gpi)
    );
  }
  @Output() gqIdSelected = new EventEmitter<QuotationSearchResult>();
  @Output() contextMenu = new EventEmitter<MouseEvent>();

  materialGpi: string;
  quotationSummary: QuotationSearchResult;

  constructor(private readonly helperService: HelperService) {}
}
