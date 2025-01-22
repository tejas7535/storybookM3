import { inject, Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';

import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { Customer } from '@gq/shared/models/customer';
import { MaterialTableItem } from '@gq/shared/models/table';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { MaterialService } from '@gq/shared/services/rest/material/material.service';
import {
  AddDetailsValidationRequest,
  AddDetailsValidationResponse,
  ValidatedDetail,
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
  private readonly featureToggleService: FeatureToggleConfigService = inject(
    FeatureToggleConfigService
  );

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
      filter(([_action, tableData]) => !!tableData && tableData.length > 0),
      mergeMap(
        ([_action, tableData, customer]: [
          ReturnType<typeof ProcessCaseActions.validateMaterialTableItems>,
          MaterialTableItem[],
          Customer,
        ]) => {
          const request: AddDetailsValidationRequest =
            this.materialService.mapToAddDetailsValidationRequest(
              customer.identifier,
              tableData
            );

          return this.materialService.validateDetailsToAdd(request).pipe(
            map((response: AddDetailsValidationResponse) => {
              // map the new Response to the MaterialValidation Model
              const materialValidations = response.validatedDetails.map(
                (detail: ValidatedDetail) => {
                  return this.materialService.mapValidatedDetailToMaterialValidation(
                    detail
                  );
                }
              );

              return ProcessCaseActions.validateMaterialTableItemsSuccess({
                materialValidations,
                // TODO: condition can be removed when old case creation is removed see https://jira.schaeffler.com/browse/GQUOTE-5048
                isNewCaseCreation: this.featureToggleService.isEnabled(
                  'createManualCaseAsView'
                ),
              });
            }),
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
