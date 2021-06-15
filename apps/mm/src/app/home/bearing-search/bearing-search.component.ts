import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';

import { BearingOption, SearchEntry } from '../../shared/models';
import { RestService } from './../../core/services/rest/rest.service';

@Component({
  selector: 'mm-bearing-search',
  templateUrl: './bearing-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BearingSearchComponent implements OnInit {
  @Output() public bearing = new EventEmitter<string | undefined>();

  public myControl = new FormControl('');

  public options$: Observable<BearingOption[]> = of([]);

  public loading$ = new BehaviorSubject<boolean>(false);

  public constructor(private readonly restService: RestService) {}

  public ngOnInit(): void {
    this.options$ = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      filter((value) => value.length > 1),
      switchMap((value) => this.getBearings(value))
    );
  }

  public getBearings(searchQuery: string): Observable<BearingOption[]> {
    this.loading$.next(true);

    return this.restService.getBearingSearch(searchQuery).pipe(
      map((response) =>
        response.data.map((entry: SearchEntry) => {
          const { title, id } = entry.data;

          return { title, id };
        })
      ),
      tap(() => this.loading$.next(false))
    );
  }

  public handleSelection(selectionId: string): void {
    this.bearing.emit(selectionId);
  }
}
