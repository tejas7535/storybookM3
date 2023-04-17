import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { HelperService } from '@gq/shared/services/helper/helper.service';
import { calculateMargin } from '@gq/shared/utils/pricing.utils';

import { QuotationSearchResult } from '../../../models/quotation';
@Component({
  selector: 'gq-global-search-results-item',
  templateUrl: './global-search-results-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchResultsItemComponent {
  @Input() set searchResult(searchResult: QuotationSearchResult) {
    this.quotationSummary = searchResult;

    const gpi = calculateMargin(
      searchResult.materialPrice,
      searchResult.materialGpc
    );

    this.materialGpi = this.helperService.transformPercentage(gpi);
  }
  @Output() gqIdSelected = new EventEmitter<QuotationSearchResult>();
  @Output() contextMenu = new EventEmitter<MouseEvent>();

  materialGpi: string;
  quotationSummary: QuotationSearchResult;

  constructor(private readonly helperService: HelperService) {}
}
