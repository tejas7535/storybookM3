/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
/* eslint-disable no-invalid-this */
import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';

import { exhaustMap, of } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { SnackBarService } from '@schaeffler/snackbar';

import {
  BomItem,
  Calculation,
  Drawing,
  ReferenceTypeIdentifier,
} from '@cdba/shared/models';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import { DetailService } from '@cdba/detail/service/detail.service';
import { RoleFacade } from '@cdba/core/auth/role.facade';
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
import { ReferenceTypeResult } from '../../reducers/detail/models';
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
          tap((item) =>
            item.referenceTypeDto.isPcmRow
              ? this.snackbarService.showInfoMessage(
                  translate('detail.shared.pcmRowHint')
                )
              : undefined
          ),
          map((item: ReferenceTypeResult) =>
            loadReferenceTypeSuccess({ item })
          ),
          catchError((errorMessage) =>
            of(loadReferenceTypeFailure({ errorMessage }))
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
              .calculations(
                referenceTypeIdentifier.materialNumber,
                referenceTypeIdentifier.plant
              )
              .pipe(
                map((items: Calculation[]) =>
                  loadCalculationsSuccess({ items })
                ),
                catchError((errorMessage) =>
                  of(loadCalculationsFailure({ errorMessage }))
                )
              )
          : of(loadCalculationsFailure({ errorMessage: 'unauthorized' }));
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
          catchError((errorMessage) =>
            of(loadDrawingsFailure({ errorMessage }))
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
              catchError((errorMessage) => of(loadBomFailure({ errorMessage })))
            )
          : of(loadBomFailure({ errorMessage: 'unauthorized' }));
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
    private readonly router: Router,
    private readonly snackbarService: SnackBarService
  ) {}

  private static mapQueryParamsToIdentifier(
    queryParams: Params
  ): ReferenceTypeIdentifier {
    const materialNumber = queryParams['material_number'];
    const identificationHash = queryParams['identification_hash'];

    const { plant } = queryParams;

    return materialNumber && plant && identificationHash
      ? {
          materialNumber,
          plant,
          identificationHash,
        }
      : undefined;
  }

  private static checkEqualityOfIdentifier(
    fromRoute: ReferenceTypeIdentifier,
    current: ReferenceTypeIdentifier
  ): boolean {
    return (
      fromRoute.materialNumber === current?.materialNumber &&
      fromRoute.plant === current.plant &&
      fromRoute.identificationHash === current.identificationHash
    );
  }
}
