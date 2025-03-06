import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import { PurchaseOrderTypeFacade } from '@gq/core/store/purchase-order-type/purchase-order-type.facade';
import { PurchaseOrderTypeModule } from '@gq/core/store/purchase-order-type/purchase-order-type.module';
import { PurchaseOrderType } from '@gq/shared/models';
import { LetDirective, PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  imports: [
    MatSelectModule,
    SharedTranslocoModule,
    PushPipe,
    ReactiveFormsModule,
    PurchaseOrderTypeModule,
    LetDirective,
  ],
  selector: 'gq-purchase-order-type-select',
  templateUrl: './purchase-order-type-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PurchaseOrderTypeSelectComponent),
      multi: true,
    },
  ],
})
export class PurchaseOrderTypeSelectComponent implements ControlValueAccessor {
  @Output() purchaseOrderTypeSelected: EventEmitter<PurchaseOrderType> =
    new EventEmitter<PurchaseOrderType>();

  @Input() appearance: 'fill' | 'outline' = 'fill';

  // default option
  readonly NO_ENTRY = { name: 'No Entry', id: 'NO_ENTRY' };

  purchaseOrderTypes$ = inject(PurchaseOrderTypeFacade).purchaseOrderTypes$;
  purchaseOrderTypeControl: FormControl = new FormControl({
    value: this.NO_ENTRY,
    disabled: false,
  });

  private selectedType: PurchaseOrderType;

  // Declare Functions for ControlValueAccessor when Component is defined as a formControl in ParentComponent
  private onChange: (value: PurchaseOrderType) => void;
  private onTouched: () => void;

  selectionChange(event: MatSelectChange): void {
    this.selectedType = event.value;
    const valueToEmit =
      this.selectedType.id === this.NO_ENTRY.id ? undefined : this.selectedType;

    this.purchaseOrderTypeSelected.emit(valueToEmit);

    // Call the callbacks when component has been defined as FormControl in parent component
    if (this.onChange) {
      this.onChange(valueToEmit);
    }
    if (this.onTouched) {
      this.onTouched();
    }
  }

  compareFn(
    optionOne: PurchaseOrderType,
    optionTwo: PurchaseOrderType
  ): boolean {
    return optionOne.id === optionTwo.id;
  }

  /**
   * Implementation of ControlValueAccessor
   * Writes the value to the formControls input property
   *
   */
  writeValue(type: PurchaseOrderType): void {
    // when formControl is initialized with undefined value, the default Value is to be set
    this.selectedType = type ?? this.NO_ENTRY;
    this.purchaseOrderTypeControl.setValue(this.selectedType, {
      emitEvent: false,
    });
  }

  /**
   * Implementation of ControlValueAccessor
   * Registers a callback for a changed value
   */
  registerOnChange(callback: (value: PurchaseOrderType) => void): void {
    this.onChange = callback;
  }

  /**
   * Implementation of ControlValueAccessor
   * Registers a callback for the touched state of the formControl
   */
  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  /**
   * Implementation of ControlValueAccessor
   *
   * @param isDisabled value to set the disabled state of the formControl
   */
  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.purchaseOrderTypeControl.disable();
    } else {
      this.purchaseOrderTypeControl.enable();
    }
  }
}
