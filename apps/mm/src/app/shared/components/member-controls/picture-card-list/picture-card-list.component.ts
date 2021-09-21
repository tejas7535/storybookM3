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
  value: string;
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
  @Input() public options: PictureCardListOption[] = [];
  @Input() public translationRequired = false;

  public value: string;
  public disabled = false;

  public constructor(private readonly cdRef: ChangeDetectorRef) {}

  public writeValue(value: string): void {
    this.value = value;
    this.cdRef.markForCheck();
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public setValue(id: string): void {
    this.value = id;
    this.onChange(id);
    this.onTouched();
  }

  public triggerChange(): void {
    this.onChange(this.value);
    this.onTouched();
  }

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
}
