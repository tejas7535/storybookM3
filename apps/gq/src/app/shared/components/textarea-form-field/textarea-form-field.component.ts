import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-textarea-form-field',
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslocoDirective,
    MatFormFieldModule,
    SharedTranslocoModule,
  ],
  templateUrl: './textarea-form-field.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaFormFieldComponent),
      multi: true,
    },
  ],
})
export class TextareaFormFieldComponent implements ControlValueAccessor {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  public readonly translocoService = inject(TranslocoService);

  public readonly label = input('');
  public readonly inputMaxLength = input(200);
  public isInvalidInput = false;

  public value = '';

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  onPaste(event: ClipboardEvent, maxLength = this.inputMaxLength()): void {
    const pastedText = event.clipboardData?.getData('text/plain') || '';
    if (pastedText.length > maxLength) {
      this.isInvalidInput = true;

      // Clear the error after 3 seconds
      setTimeout(() => {
        this.isInvalidInput = false;
        this.changeDetectorRef.detectChanges();
      }, 3000);
    }
  }

  onInputChange(event: Event) {
    this.writeValue((event.target as HTMLInputElement).value);
  }

  writeValue(value: string): void {
    this.value = value;
    // Call the callbacks when component has been defined as FormControl in parent component
    if (this.onChange) {
      this.onChange(value);
    }
    if (this.onTouched) {
      this.onTouched();
    }
  }

  registerOnChange(callback: (value: string) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }
}
