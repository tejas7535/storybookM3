import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { Observable, of } from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';

import { environment } from '../../environments/environment';

interface BearingOption {
  id: string;
  title: string;
}

interface SearchEntry {
  data: BearingOption;
  links: [];
  _media?: any;
}

interface SearchResult {
  data: SearchEntry[];
}

@Component({
  selector: 'mm-bearing-search',
  templateUrl: './bearing-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BearingSearchComponent implements OnInit {
  @Output() bearing = new EventEmitter<string | undefined>();

  myControl = new FormControl();

  options$: Observable<BearingOption[]> = of([]);

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.options$ = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      filter((value) => value.length > 1),
      switchMap((value) => this.getBearings(value))
    );
  }

  getBearings(searchQuery: string): Observable<BearingOption[]> {
    const requestUrl = `${environment.apiMMBaseUrl}/bearing/search/?pattern=${searchQuery}&page=1&size=1000`;

    return this.http.get<SearchResult>(requestUrl).pipe(
      map((response) =>
        response.data.map((entry: SearchEntry) => {
          const { title, id } = entry.data;

          return { title, id };
        })
      )
    );
  }

  displayValue(option: BearingOption): string {
    return option && option.title ? option.title : '';
  }

  selectBearing(event: MatAutocompleteSelectedEvent): void {
    this.bearing.emit(event.option.value.id);
  }
}
