import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ActiveCaseActions } from './active-case.action';
import { activeCaseFeature } from './active-case.reducer';

@Injectable({
  providedIn: 'root',
})
export class ActiveCaseFacade {
  costsUpdating$ = this.store.select(
    activeCaseFeature.selectUpdateCostsLoading
  );

  updateCostsSuccess$: Observable<void> = this.actions$.pipe(
    ofType(ActiveCaseActions.updateCostsSuccess)
  );

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions
  ) {}

  updateCosts(gqPosId: string): void {
    this.store.dispatch(ActiveCaseActions.updateCosts({ gqPosId }));
  }
}
