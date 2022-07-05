import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, FormControl, Validators } from '@angular/forms';

import { debounceTime, filter, Subscription } from 'rxjs';

import { StringOption } from '@schaeffler/inputs';

@Component({
  selector: 'schaeffler-search',
  templateUrl: './search.component.html',
})
export class SearchComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input() public appearance: 'fill' | 'outline' = 'fill';
  @Input() public label = '';
  @Input() public placeholder = '';
  @Input() public hint = '';

  @Input() public stringOptions!: StringOption[];
  @Input() public loading?: boolean;
  @Input() public error?: boolean;
  @Input() public noResultsText = 'No Results';
  @Input() public displayWith: 'id' | 'title' = 'title';

  @Output() public readonly searchUpdated = new EventEmitter<string>();
  @Output() public readonly optionSelected = new EventEmitter<
    StringOption | StringOption[]
  >();

  @Input() public control = new FormControl();

  public searchControl = new FormControl();

  @Input() public filterFn?: (option: StringOption, value: string) => boolean;

  private readonly subscription = new Subscription();

  public ngOnInit(): void {
    if (this.filterFn) {
      this.filterOptions = this.filterFn;
    }

    this.subscription.add(
      this.control.valueChanges
        .pipe(debounceTime(100))
        .subscribe((value) => this.optionSelected.emit(value))
    );

    this.subscription.add(
      this.searchControl.valueChanges
        .pipe(
          debounceTime(500),
          filter((value) => typeof value === 'string')
        )
        .subscribe((value) =>
          this.searchUpdated.emit(value.length > 1 ? value : '')
        )
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onChange: (value: StringOption) => void = () => {};

  public onTouched: () => void = () => {};

  public writeValue(input: StringOption): void {
    this.control.setValue(input);
    this.onTouched();
    this.onChange(input);
  }

  public registerOnChange(fn: any): void {
    this.subscription.add(this.control.valueChanges.subscribe(fn));
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public onOptionSelected(option: StringOption): void {
    this.control.setValue(option);
  }

  public onSearchReset(): void {
    this.searchControl.setValue('');
    this.control.reset();
  }

  public get filteredOptions(): StringOption[] {
    const value =
      typeof this.searchControl.value === 'string'
        ? this.searchControl.value
        : '';

    return this.stringOptions.filter((option) =>
      this.filterOptions(option, value)
    );
  }

  public get formControlRequired(): boolean {
    return this.control.hasValidator(Validators.required);
  }

  public displayWithFn = (option: StringOption): string =>
    this.displayWith === 'title' ? option?.title : option?.id.toString();

  public filterOptions = (_option?: StringOption, _value?: string) => true;

  public trackByFn(index: number): number {
    return index;
  }
}
