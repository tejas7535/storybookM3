import { Injectable } from '@angular/core';

import { map, mergeMap } from 'rxjs';

import { StaticStorageService } from '@ea/core/services/static-storage.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { StorageMessagesActions } from '../../actions';
import { MaintenanceMessage } from '../../models/maintenance-message';

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
