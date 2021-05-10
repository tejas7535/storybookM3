import {
  Component,
  ElementRef,
  EventEmitter,
  Host,
  Input,
  OnInit,
  Optional,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatAutocompleteOrigin,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatOptionSelectionChange } from '@angular/material/core/option';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { DropdownInputOption } from '../dropdown-input-option.model';

@Component({
  selector: 'schaeffler-autocomplete-search',
  templateUrl: './autocomplete-search.component.html',
  styleUrls: ['./autocomplete-search.component.scss'],
})
export class AutocompleteSearchComponent implements OnInit {
  @Input() options: DropdownInputOption[] = [];
  @Input() hint!: string;
  @Input() attachToCustomElement = false;
  @Input() selectedItem?: DropdownInputOption;

  @Output() optionSelected = new EventEmitter<DropdownInputOption>();
  @Output() updateSearch = new EventEmitter<string>();

  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild(MatAutocompleteTrigger, { read: MatAutocompleteTrigger })
  _autocompleteTriggerElement!: MatAutocompleteTrigger;

  filteredOptions$!: Observable<DropdownInputOption[]>;
  searchControl = new FormControl('');

  constructor(
    @Host()
    @Optional()
    public readonly _autocompletePanelElement: MatAutocompleteOrigin
  ) {}

  ngOnInit(): void {
    this.filteredOptions$ = this.searchControl.valueChanges.pipe(
      startWith<string>(''),
      map((value) => {
        this.updateSearch.emit(value);
        return this.filter(value);
      })
    );

    if (this.selectedItem) {
      this.optionSelected.emit(this.selectedItem);
    }
  }

  public select(item: DropdownInputOption): void {
    this.optionSelected.emit(item);
    this.selectedItem = item;
  }

  public filter(f: string): DropdownInputOption[] {
    const filterValue = f.toLowerCase();
    return this.options.filter(
      (option) => option.value.toLowerCase().indexOf(filterValue) >= 0
    );
  }

  public focusInput(): void {
    this.searchControl.setValue('');
    this.searchInput.nativeElement.focus();
  }

  public openAutocompletePanel(): void {
    this._autocompleteTriggerElement.openPanel();
  }

  public onOptionSelect(selectionEvent: MatOptionSelectionChange): void {
    selectionEvent.source._getHostElement().click();
  }
}
