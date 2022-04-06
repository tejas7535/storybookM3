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
  public baseOptions$ = new BehaviorSubject<SearchAutocompleteOption[]>([]);
  public filteredOptions$!: Observable<SearchAutocompleteOption[]>;
  public showOptions$!: Observable<boolean>;
  public inputChange$!: Observable<string>;
  public valueSelected$!: Observable<boolean>;
  public control = new FormControl();
  public disabled = false;

  @Input() public label? = '';
  @Input() public options!: SearchAutocompleteOption[];
  @Input() public loading? = false;
  @Input() public loadingMessage? = '';
  @Input() public minimumChars = 3;
  @Input() public error? = false;
  @Input() public noResultsText? = 'No Results';
  @Input() public startsWith? = false;

  @Output() public readonly searchString = new EventEmitter<string>();
  @Output() public readonly selection = new EventEmitter<string | undefined>();

  private readonly subscriptions: Subscription[] = [];

  public constructor(private readonly cdRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.inputChange$ = this.control.valueChanges.pipe(
      filter(
        (value: string | SearchAutocompleteOption) => typeof value === 'string'
      )
    ) as Observable<string>;

    const debouncedSearchInput = this.inputChange$.pipe(
      filter((value: string) => this.shouldStartSearching(value)),
      debounceTime(300)
    );

    this.showOptions$ = this.inputChange$.pipe(
      map((value: string) => this.shouldStartSearching(value))
    );

    this.filteredOptions$ = combineLatest([
      debouncedSearchInput,
      this.baseOptions$,
    ]).pipe(
      map(([searchInput, options]) => this.filterOptions(options, searchInput))
    );

    this.valueSelected$ = this.control.valueChanges.pipe(
      map(
        (value: string | SearchAutocompleteOption) => typeof value !== 'string'
      )
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

  public ngOnChanges(changes: SimpleChanges): void {
    if ('options' in changes && this.options) {
      this.baseOptions$.next(this.options);
    }
  }

  public writeValue(value: string): void {
    this.control.setValue(value);
    this.cdRef.markForCheck();
  }

  public registerOnChange(fn: any): void {
    this.subscriptions.push(this.control.valueChanges.subscribe(fn));
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setValue(event: any): void {
    this.select(event.option.value);
    this.control.patchValue(event.option.value);
    this.onChange(event.id);
    this.onTouched();
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public select(selection: SearchAutocompleteOption): void {
    this.selection.emit(selection.id);
  }

  public clearSearchString(): void {
    this.control.setValue('');
  }

  public get searchStringDeletable(): boolean {
    return !!this.control.value;
  }

  public noResults(filteredList: SearchAutocompleteOption[] | null): boolean {
    return !this.loading && !this.error && filteredList?.length === 0;
  }

  public optionTitle(option: SearchAutocompleteOption): string {
    return option && option.title ? option.title : '';
  }

  public trackByFn: TrackByFunction<SearchAutocompleteOption> = (
    _index: number,
    val: SearchAutocompleteOption
  ): string => val.id;

  private filterOptions(
    options: SearchAutocompleteOption[],
    searchString: string
  ): SearchAutocompleteOption[] {
    const filterValue = searchString.toLowerCase();

    return options.filter((option: SearchAutocompleteOption) =>
      this.startsWith
        ? option.title.toLowerCase().indexOf(filterValue) === 0
        : option.title.toLowerCase().includes(filterValue)
    );
  }

  private shouldStartSearching(val: string): boolean {
    return val.length > this.minimumChars - 1;
  }

  public onChange: (value: string) => void = () => {};

  public onTouched: () => void = () => {};
}
