/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
/* eslint-disable no-invalid-this */
import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';

import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { translate } from '@ngneat/transloco';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';

import { SnackBarService } from '@schaeffler/snackbar';

import {
  BomIdentifier,
  BomItem,
  Calculation,
  Drawing,
  ReferenceTypeIdentifier,
} from '@cdba/shared/models';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { DetailService } from '../../../../detail/service/detail.service';
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
      withLatestFrom(
        this.store.pipe(select(getSelectedReferenceTypeIdentifier))
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

  loadCalculations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCalculations),
      withLatestFrom(
        this.store.pipe(select(getSelectedReferenceTypeIdentifier))
      ),
      map(([_action, refTypeIdentifier]) => refTypeIdentifier),
      map(
        (refTypeIdentifier: ReferenceTypeIdentifier) =>
          refTypeIdentifier.materialNumber
      ),
      mergeMap((materialNumber: string) =>
        this.detailService.calculations(materialNumber).pipe(
          map((items: Calculation[]) => loadCalculationsSuccess({ items })),
          catchError((errorMessage) =>
            of(loadCalculationsFailure({ errorMessage }))
          )
        )
      )
    )
  );

  loadDrawings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDrawings),
      withLatestFrom(
        this.store.pipe(select(getSelectedReferenceTypeIdentifier))
      ),
      map(([_action, refTypeIdentifier]) => refTypeIdentifier),
      map(
        (refTypeIdentifier: ReferenceTypeIdentifier) =>
          refTypeIdentifier.materialNumber
      ),
      mergeMap((materialNumber: string) =>
        this.detailService.getDrawings(materialNumber).pipe(
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
      withLatestFrom(
        this.store.pipe(select(getBomIdentifierForSelectedCalculation))
      ),
      map(([_action, bomIdentifier]) => bomIdentifier),
      filter((bomIdentifier) => bomIdentifier !== undefined),
      map((bomIdentifier) => loadBom({ bomIdentifier }))
    )
  );

  loadBom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBom),
      map((action) => action.bomIdentifier),
      switchMap((bomIdentifier: BomIdentifier) =>
        this.detailService.getBom(bomIdentifier).pipe(
          map((items: BomItem[]) => loadBomSuccess({ items })),
          catchError((errorMessage) => of(loadBomFailure({ errorMessage })))
        )
      )
    )
  );

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
      withLatestFrom(
        this.store.pipe(select(getSelectedReferenceTypeIdentifier))
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
