import { Injectable } from '@angular/core';

import { map, mergeMap } from 'rxjs';

import { MaintenanceMessage } from '@mm/shared/models';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { StaticStorageService } from '../../../services/static-storage/static-storage.service';
import { StorageMessagesActions } from '../../actions';

@Injectable()
export class StorageMessagesEffects {
  getStorageMessages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StorageMessagesActions.getStorageMessage),
      mergeMap(() =>
        this.staticStorageService.getMessage().pipe(
          mergeMap((message: MaintenanceMessage) => [
            StorageMessagesActions.setStorageMessage({
              message,
            }),
          ])
        )
      )
    );
  });

  setStorageMessages$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(StorageMessagesActions.setStorageMessage),
        map((properties) => {
          this.staticStorageService.dispatchMessage(properties.message);
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly staticStorageService: StaticStorageService
  ) {}
}
