import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatSelectChange } from '@angular/material/select';

import { IdValue } from '../models';

@Component({
  selector: 'ia-select-input',
  templateUrl: './select-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectInputComponent {
  @Input() label: string;
  @Input() hint: string;
  @Input() options: IdValue[];
  @Input() set selectedOption(selectedOption: string) {
    this.selectControl.setValue(selectedOption);
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

  selectControl = new UntypedFormControl({ value: '', disabled: true });

  public selectionChange(evt: MatSelectChange): void {
    const option = this.options.find((opt) => opt.id === evt.value);

    this.emitChange(option);
  }

  public emitChange(option: IdValue): void {
    this.selected.emit(option);
  }

  public trackByFn(index: number, _item: IdValue): number {
    return index;
  }
}
