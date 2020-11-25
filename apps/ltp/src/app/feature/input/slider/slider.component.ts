import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

import { SliderControl } from './slider.model';

@Component({
  selector: 'ltp-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  // tslint:disable-next-line: use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class SliderComponent implements OnInit {
  @Input() control: SliderControl;

  public formOptions = { onlySelf: true, emitEvent: false };

  public ngOnInit(): void {
    this.control.formControl.setValidators(this.isValid(this.control));
    this.control.formControl.updateValueAndValidity();
    this.control.formControl.valueChanges.subscribe((value) =>
      this.control.formControl.patchValue(value, this.formOptions)
    );
    if (this.control.disabled === true || this.control.disabled === false) {
      this.setDisabled(this.control.disabled);
    } else {
      this.control.disabled.subscribe((disabled) => this.setDisabled(disabled));
    }
  }

  /**
   * Enables or disables this component's FormControl.
   */
  public setDisabled(disabled: boolean): void {
    disabled
      ? this.control.formControl.disable(this.formOptions)
      : this.control.formControl.enable(this.formOptions);
  }

  /**
   * Corrects invalid input values of the FormControl.
   */
  public validate(value: number): void {
    // too high
    if (value > this.control.max) {
      this.control.formControl.patchValue(this.control.max);
    }

    // too low
    if (value < this.control.min) {
      this.control.formControl.patchValue(this.control.min);
    }

    // false step
    if (this.moduloDecimals(value, this.control.step) !== 0) {
      this.control.formControl.patchValue(
        value - this.moduloDecimals(value, this.control.step)
      );
    }
  }

  /**
   * Validator function to set the status of the FormControl based on the current value.
   */
  public isValid(refControl: SliderControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (
        control.value <= refControl.max &&
        control.value >= refControl.min &&
        this.moduloDecimals(control.value, refControl.step) === 0
      ) {
        return undefined;
      }

      return { error: { value: control.value } };
    };
  }

  /**
   * Returns the modulo of two numbers which may be decimals depending on this component's step value.
   */
  public moduloDecimals(a: number, b: number): number {
    const numberOfDecimals = this.control.step.toString().split('.')[1]
      ? this.control.step.toString().split('.')[1].length
      : 0;
    const multiplier = Math.pow(10, numberOfDecimals);

    return ((a * multiplier) % (b * multiplier)) / multiplier;
  }
}
