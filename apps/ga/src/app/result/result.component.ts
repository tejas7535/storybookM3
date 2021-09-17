import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { previousStep } from '../core/store/actions/settings/settings.actions';
import {
  getResult,
  getResultId,
} from '../core/store/selectors/result/result.selector';

@Component({
  selector: 'ga-result',
  templateUrl: './result.component.html',
})
export class ResultComponent implements OnInit {
  public resultId$: Observable<string>;
  public resultState$: Observable<any>;

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.resultId$ = this.store.select(getResultId);
    this.resultState$ = this.store.select(getResult);
  }

  public navigateBack(): void {
    this.store.dispatch(previousStep());
  }
}
