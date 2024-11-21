import { Injectable } from '@angular/core';

import { tap } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { Interaction } from '@cdba/shared/services/user-interaction/interaction-type.model';
import { UserInteractionService } from '@cdba/shared/services/user-interaction/user-interaction.service';

import { exportBomsSuccess } from '../../actions';

/**
 * Effects class for all effects which trigger interaction with the user
 */
@Injectable()
export class UserInteractionEffects {
  userInteractionOnExportBomsSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(exportBomsSuccess),
        tap(() => {
          this.userInteractionService.interact(Interaction.BOM_EXPORT_SUCCESS);
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly userInteractionService: UserInteractionService
  ) {}
}
