import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { AutocompleteSearchComponent } from './autocomplete-search/autocomplete-search.component';
import { DropdownInputOption } from './dropdown-input-option.model';

@Component({
  selector: 'schaeffler-dropdown-input',
  templateUrl: './dropdown-input.component.html',
  styleUrls: ['./dropdown-input.component.scss'],
})
export class DropdownInputComponent {
  @Output()
  optionSelected = new EventEmitter<DropdownInputOption>();
  @Output() updateSearch = new EventEmitter<string>();
  @Input() options: DropdownInputOption[] = [];
  @Input() placeholder = '';
  @Input() hint = '';

  selectionControl = new FormControl();

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

  public select(item: DropdownInputOption): void {
    this.selectionControl.patchValue(item.value);
    this.optionSelected.emit(item);
  }

  public onUpdateSearch(query: string): void {
    this.updateSearch.emit(query);
  }
}
