import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { DataService } from '../../../../shared/result/services/data.service';
import {
  loadTranslationForFile,
  loadTranslationForFileFailure,
  loadTranslationForFileSuccess,
  loadTranslationForText,
  loadTranslationForTextFailure,
  loadTranslationForTextSuccess,
  resetAll,
  resetTranslation,
} from '../../actions';
import { TranslationFileInput } from '../../reducers/translation/models/translation-file-input.model';
import { TranslationTextInput } from '../../reducers/translation/models/translation-text-input.model';
import { TranslationState } from '../../reducers/translation/translation.reducer';

/**
 * Effect class for all translation related actions which trigger side effects
 */
@Injectable()
export class TranslationEffects {
  /**
   * Effect to send text to API and receive the translation
   */
  loadTranslationText$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTranslationForText.type),
      map((action: any) => {
        return action.textInput;
      }),
      concatMap((textInput: TranslationTextInput) =>
        this.dataService.postTranslationText(textInput).pipe(
          map((translation: string) =>
            loadTranslationForTextSuccess({ translation })
          ),
          catchError((_e) => of(loadTranslationForTextFailure()))
        )
      )
    )
  );

  /**
   * Effect to send file to API and receive the translation
   */
  loadTranslationFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTranslationForFile.type),
      map((action: any) => {
        return action.fileInput;
      }),
      concatMap((fileInput: TranslationFileInput) =>
        this.dataService.postTranslationFile(fileInput).pipe(
          map((translation: string) =>
            loadTranslationForFileSuccess({ translation })
          ),
          catchError((_e) => of(loadTranslationForFileFailure()))
        )
      )
    )
  );

  /**
   * Effect to reset translation
   */
  resetTranslation$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(resetAll.type),
        tap(() => {
          this.store.dispatch(resetTranslation());
        })
      ),
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly dataService: DataService,
    protected readonly store: Store<TranslationState>
  ) {}
}
