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
  @Output() updateSearch = new EventEmitter<string>();

  @Input() options: DropdownInputOption[] = [];

  @Input() placeholder = '';

  @Input() hint = '';

  value = '';

  disabled = false;

  selectionControl = new FormControl();

  private onChange: (value: string) => void = () => {};

  private onTouched: () => void = () => {};

  constructor(private readonly cdRef: ChangeDetectorRef) {}

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

  setValue(event: any): void {
    this.selectionControl.patchValue(event.value);
    this.value = event.id;
    this.onChange(event.id);
    this.onTouched();
  }
}
