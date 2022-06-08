import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  UntypedFormControl,
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
  public selectionControl = new UntypedFormControl();
  public selectedItem?: DropdownInputOption;

  public isMobile = false;

  public selectPanel: ElementRef | undefined = undefined;

  public constructor(private readonly cdRef: ChangeDetectorRef) {
    this.isMobile = /android/i.test(window.navigator.userAgent);
  }

  @HostListener('window:resize', ['$event'])
  public onResize() {
    setTimeout(() => {
      if (this.selectPanel && this.isMobile) {
        const overlayContainerStyle =
          this.selectPanel.nativeElement.parentElement.parentElement.style;
        const bottom = overlayContainerStyle.bottom;
        overlayContainerStyle.bottom = bottom > 0 ? bottom : '10px';
        overlayContainerStyle.top = 'auto';
      }
    }, 50);
  }

  public onOpenedChange(
    open: boolean,
    autocomplete: AutocompleteSearchComponent,
    selectPanel: ElementRef
  ) {
    if (open) {
      this.selectPanel = selectPanel;

      if (!this.isMobile) {
        autocomplete.focusInput();
      }
    } else {
      this.selectPanel = undefined;
    }
  }

  public onUpdateSearch(query: string): void {
    this.updateSearch.emit(query);
  }

  public writeValue(value: string): void {
    const controlValue = this.options.find(({ id }) => id === value);
    this.selectedItem = (controlValue ?? undefined) as DropdownInputOption;
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

  public setValue(inputOption: DropdownInputOption): void {
    if (
      inputOption &&
      this.options?.find((option) => option.id === inputOption.id)
    ) {
      const { value, id } = inputOption;
      this.selectionControl.patchValue(value);
      if (this.value !== id) {
        this.value = id;
        this.onChange(id);
        this.onTouched();
      }
    } else {
      this.selectionControl.reset();
    }
  }

  public onChange: (value: string | number) => void = () => {};

  public onTouched: () => void = () => {};
}
