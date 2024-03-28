import { Component, HostBinding, Input, Optional, Self } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroupDirective,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';

import { NOOP_VALUE_ACCESSOR } from '../constants/input';
import { RadioButtonComponent } from '../radio-button/radio-button.component';

@Component({
  selector: 'ea-tabbed-suboption',
  standalone: true,
  imports: [RadioButtonComponent, ReactiveFormsModule],
  templateUrl: './tabbed-suboption.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class TabbedSuboptionComponent {
  @Input() formControl: FormControl | undefined;

  @Input() label!: string;
  @Input() name!: string;
  @Input() description!: string;
  @Input() isDisabled = false;

  constructor(@Self() @Optional() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = NOOP_VALUE_ACCESSOR;
    }
  }

  @HostBinding('class.grow-[2]') get selectedItemWidth() {
    return this.selected;
  }

  get control(): FormControl {
    return this.formControl || (this.ngControl?.control as FormControl);
  }

  get selected(): boolean {
    return this.isDisabled ? false : this.control?.value === this.name;
  }

  onClick(event: MouseEvent): void {
    if (this.selected) {
      return;
    }

    event.stopPropagation();
    event.stopImmediatePropagation();

    this.control?.setValue(this.name);
  }
}
