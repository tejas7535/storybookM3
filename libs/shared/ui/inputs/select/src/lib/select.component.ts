import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChildren,
} from '@angular/core';
import { ControlValueAccessor, FormControl, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';

import { debounceTime, Subscription } from 'rxjs';

import { StringOption } from '@schaeffler/inputs';

@Component({
  selector: 'schaeffler-select',
  templateUrl: './select.component.html',
})
export class SelectComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input() public appearance: 'fill' | 'outline' = 'fill';
  @Input() public label = '';
  @Input() public placeholder = '';
  @Input() public searchPlaceholder = '';
  @Input() public addEntryPlaceholder = '';
  @Input() public hint = '';

  @Input() public initialValue?: StringOption;
  @Input() public initialSearchValue?: string;

  @Input() public stringOptions!: StringOption[];
  @Input() public loading?: boolean;
  @Input() public error?: boolean;
  @Input() public multiple?: boolean;
  @Input() public noResultsText = 'No Results';
  @Input() public addEntry?: boolean;
  @Input() public resetButton? = true;

  @Output() public readonly searchUpdated = new EventEmitter<string>();
  @Output() public readonly entryAdded = new EventEmitter<string>();
  @Output() public readonly optionRemoved = new EventEmitter<StringOption>();
  @Output() public readonly optionSelected = new EventEmitter<
    StringOption | StringOption[]
  >();

  @ViewChildren('selectOption') private readonly selectOptions!: MatOption[];

  @Input() public control = new FormControl();
  public searchControl = new FormControl();

  @Input() public filterFn?: (option: StringOption, value: string) => boolean;

  public addingEntry = false;

  private readonly subscription = new Subscription();

  public ngOnInit(): void {
    if (this.filterFn) {
      this.filterOptions = this.filterFn;
    }

    if (this.initialValue) {
      this.control.setValue(this.initialValue);
    }

    if (this.initialSearchValue) {
      this.searchControl.setValue(this.initialSearchValue);
      this.searchUpdated.emit(
        this.initialSearchValue.length > 1 ? this.initialSearchValue : ''
      );
    }

    this.subscription.add(
      this.control.valueChanges
        .pipe(debounceTime(100))
        .subscribe((value) => this.optionSelected.emit(value))
    );

    this.subscription.add(
      this.searchControl.valueChanges
        .pipe(debounceTime(500))
        .subscribe((value) =>
          this.searchUpdated.emit(value?.length > 1 ? value : '')
        )
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onChange: (value: StringOption | StringOption[]) => void = () => {};

  public onTouched: () => void = () => {};

  public writeValue(input: StringOption | StringOption[]): void {
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

  public select(matOption?: MatOption): void {
    matOption?.select();
  }

  public onSelectAllToggle(checked: boolean): void {
    if (checked) {
      this.selectOptions.map((option) => option.select());
    } else {
      this.selectOptions.map((option) => option.deselect());
    }
  }

  public onOptionRemoved(option: StringOption): void {
    this.optionRemoved.emit(option);
  }

  public onClickAddEntry(): void {
    this.addingEntry = true;
  }

  public onCancelAddEntry(): void {
    this.addingEntry = false;
  }

  public onConfirmAddEntry(value: string): void {
    this.entryAdded.emit(value);
    this.addingEntry = false;
  }

  public get filteredOptions(): StringOption[] {
    return this.stringOptions.filter((option) =>
      this.filterOptions(option, this.searchControl.value)
    );
  }

  public get currentValue(): string | string[] {
    if (this.multiple) {
      return this.control.value?.map((option: StringOption) => option.title);
    }

    return this.control.value?.title;
  }

  public get formControlRequired(): boolean {
    return this.control.hasValidator(Validators.required);
  }

  public filterOptions = (_option?: StringOption, _value?: string) => true;

  public compareWith = (option: StringOption, selection: StringOption) =>
    option.id === selection.id && option.title === selection.title;

  public trackByFn(index: number): number {
    return index;
  }
}
