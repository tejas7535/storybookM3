import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { Rfq4ProcessActions } from './rfq-4-process.actions';
import { rfq4ProcessFeature } from './rfq-4-process.reducer';

@Injectable({
  providedIn: 'root',
})
export class Rfq4ProcessFacade {
  private readonly store: Store = inject(Store);
  private readonly actions$: Actions = inject(Actions);

  findCalculatorsLoading$: Observable<boolean> = this.store.select(
    rfq4ProcessFeature.selectFindCalculatorsLoading
  );

  calculators$: Observable<string[]> = this.store.select(
    rfq4ProcessFeature.selectFoundCalculators
  );
  sendRecalculateSqvLoading$: Observable<boolean> = this.store.select(
    rfq4ProcessFeature.selectSendRecalculateSqvRequestLoading
  );
  sendRecalculateSqvSuccess$: Observable<void> = this.actions$.pipe(
    ofType(Rfq4ProcessActions.sendRecalculateSqvRequestSuccess)
  );

  // ########################################################
  // ###################  methods  ##########################
  // ########################################################

  findCalculators(gqPositionId: string): void {
    this.store.dispatch(Rfq4ProcessActions.findCalculators({ gqPositionId }));
  }

  clearCalculators(): void {
    this.store.dispatch(Rfq4ProcessActions.clearCalculators());
  }

  sendRecalculateSqvRequest(gqPositionId: string, message: string): void {
    this.store.dispatch(
      Rfq4ProcessActions.sendRecalculateSqvRequest({
        gqPositionId,
        message,
      })
    );
  }
}
