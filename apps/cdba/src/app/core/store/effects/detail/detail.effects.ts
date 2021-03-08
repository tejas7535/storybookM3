import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { translate } from '@ngneat/transloco';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';

import { SnackBarService } from '@schaeffler/snackbar';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { DetailService } from '../../../../detail/service/detail.service';
import {
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculations,
  loadCalculationsFailure,
  loadCalculationsSuccess,
  loadReferenceType,
  loadReferenceTypeFailure,
  loadReferenceTypeSuccess,
  selectCalculation,
  selectReferenceType,
} from '../../actions';
import * as fromRouter from '../../reducers';
import {
  BomIdentifier,
  BomItem,
  ReferenceTypeIdentifier,
  ReferenceTypeResultModel,
} from '../../reducers/detail/models';
import { Calculation } from '../../reducers/shared/models/calculation.model';
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
          map((item: ReferenceTypeResultModel) =>
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

  triggerBomLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectCalculation, loadCalculationsSuccess),
      map(loadBom)
    )
  );

  loadBom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBom),
      withLatestFrom(
        this.store.pipe(select(getBomIdentifierForSelectedCalculation))
      ),
      map(([_action, bomIdentifier]) => bomIdentifier),
      mergeMap((bomIdentifier: BomIdentifier) =>
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
      mergeMap(() => {
        return [loadReferenceType(), loadCalculations()];
      })
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
    private readonly store: Store<fromRouter.AppState>,
    private readonly router: Router,
    private readonly snackbarService: SnackBarService
  ) {}

  private static mapQueryParamsToIdentifier(
    queryParams: any
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
