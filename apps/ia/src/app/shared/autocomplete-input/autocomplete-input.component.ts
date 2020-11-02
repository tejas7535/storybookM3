import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';

import { Filter, IdValue } from '../models';
import { InputErrorStateMatcher } from './validation/input-error-state-matcher';

@Component({
  selector: 'ia-autocomplete-input',
  templateUrl: './autocomplete-input.component.html',
})
export class AutocompleteInputComponent implements OnInit {
  @Input() label: string;
  @Input() hint: string;
  @Input() filter: Filter = new Filter('', []);

  @Output() readonly selected: EventEmitter<Filter> = new EventEmitter();

  @ViewChild('matInput') private readonly matInput: ElementRef;

  inputControl = new FormControl('');
  filteredOptions: Observable<IdValue[]>;
  errorStateMatcher: ErrorStateMatcher;

  private lastEmittedValue = '';

  public ngOnInit(): void {
    this.filteredOptions = this.inputControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterOptions(value))
    );
    this.errorStateMatcher = new InputErrorStateMatcher(this.filter.options);
  }

  private filterOptions(value: string): IdValue[] {
    const filterValue = value.toLowerCase();

    return this.filter.options.filter((option: IdValue) =>
      option.value.toLowerCase().includes(filterValue)
    );
  }

  public optionSelected(_evt: any): void {
    this.matInput.nativeElement.blur();
  }

  public inputBlur(event: any): void {
    setTimeout(() => {
      const value = event.target.value;
      const option = this.filter.options.find((opt) => opt.id === value);

      if (!option) {
        this.inputControl.setErrors({
          invalidInput: translate('filters.invalidInputHint'),
        });
      } else {
        if (this.lastEmittedValue !== value) {
          this.lastEmittedValue = value;
          this.selected.emit({
            options: [option],
            name: this.filter.name,
          });
        }
      }
    }, 300);
  }

  public trackByFn(index: number, _item: IdValue): number {
    return index;
  }
}
