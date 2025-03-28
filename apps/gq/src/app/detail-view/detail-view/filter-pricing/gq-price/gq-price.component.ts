import {
  Component,
  computed,
  EventEmitter,
  Input,
  input,
  Output,
} from '@angular/core';

import {
  PriceSource,
  QuotationDetail,
  UpdatePrice,
} from '@gq/shared/models/quotation-detail';
import { calculateMargin } from '@gq/shared/utils/pricing.utils';

import { DetailRoutePath } from '../../../detail-route-path.enum';

@Component({
  selector: 'gq-price',
  templateUrl: './gq-price.component.html',
  standalone: false,
})
export class GqPriceComponent {
  @Output() readonly selectGqPrice = new EventEmitter<UpdatePrice>();

  userHasGPCRole = input<boolean>();
  userHasSQVRole = input<boolean>();
  currency = input<string>();
  isDisabled = input<boolean>();
  isDetailsButtonVisible = input<boolean>();
  quotationDetail = input<QuotationDetail>();

  gpi = computed(() =>
    calculateMargin(
      this.quotationDetail().recommendedPrice,
      this.quotationDetail().gpc
    )
  );
  gpm = computed(() =>
    calculateMargin(
      this.quotationDetail().recommendedPrice,
      this.quotationDetail().sqv
    )
  );
  gpmRfq = computed(() =>
    calculateMargin(
      this.quotationDetail().recommendedPrice,
      this.quotationDetail().rfqData?.sqv
    )
  );
  isSelected = computed(() =>
    [PriceSource.GQ, PriceSource.STRATEGIC].includes(
      this.quotationDetail().priceSource
    )
  );

  PriceSource = PriceSource;
  DetailRoutePath = DetailRoutePath;

  private _isLoading: boolean;

  get isLoading(): boolean {
    return this._isLoading;
  }

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures,@typescript-eslint/member-ordering
  @Input() set isLoading(value: boolean) {
    this._isLoading = this.isLoading && value;
  }

  selectPrice(): void {
    this._isLoading = true;
    const priceSource = this.quotationDetail().strategicPrice
      ? PriceSource.STRATEGIC
      : PriceSource.GQ;
    const price =
      this.quotationDetail().strategicPrice ??
      this.quotationDetail().recommendedPrice;
    this.selectGqPrice.emit(new UpdatePrice(price, priceSource));
  }
}
