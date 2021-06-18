import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { AutocompleteSearchComponent } from './autocomplete-search/autocomplete-search.component';
import { DropdownInputOption } from './dropdown-input-option.model';

@Component({
  selector: 'schaeffler-dropdown-input',
  templateUrl: './dropdown-input.component.html',
  styleUrls: ['./dropdown-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DropdownInputComponent,
      multi: true,
    },
  ],
})
export class DropdownInputComponent implements ControlValueAccessor {
  @Input() public options: DropdownInputOption[] = [];
  @Input() public placeholder = '';
  @Input() public hint = '';
  @Input() public label = '';

  @Output() public updateSearch = new EventEmitter<string>();

  public value?: string | number;
  public disabled = false;
  public selectionControl = new FormControl();
  public selectedItem?: DropdownInputOption;

  public constructor(private readonly cdRef: ChangeDetectorRef) {}

  public onOpenedChange(
    open: boolean,
    autocomplete: AutocompleteSearchComponent,
    selectPanel: ElementRef
  ) {
    if (open) {
      selectPanel.nativeElement.parentElement.parentElement.parentElement.classList.add(
        'select-overlay'
      );
      autocomplete.focusInput();
    }
  }

  public onUpdateSearch(query: string): void {
    this.updateSearch.emit(query);
  }

  public writeValue(value: string): void {
    const controlValue = this.options.find(({ id }) => id === value);
    this.selectedItem = controlValue as DropdownInputOption;
    this.value = value;
    this.cdRef.markForCheck();
  }

  public registerOnChange(fn: (value: string | number) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public setValue({ value, id }: DropdownInputOption): void {
    this.selectionControl.patchValue(value);
    if (this.value !== id) {
      this.value = id;
      this.onChange(id);
      this.onTouched();
    }
  }

  private onChange: (value: string | number) => void = () => {};

  private onTouched: () => void = () => {};
}
