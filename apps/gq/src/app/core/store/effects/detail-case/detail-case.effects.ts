import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { of } from 'rxjs/internal/observable/of';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { MaterialDetailsService } from '../../../../detail-view/services/material-details.service';
import {
  loadMaterialInformation,
  loadMaterialInformationFailure,
  loadMaterialInformationSuccess,
  setSelectedQuotationDetail,
} from '../../actions';
import { DetailIdentifiers, MaterialDetails } from '../../models';

/**
 * Effect class for all tagging related actions which trigger side effects
 */
@Injectable()
export class DetailCaseEffects {
  /**
   * Get Material Number from Route and save it in the store
   *
   */
  getMaterial$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      filter(
        (routerState) =>
          routerState.url.indexOf(AppRoutePath.DetailViewPath) >= 0
      ),
      map(
        (routerState): DetailIdentifiers => ({
          materialNumber15: routerState.queryParams['materialNumber15'],
          gqPositionId: routerState.queryParams['gqPositionId'],
        })
      ),
      filter((materialIdentifiers: DetailIdentifiers) => {
        if (
          !materialIdentifiers.materialNumber15 ||
          !materialIdentifiers.gqPositionId
        ) {
          this.router.navigate(['not-found']);
        }

        return (
          (materialIdentifiers.materialNumber15 &&
            materialIdentifiers.gqPositionId) !== undefined
        );
      }),
      mergeMap((materialIdentifiers: DetailIdentifiers) => [
        loadMaterialInformation({
          materialNumber15: materialIdentifiers.materialNumber15,
        }),
        setSelectedQuotationDetail({
          gqPositionId: materialIdentifiers.gqPositionId,
        }),
      ])
    )
  );

  /**
   * Load Material Information
   *
   */
  loadMaterialInformation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMaterialInformation.type),
      mergeMap((action: any) =>
        this.materialDetailsService.loadMaterials(action.materialNumber15).pipe(
          map((options: MaterialDetails) =>
            loadMaterialInformationSuccess({ materialDetails: options })
          ),
          catchError((errorMessage) =>
            of(loadMaterialInformationFailure({ errorMessage }))
          )
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly materialDetailsService: MaterialDetailsService
  ) {}
}
