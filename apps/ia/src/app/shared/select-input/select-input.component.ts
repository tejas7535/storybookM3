import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
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

  @Output() readonly selected: EventEmitter<IdValue> = new EventEmitter();

  selectControl = new FormControl('');

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
