import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TrackByFunction,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';

import { SearchAutocompleteOption } from './search-autocomple-option.model';

@Component({
  selector: 'schaeffler-search-autocomplete',
  templateUrl: './search-autocomplete.component.html',
  styleUrls: ['./search-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SearchAutocompleteComponent,
      multi: true,
    },
  ],
})
export class SearchAutocompleteComponent
  implements ControlValueAccessor, OnInit, OnChanges
{
  baseOptions$ = new BehaviorSubject<SearchAutocompleteOption[]>([]);
  filteredOptions$!: Observable<SearchAutocompleteOption[]>;
  showOptions$!: Observable<boolean>;
  inputChange$!: Observable<string>;
  valueSelected$!: Observable<boolean>;
  control = new FormControl();
  subscriptions: Subscription[] = [];
  disabled = false;

  @Input() label? = '';

  @Input() options!: SearchAutocompleteOption[];

  @Input() loading? = false;

  @Input() loadingMessage? = '';

  @Input() minimumChars = 3;

  @Input() error? = false;

  @Output() readonly searchString = new EventEmitter<string>();

  @Output() readonly selection = new EventEmitter<string | undefined>();

  private onChange: (value: string) => void = () => {};

  onTouched: () => void = () => {};

  trackByFn: TrackByFunction<SearchAutocompleteOption> = (
    _index: number,
    val: SearchAutocompleteOption
  ): string => {
    return val.id;
  };

  constructor(private readonly cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.inputChange$ = this.control.valueChanges.pipe(
      filter((value: string | SearchAutocompleteOption) => {
        return typeof value === 'string';
      })
    ) as Observable<string>;

    const debouncedSearchInput = this.inputChange$.pipe(
      filter((value: string) => this.shouldStartSearching(value)),
      debounceTime(300)
    );

    this.showOptions$ = this.inputChange$.pipe(
      map((value: string) => {
        return this.shouldStartSearching(value);
      })
    );

    this.filteredOptions$ = combineLatest([
      debouncedSearchInput,
      this.baseOptions$,
    ]).pipe(
      map(([searchInput, options]) => {
        return this.filter(options, searchInput);
      })
    );

    this.valueSelected$ = this.control.valueChanges.pipe(
      map((value: string | SearchAutocompleteOption) => {
        return typeof value !== 'string';
      })
    );

    this.control.valueChanges.subscribe((val: string) => {
      if (typeof val === 'string' && this.shouldStartSearching(val)) {
        this.searchString.emit(val);
      }
    });

    if (this.options) {
      this.baseOptions$.next(this.options);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('options' in changes && this.options) {
      this.baseOptions$.next(this.options);
    }
  }

  private filter(
    options: SearchAutocompleteOption[],
    searchString: string
  ): SearchAutocompleteOption[] {
    const filterValue = searchString.toLowerCase();

    return options.filter(
      (option: SearchAutocompleteOption) =>
        option.title.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private shouldStartSearching(val: string): boolean {
    return val.length > this.minimumChars - 1;
  }

  writeValue(value: string): void {
    this.control.setValue(value);
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.subscriptions.push(this.control.valueChanges.subscribe(fn));
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setValue(event: any): void {
    this.select(event.option.value);
    this.control.patchValue(event.option.value);
    this.onChange(event.id);
    this.onTouched();
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  select(selection: SearchAutocompleteOption): void {
    this.selection.emit(selection.id);
  }

  clearSearchString(): void {
    this.control.setValue('');
  }

  get searchStringDeletable(): boolean {
    return !!this.control.value;
  }

  noResults(filteredList: SearchAutocompleteOption[] | null): boolean {
    return !this.loading && !this.error && filteredList?.length === 0;
  }

  optionTitle(option: SearchAutocompleteOption): string {
    return option && option.title ? option.title : '';
  }
}
