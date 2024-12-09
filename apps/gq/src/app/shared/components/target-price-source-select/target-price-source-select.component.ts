import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatSelect,
  MatSelectChange,
  MatSelectModule,
} from '@angular/material/select';

import { TargetPriceSource } from '@gq/shared/models/quotation/target-price-source.enum';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-target-price-source-select',
  templateUrl: './target-price-source-select.component.html',
  standalone: true,
  imports: [MatSelectModule, SharedTranslocoModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TargetPriceSourceSelectComponent),
      multi: true,
    },
  ],
})
export class TargetPriceSourceSelectComponent {
  @Input() appearance: 'fill' | 'outline' = 'fill';
  @Output() targetPriceSourceSelected: EventEmitter<TargetPriceSource> =
    new EventEmitter<TargetPriceSource>();

  @ViewChild('valueInput') valueInput: MatSelect;

  targetPriceSources: string[] = [
    TargetPriceSource.NO_ENTRY,
    TargetPriceSource.INTERNAL,
    TargetPriceSource.CUSTOMER,
  ];

  targetPriceSourceFormControl: FormControl = new FormControl({
    value: TargetPriceSource.NO_ENTRY,
    disabled: false,
  });

  private selectedTargetPriceSource: TargetPriceSource;
  // Declare Functions for ControlValueAccessor when Component is defined as a formControl in ParentComponent
  private onChange: (value: TargetPriceSource) => void;
  private onTouched: () => void;

  selectionChange(event: MatSelectChange): void {
    this.selectedTargetPriceSource = event.value;

    const valueToEmit = this.getValueToEmit();
    this.targetPriceSourceSelected.emit(valueToEmit);

    // Call the callbacks when component has been defined as FormControl in parent component
    if (this.onChange) {
      this.onChange(valueToEmit);
    }
    if (this.onTouched) {
      this.onTouched();
    }
  }

  focus(): void {
    this.valueInput.focus();
  }

  /**
   * Implementation of ControlValueAccessor
   * Writes the value to the formControls input property
   *
   */
  writeValue(type: TargetPriceSource): void {
    this.selectedTargetPriceSource = type;
    this.targetPriceSourceFormControl.setValue(this.selectedTargetPriceSource, {
      emitEvent: false,
    });
    // Call the callbacks when component has been defined as FormControl in parent component
    if (this.onChange) {
      this.onChange(this.getValueToEmit());
    }
    if (this.onTouched) {
      this.onTouched();
    }
  }
  /**
   * Implementation of ControlValueAccessor
   * Registers a callback for a changed value
   */
  registerOnChange(callback: (value: TargetPriceSource) => void): void {
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
      this.targetPriceSourceFormControl.disable();
    } else {
      this.targetPriceSourceFormControl.enable();
    }
  }

  private getValueToEmit(): TargetPriceSource {
    return this.selectedTargetPriceSource === TargetPriceSource.NO_ENTRY
      ? undefined
      : this.selectedTargetPriceSource;
  }
}
