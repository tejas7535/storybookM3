import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

interface Limits {
  hv_lower: number;
  hv_upper: number;
}
@Component({
  selector: 'ltp-limits',
  templateUrl: './limits.component.html',
  styleUrls: ['./limits.component.scss'],
  // tslint:disable-next-line: use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None
})
export class LimitsComponent implements OnChanges {
  @Input() hv: number;
  @Input() hv_upper: number;
  @Input() hv_lower: number;
  @Output() public readonly adjust: EventEmitter<Limits> = new EventEmitter();
  upperMax: number;
  lowerMin: number;
  limitForm = new FormGroup({
    hv_lower: new FormControl({ value: '', disabled: true }),
    hv_upper: new FormControl({ value: '', disabled: true })
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
    this.limitForm.controls.hv_lower.patchValue(
      this.hv
      // Validators.compose([Validators.min(this.lowerMin), Validators.max(this.hv)]),
    );
    this.limitForm.controls.hv_upper.patchValue(
      this.hv
      // Validators.compose([Validators.min(this.hv), Validators.max(this.upperMax)]),
    );
  }

  /**
   * Sets value of slider and number inputs
   */
  public patchLimits(value: number, type: string): void {
    this.limitForm.controls[type].patchValue(value);
    const limits: Limits = {
      hv_lower: this.limitForm.controls.hv_lower.value,
      hv_upper: this.limitForm.controls.hv_upper.value
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
