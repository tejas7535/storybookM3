import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { Classification, TextInput } from '../../../../shared/result/models';
import { DataService } from '../../../../shared/result/services/data.service';
import {
  loadClassificationForText,
  loadClassificationForTextFailure,
  loadClassificationForTextSuccess,
  resetAll,
  resetClassifications,
} from '../../actions';
import { DreiDMasterState } from '../../reducers/drei-d-master/drei-d-master.reducer';

/**
 * Effect class for all classification related actions which trigger side effects
 */
@Injectable()
export class ClassificationEffects {
  /**
   * Effect to send text to API and receive Categories and possibilites
   */
  loadClassificationText$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadClassificationForText.type),
      map((action: any) => action.textInput),
      concatMap((textInput: TextInput) =>
        this.dataService.postClassificationText(textInput).pipe(
          map((classification: Classification) =>
            loadClassificationForTextSuccess({ classification })
          ),
          catchError((_e) => of(loadClassificationForTextFailure()))
        )
      )
    )
  );

  /**
   * Effect to reset tags
   */
  resetTags$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(resetAll.type),
        tap(() => {
          this.store.dispatch(resetClassifications());
        })
      ),
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly dataService: DataService,
    protected readonly store: Store<DreiDMasterState>
  ) {}
}
