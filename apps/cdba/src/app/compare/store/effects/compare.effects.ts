import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import { RouterStateUrl } from '@cdba/core/store';

import {
  BomItem,
  ReferenceTypeIdentifier,
} from '../../../core/store/reducers/detail/models';
import { Calculation } from '../../../core/store/reducers/shared/models';
import { DetailService } from '../../../detail/service/detail.service';
import {
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculationHistory,
  loadCalculationHistoryFailure,
  loadCalculationHistorySuccess,
  loadCalculations,
  selectCalculation,
  selectReferenceTypes,
} from '../actions/compare.actions';
import {
  getBomIdentifierForSelectedCalculation,
  getSelectedReferenceTypeIdentifiers,
} from '../selectors/compare.selectors';

@Injectable()
export class CompareEffects {
  selectReferenceTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      filter(
        (routerState: RouterStateUrl) =>
          routerState.url.indexOf(AppRoutePath.ComparePath) === 1
      ),
      map((routerState) =>
        CompareEffects.mapQueryParamsToIdentifier(routerState.queryParams)
      ),
      map((referenceTypeIdentifiers: ReferenceTypeIdentifier[]) =>
        selectReferenceTypes({ referenceTypeIdentifiers })
      )
    )
  );

  loadCalculations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCalculations),
      concatLatestFrom((_action) =>
        this.store.pipe(select(getSelectedReferenceTypeIdentifiers))
      ),
      map(([_action, identifiers]) => identifiers),
      mergeMap((identifiers) =>
        identifiers.map((identifier, index) =>
          loadCalculationHistory({
            index,
            materialNumber: identifier.materialNumber,
          })
        )
      )
    )
  );

  loadCalculationHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCalculationHistory),
      mergeMap((action: any) =>
        this.detailService.calculations(action.materialNumber).pipe(
          map((items: Calculation[]) =>
            loadCalculationHistorySuccess({ items, index: action.index })
          ),
          catchError((error) =>
            of(loadCalculationHistoryFailure({ error, index: action.index }))
          )
        )
      )
    )
  );

  loadBillOfMaterial$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBom.type),
      map((action: any) => action.index),
      concatLatestFrom((index) =>
        this.store.pipe(
          select(getBomIdentifierForSelectedCalculation, { index })
        )
      ),
      mergeMap(([index, identifier]) =>
        this.detailService.getBom(identifier).pipe(
          map((items: BomItem[]) => loadBomSuccess({ items, index })),
          catchError((error) => of(loadBomFailure({ error, index })))
        )
      )
    )
  );

  triggerBomLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectCalculation.type, loadCalculationHistorySuccess.type),
      map((action: any) => action.index),
      map((index: number) => loadBom({ index }))
    )
  );

  triggerDataLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectReferenceTypes),
      mergeMap(() => [loadCalculations()])
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly detailService: DetailService,
    private readonly store: Store<{}>
  ) {}

  private static mapQueryParamsToIdentifier(
    queryParams: Params
  ): ReferenceTypeIdentifier[] {
    const mappingTable: { [key: string]: string } = {
      material_number: 'materialNumber',
      plant: 'plant',
      identification_hash: 'identificationHash',
    };

    let refTypesIdentifiers: {
      [index: string]: ReferenceTypeIdentifier;
    } = {};

    for (const [key, value] of Object.entries(queryParams)) {
      const { index, queryKey } = CompareEffects.splitQueryKey(key);

      refTypesIdentifiers = {
        ...refTypesIdentifiers,
        [index]: {
          ...refTypesIdentifiers[index],
          [`${mappingTable[queryKey]}`]: value,
        },
      };
    }

    return Object.values(refTypesIdentifiers);
  }

  private static splitQueryKey(
    queryKey: string
  ): {
    index: string;
    queryKey: string;
  } {
    const splitted = queryKey.split('_item_');

    return { index: splitted[1], queryKey: splitted[0] };
  }
}
