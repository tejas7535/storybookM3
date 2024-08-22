import { inject, Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { Customer } from '@gq/shared/models/customer';
import { MaterialTableItem } from '@gq/shared/models/table';
import { MaterialService } from '@gq/shared/services/rest/material/material.service';
import {
  MaterialValidationRequest,
  MaterialValidationResponse,
} from '@gq/shared/services/rest/material/models';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ProcessCaseActions } from './process-case.action';
import { getAddMaterialRowData } from './process-case.selectors';

@Injectable()
export class ProcessCaseEffects {
  private readonly actions$: Actions = inject(Actions);
  private readonly store: Store = inject(Store);
  private readonly materialService: MaterialService = inject(MaterialService);

  validateAfterItemAdded$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProcessCaseActions.addNewItemsToMaterialTable),
      map(() => ProcessCaseActions.validateMaterialTableItems())
    );
  });

  /**
   * Get Validation for materialNumbers in combination with Customer and SalesOrg
   */
  validateMaterialsOnCustomerAndSalesOrg$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProcessCaseActions.validateMaterialTableItems),
      concatLatestFrom(() => [
        this.store.select(getAddMaterialRowData),
        this.store.select(activeCaseFeature.selectCustomer),
      ]),
      mergeMap(
        ([_action, tableData, customer]: [
          ReturnType<typeof ProcessCaseActions.validateMaterialTableItems>,
          MaterialTableItem[],
          Customer,
        ]) => {
          const request: MaterialValidationRequest = {
            customerId: customer.identifier,
            materialNumbers: [
              ...new Set(tableData.map((el) => el.materialNumber)),
            ],
          };

          return this.materialService.validateMaterials(request).pipe(
            map((response: MaterialValidationResponse) =>
              ProcessCaseActions.validateMaterialTableItemsSuccess({
                materialValidations: response?.validatedMaterials,
              })
            ),
            catchError((errorMessage) =>
              of(
                ProcessCaseActions.validateMaterialTableItemsFailure({
                  errorMessage,
                })
              )
            )
          );
        }
      )
    );
  });
}
