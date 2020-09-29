import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { QueryItem } from '../../core/store/models';
import { SearchState } from '../../core/store/reducers/search/search.reducer';
import { getQueryList } from '../../core/store/selectors';

@Component({
  selector: 'gq-query-section',
  templateUrl: './query-section.component.html',
  styleUrls: ['./query-section.component.scss'],
})
export class QuerySectionComponent implements OnInit {
  /**
   * Improves performance of ngFor.
   */
  queryList$: Observable<QueryItem[]>;

  constructor(private readonly store: Store<SearchState>) {}

  public ngOnInit(): void {
    this.queryList$ = this.store.pipe(select(getQueryList));
  }

  public trackByFn(index: number): number {
    return index;
  }
}
