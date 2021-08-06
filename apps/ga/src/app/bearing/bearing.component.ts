import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { getBearingLoading } from '../core/store/selectors/bearing/bearing.selector';

@Component({
  selector: 'ga-bearing',
  templateUrl: './bearing.component.html',
})
export class BearingComponent implements OnInit {
  loading$: Observable<boolean>;

  public constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.loading$ = this.store.select(getBearingLoading);
  }
}
