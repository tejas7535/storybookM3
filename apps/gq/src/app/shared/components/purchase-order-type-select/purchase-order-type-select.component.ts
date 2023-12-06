import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import { PurchaseOrderTypeFacade } from '@gq/core/store/purchase-order-type/purchase-order-type.facade';
import { PurchaseOrderTypeModule } from '@gq/core/store/purchase-order-type/purchase-order-type.module';
import { PurchaseOrderType } from '@gq/shared/models';
import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    SharedTranslocoModule,
    PushPipe,
    ReactiveFormsModule,
    PurchaseOrderTypeModule,
  ],
  selector: 'gq-purchase-order-type-select',
  templateUrl: './purchase-order-type-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseOrderTypeSelectComponent {
  @Input() appearance: 'fill' | 'outline' = 'fill';
  @Output() purchaseOrderTypeSelected: EventEmitter<PurchaseOrderType> =
    new EventEmitter<PurchaseOrderType>();

  purchaseOrderTypes$ = inject(PurchaseOrderTypeFacade).purchaseOrderTypes$;

  emptyValue: PurchaseOrderType = { name: 'No Entry', id: 'NO_ENTRY' };

  purchaseOrderTypeControl: FormControl = new FormControl({
    value: this.emptyValue,
    disabled: false,
  });

  selectionChange(event: MatSelectChange): void {
    const selected: PurchaseOrderType = event.value;
    this.purchaseOrderTypeSelected.emit(
      selected.id === this.emptyValue.id ? undefined : selected
    );
  }

  compareFn(
    optionOne: PurchaseOrderType,
    optionTwo: PurchaseOrderType
  ): boolean {
    return optionOne.id === optionTwo.id;
  }

  trackByFn(index: number): number {
    return index;
  }
}
