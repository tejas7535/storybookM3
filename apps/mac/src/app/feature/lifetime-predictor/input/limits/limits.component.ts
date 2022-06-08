import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { HvLimits } from '../../models';

@Component({
  selector: 'mac-ltp-limits',
  templateUrl: './limits.component.html',
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class LimitsComponent implements OnChanges {
  @Input() hv: number;
  @Input() hv_upper: number;
  @Input() hv_lower: number;
  @Output() public readonly adjust: EventEmitter<HvLimits> = new EventEmitter();
  upperMax: number;
  lowerMin: number;
  limitForm = new UntypedFormGroup({
    hv_lower: new UntypedFormControl({ value: '', disabled: true }),
    hv_upper: new UntypedFormControl({ value: '', disabled: true }),
  });

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.hv.previousValue !== changes.hv.currentValue) {
      this.adjustSliders();
    }
  }

  /**
   * Set new hv_upper nd hv_lower values and adjust validators
   */
  public adjustSliders(): void {
    this.upperMax = Math.round(this.hv * 1.1);
    this.lowerMin = Math.round(this.hv * 0.9);
    this.limitForm.controls.hv_lower.patchValue(this.hv);
    this.limitForm.controls.hv_upper.patchValue(this.hv);
  }

  /**
   * Sets value of slider and number inputs
   */
  public patchLimits(value: number, type: string): void {
    this.limitForm.controls[type].patchValue(value);
    const limits: HvLimits = {
      hv_lower: this.limitForm.controls.hv_lower.value,
      hv_upper: this.limitForm.controls.hv_upper.value,
    };
    this.adjust.emit(limits);
  }

  /**
   * corrects value of number input if it exceeds min or max
   */
  public patchInput(srcElement: any, type: string): void {
    // TODO: remove any
    const { value, min, max } = srcElement;
    let patchedValue = value;
    if (patchedValue < min) {
      patchedValue = min;
    } else if (patchedValue > max) {
      patchedValue = max;
    }
    this.patchLimits(patchedValue, type);
  }
}
