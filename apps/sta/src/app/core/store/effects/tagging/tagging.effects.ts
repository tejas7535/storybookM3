import { of } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { DataService } from '../../../../shared/result/services/data.service';

import { FileReplacement } from '../../../../shared/result/models';
import {
  loadTagsForFile,
  loadTagsForFileFailure,
  loadTagsForFileSuccess,
  loadTagsForText,
  loadTagsForTextFailure,
  loadTagsForTextSuccess,
  resetAll,
  resetTags,
} from '../../actions';
import { TaggingState } from '../../reducers/tagging/tagging.reducer';

/**
 * Effect class for all tagging related actions which trigger side effects
 */
@Injectable()
export class TaggingEffects {
  /**
   * Effect to send text to API and receive tags
   */
  loadTagsText$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTagsForText.type),
      map((action: any) => {
        return action.text;
      }),
      concatMap((text: string) =>
        this.dataService.postTaggingText(text).pipe(
          map((tags: string[]) => loadTagsForTextSuccess({ tags })),
          catchError((_e) => of(loadTagsForTextFailure()))
        )
      )
    )
  );

  /**
   * Effect to send file to API and receive tags
   */
  loadTagsFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTagsForFile.type),
      map((action: any) => {
        return action.file;
      }),
      concatMap((file: FileReplacement) =>
        this.dataService.postTaggingFile(file).pipe(
          map((tags: string[]) => loadTagsForFileSuccess({ tags })),
          catchError((_e) => of(loadTagsForFileFailure()))
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
          this.store.dispatch(resetTags());
        })
      ),
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly dataService: DataService,
    protected readonly store: Store<TaggingState>
  ) {}
}
