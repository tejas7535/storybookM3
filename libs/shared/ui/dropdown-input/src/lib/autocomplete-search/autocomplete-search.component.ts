import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core/option';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { DropdownInputOption } from '../dropdown-input-option.model';

@Component({
  selector: 'schaeffler-autocomplete-search',
  templateUrl: './autocomplete-search.component.html',
  styleUrls: ['./autocomplete-search.component.scss'],
})
export class AutocompleteSearchComponent implements OnChanges {
  @Input() public options: DropdownInputOption[] = [];
  @Input() public hint!: string;
  @Input() public selectedItem?: DropdownInputOption;

  @Output() public optionSelected = new EventEmitter<DropdownInputOption>();
  @Output() public updateSearch = new EventEmitter<string>();

  @ViewChild('searchInput') public searchInput!: ElementRef;

  public filteredOptions$!: Observable<DropdownInputOption[]>;
  public searchControl = new FormControl('');

  public ngOnChanges(): void {
    this.filteredOptions$ = this.searchControl.valueChanges.pipe(
      startWith<string>(''),
      map((value: string) => {
        this.updateSearch.emit(value);

        return this.filter(value);
      })
    );

    this.optionSelected.emit(this.selectedItem);
  }

  public select(item: DropdownInputOption): void {
    this.optionSelected.emit(item);
    this.selectedItem = item;
  }

  public filter(f: string): DropdownInputOption[] {
    const filterValue = f.toLowerCase();

    return this.options.filter((option) =>
      option.value.toLowerCase().includes(filterValue)
    );
  }

  public focusInput(): void {
    this.searchControl.setValue('');
    this.searchInput.nativeElement.focus();
  }

  public onOptionSelect(selectionEvent: MatOptionSelectionChange): void {
    selectionEvent.source._getHostElement().click();
  }
}
