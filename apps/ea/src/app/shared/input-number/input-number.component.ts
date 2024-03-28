import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroupDirective,
  NgControl,
  ReactiveFormsModule,
  UntypedFormControl,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { NOOP_VALUE_ACCESSOR } from '../constants/input';
import { InfoButtonComponent } from '../info-button/info-button.component';

@Component({
  selector: 'ea-input-number',
  templateUrl: './input-number.component.html',
  standalone: true,
  imports: [
    InfoButtonComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    SharedTranslocoModule,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class InputNumberComponent implements OnInit, OnDestroy {
  @Input() public formControl: UntypedFormControl | undefined;
  @Input() public placeholder?: string;
  @Input() public hint?: string;
  @Input() public label?: string;
  @Input() public unit?: string;
  @Input() public onlyPositive? = false;
  @Input() public tooltip?: string;
  @Input() public customErrors?: { name: string; message?: string }[];
  @Input() public stepSize?: number;

  destroy$ = new Subject<void>();

  constructor(@Self() @Optional() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = NOOP_VALUE_ACCESSOR;
    }
  }

  get control(): FormControl {
    return this.formControl || (this.ngControl?.control as FormControl);
  }

  ngOnInit(): void {
    this.control?.valueChanges
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe((value) => {
        if (value && this.onlyPositive) {
          this.control.patchValue(Math.abs(value));
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
