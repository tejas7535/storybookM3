import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// TODO allow serval value types
interface PictureCardListOption {
  id: string;
  caption: string;
  imageUrl: string;
}
@Component({
  selector: 'mm-picture-card-list',
  templateUrl: './picture-card-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PictureCardListComponent,
      multi: true,
    },
  ],
})
export class PictureCardListComponent implements ControlValueAccessor {
  @Input() options: PictureCardListOption[] = [];

  value: string;
  disabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private readonly cdRef: ChangeDetectorRef) {}

  writeValue(value: string): void {
    this.value = value;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  setValue(id: string): void {
    this.value = id;
    this.onChange(id);
    this.onTouched();
  }
}
