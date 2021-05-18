import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';

import {
  PriceSource,
  QuotationDetail,
  UpdatePrice,
} from '../../../../shared/models/quotation-detail';
import { HelperService } from '../../../../shared/services/helper-service/helper-service.service';
import { PriceService } from '../../../../shared/services/price-service/price.service';

@Component({
  selector: 'gq-manual-price',
  templateUrl: './manual-price.component.html',
  styleUrls: ['./manual-price.component.scss'],
})
export class ManualPriceComponent implements OnChanges, OnInit, OnDestroy {
  manualPriceFormControl: FormControl;
  editMode = false;
  gpi: number;
  price: number;
  _isLoading: boolean;

  title$: Observable<string>;
  private readonly subscription: Subscription = new Subscription();

  @Input() userHasGPCRole: boolean;
  @Input() quotationDetail: QuotationDetail;
  @Input() currency: string;
  @Input() userHasManualPriceRole: boolean;

  @Input() set isLoading(value: boolean) {
    this._isLoading = this.isLoading && value;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  @Output() readonly selectManualPrice = new EventEmitter<UpdatePrice>();

  constructor(private readonly translocoService: TranslocoService) {
    this.title$ = this.translocoService.selectTranslate(
      'filterPricing.manualPrice.title',
      {},
      'detail-view'
    );
  }

  ngOnInit(): void {
    // check if price set equals GQ price
    this.setPrice();
    // init form control
    this.manualPriceFormControl = new FormControl(this.price?.toString());
    // set gpi
    this.setGpi();

    this.addSubscriptions();
  }

  ngOnChanges(): void {
    this.setPrice();
    if (this.manualPriceFormControl) {
      this.manualPriceFormControl.setValue(this.price?.toString());
      this.setGpi();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addSubscriptions(): void {
    // add subscription for value changes on formControl
    this.subscription.add(
      this.manualPriceFormControl.valueChanges.subscribe(() => {
        this.setGpi();
      })
    );
  }
  setPrice(): void {
    this.price =
      this.quotationDetail.price === this.quotationDetail.recommendedPrice
        ? undefined
        : this.quotationDetail.price;
  }

  setGpi(): void {
    this.gpi = PriceService.calculateMargin(
      this.manualPriceFormControl.value,
      this.quotationDetail.gpc
    );
  }

  openEditing(): void {
    this.editMode = true;
  }

  onKeyPress(event: KeyboardEvent, manualPriceInput: { value: number }): void {
    HelperService.validateNumberInputKeyPress(event, manualPriceInput);
  }

  onPaste(event: ClipboardEvent): void {
    HelperService.validateNumberInputPaste(event, this.manualPriceFormControl);
  }

  selectPrice(): void {
    this._isLoading = true;
    this.editMode = false;
    const updatePrice = new UpdatePrice(
      this.manualPriceFormControl.value,
      PriceSource.MANUAL
    );
    this.selectManualPrice.emit(updatePrice);
  }
}
