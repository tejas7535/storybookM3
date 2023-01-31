import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  UntypedFormControl,
} from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatSelectChange } from '@angular/material/select';

import { IdValue } from '../models';

@Component({
  selector: 'ia-select-input',
  templateUrl: './select-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectInputComponent,
      multi: true,
    },
  ],
})
export class SelectInputComponent implements ControlValueAccessor {
  LEVEL_MARGIN_PX = 8;
  @Input() label: string;
  @Input() hint: string;
  @Input() options: IdValue[];
  @Input() set selectedOption(selectedOption: string) {
    this.selectControl.setValue(selectedOption);
    const option = this.findOptionById(selectedOption);
    this.onChange(option);
    this.onTouched();
  }

  @Input() set disabled(disable: boolean) {
    if (disable) {
      this.selectControl.disable();
    } else {
      this.selectControl.enable();
    }
  }

  @Input() appearance: MatFormFieldAppearance = 'fill';

  @Output() readonly selected: EventEmitter<IdValue> = new EventEmitter();

  selectControl = new UntypedFormControl({ value: '', disabled: false });

  selectionChange(evt: MatSelectChange): void {
    const option = this.findOptionById(evt.value);

    this.emitChange(option);
    this.onChange(option);
    this.onTouched();
  }

  emitChange(option: IdValue): void {
    this.selected.emit(option);
  }

  findOptionById(selectedOption: string) {
    return this.options.find((opt) => opt.id === selectedOption);
  }

  writeValue(selectedOption: string): void {
    this.selectControl.setValue(selectedOption);
  }

  registerOnChange(fn: (value: IdValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.selectControl.disable();
    } else {
      this.selectControl.enable();
    }
  }

  trackByFn(index: number, _item: IdValue): number {
    return index;
  }

  onChange: (value: IdValue) => void = () => {};
  onTouched: () => void = () => {};
}
