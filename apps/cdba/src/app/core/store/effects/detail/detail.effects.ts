/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
/* eslint-disable no-invalid-this */
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';

import { exhaustMap, of } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import { RoleFacade } from '@cdba/core/auth/role.facade';
import { DetailService } from '@cdba/detail/service/detail.service';
import { BomItem, Drawing, ReferenceTypeIdentifier } from '@cdba/shared/models';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import {
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculations,
  loadCalculationsFailure,
  loadCalculationsSuccess,
  loadDrawings,
  loadDrawingsFailure,
  loadDrawingsSuccess,
  loadReferenceType,
  loadReferenceTypeFailure,
  loadReferenceTypeSuccess,
  selectCalculation,
  selectReferenceType,
} from '../../actions';
import {
  getBomIdentifierForSelectedCalculation,
  getSelectedReferenceTypeIdentifier,
} from '../../selectors/details/detail.selector';

@Injectable()
export class DetailEffects {
  loadReferenceType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReferenceType),
      concatLatestFrom(() =>
        this.store.select(getSelectedReferenceTypeIdentifier)
      ),
      map(([_action, refTypeIdentifier]) => refTypeIdentifier),
      mergeMap((refTypeIdentifier: ReferenceTypeIdentifier) =>
        this.detailService.getDetails(refTypeIdentifier).pipe(
          map((referenceType) => loadReferenceTypeSuccess({ referenceType })),
          catchError((error: HttpErrorResponse) =>
            of(
              loadReferenceTypeFailure({
                errorMessage: error.error.detail || error.message,
                statusCode: error.status,
              })
            )
          )
        )
      )
    )
  );

  loadCalculations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadCalculations),
      concatLatestFrom(() => [
        this.store.select(getSelectedReferenceTypeIdentifier),
        this.roleFacade.hasAnyPricingRole$,
      ]),
      exhaustMap(([, referenceTypeIdentifier, hasPricingRole]) => {
        return referenceTypeIdentifier && hasPricingRole
          ? this.detailService
              .getCalculations(
                referenceTypeIdentifier.materialNumber,
                referenceTypeIdentifier.plant
              )
              .pipe(
                map((result) =>
                  loadCalculationsSuccess({
                    calculations: result.items,
                    excludedCalculations: result.excludedItems,
                    referenceTypeIdentifier,
                  })
                ),
                catchError((error: HttpErrorResponse) =>
                  of(
                    loadCalculationsFailure({
                      errorMessage: error.error.detail || error.message,
                      statusCode: error.status,
                    })
                  )
                )
              )
          : of(
              loadCalculationsFailure({
                errorMessage: 'User has no valid cost roles.',
                statusCode: undefined,
              })
            );
      })
    );
  });

  loadDrawings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDrawings),
      concatLatestFrom(() =>
        this.store.select(getSelectedReferenceTypeIdentifier)
      ),
      map(([_action, refTypeIdentifier]) => refTypeIdentifier),
      mergeMap(({ materialNumber, plant }: ReferenceTypeIdentifier) =>
        this.detailService.getDrawings(materialNumber, plant).pipe(
          map((items: Drawing[]) => loadDrawingsSuccess({ items })),
          catchError((error: HttpErrorResponse) =>
            of(
              loadDrawingsFailure({
                errorMessage: error.error.detail || error.message,
                statusCode: error.status,
              })
            )
          )
        )
      )
    )
  );

  triggerBomLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectCalculation, loadCalculationsSuccess),
      concatLatestFrom(() =>
        this.store.select(getBomIdentifierForSelectedCalculation)
      ),
      map(([_action, bomIdentifier]) => bomIdentifier),
      filter((bomIdentifier) => bomIdentifier !== undefined),
      map((bomIdentifier) => loadBom({ bomIdentifier }))
    )
  );

  loadBom$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadBom),
      concatLatestFrom(() => this.roleFacade.hasAnyPricingRole$),
      exhaustMap(([action, hasPricingRole]) => {
        return hasPricingRole
          ? this.detailService.getBom(action.bomIdentifier).pipe(
              map((items: BomItem[]) => loadBomSuccess({ items })),
              catchError((error: HttpErrorResponse) =>
                of(
                  loadBomFailure({
                    errorMessage: error.error.detail || error.message,
                    statusCode: error.status,
                  })
                )
              )
            )
          : of(
              loadBomFailure({
                errorMessage: 'User has no valid cost roles.',
                statusCode: undefined,
              })
            );
      })
    );
  });

  triggerDataLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectReferenceType),
      mergeMap(() => [loadReferenceType(), loadCalculations(), loadDrawings()])
    )
  );

  selectReferenceType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      filter(
        (routerState) => routerState.url.indexOf(AppRoutePath.DetailPath) === 1
      ),
      map((routerState) =>
        DetailEffects.mapQueryParamsToIdentifier(routerState.queryParams)
      ),
      filter((referenceTypeIdentifier: ReferenceTypeIdentifier) => {
        if (referenceTypeIdentifier === undefined) {
          this.router.navigate(['not-found']);
        }

        return referenceTypeIdentifier !== undefined;
      }),
      concatLatestFrom(() =>
        this.store.select(getSelectedReferenceTypeIdentifier)
      ),
      filter(
        ([identifierFromRoute, identifierCurrent]) =>
          !DetailEffects.checkEqualityOfIdentifier(
            identifierFromRoute,
            identifierCurrent
          )
      ),
      map(([identifierFromRoute, _identifierCurrent]) => identifierFromRoute),
      map((referenceTypeIdentifier: ReferenceTypeIdentifier) =>
        selectReferenceType({ referenceTypeIdentifier })
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly detailService: DetailService,
    private readonly store: Store,
    private readonly roleFacade: RoleFacade,
    private readonly router: Router
  ) {}

  private static mapQueryParamsToIdentifier(
    queryParams: Params
  ): ReferenceTypeIdentifier {
    const materialNumber = queryParams['material_number'];
    const { plant } = queryParams;

    return materialNumber && plant
      ? {
          materialNumber,
          plant,
        }
      : undefined;
  }

  private static checkEqualityOfIdentifier(
    fromRoute: ReferenceTypeIdentifier,
    current: ReferenceTypeIdentifier
  ): boolean {
    return (
      fromRoute.materialNumber === current?.materialNumber &&
      fromRoute.plant === current.plant
    );
  }
}
