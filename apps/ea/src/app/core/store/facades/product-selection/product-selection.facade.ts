import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { filter, firstValueFrom, Observable } from 'rxjs';

import { Action, Store } from '@ngrx/store';

import { ProductSelectionTemplate } from '../../models/product-selection-state.model';
import {
  getAvailableLoads,
  getAvailableLubricationMethods,
  getBearingDesignation,
  getBearingId,
  getBearingSelectionLoading,
  getBearingSelectionResultList,
  getCalculationModuleInfo,
  getTemplateItem,
  isBearingSupported,
} from '../../selectors/product-selection/product-selection.selector';

@Injectable({
  providedIn: 'root',
})
export class ProductSelectionFacade {
  public readonly bearingDesignation$ = this.store.select(
    getBearingDesignation
  );
  public readonly bearingDesignationResultList$ = this.store.select(
    getBearingSelectionResultList
  );

  public readonly isBearingSelectionLoading$ = this.store.select(
    getBearingSelectionLoading
  );

  public bearingId$ = this.store.select(getBearingId);
  public calcualtionModuleInfo$ = this.store.select(getCalculationModuleInfo);
  public availableLoads$ = this.store.select(getAvailableLoads);
  public availableLubricationMethods$ = this.store.select(
    getAvailableLubricationMethods
  );
  public isBearingSupported$ = this.store.select(isBearingSupported);

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }

  getTemplateItem(
    itemId: string
  ): Observable<ProductSelectionTemplate | undefined> {
    return this.store
      .select(getTemplateItem({ itemId }))
      .pipe(filter((res) => res !== null));
  }

  templateValidator(
    templateId: string,
    defaultValues?: Partial<ProductSelectionTemplate>
  ): AsyncValidatorFn {
    const templateItem$ = this.getTemplateItem(templateId);

    return async (
      control: AbstractControl
    ): Promise<ValidationErrors | null> => {
      const templateItem = await firstValueFrom(templateItem$);

      if (!templateItem) {
        // eslint-disable-next-line unicorn/no-null
        return null;
      }

      // add validators
      if (templateItem.maximum !== null || defaultValues?.maximum !== null) {
        const error = Validators.max(
          templateItem.maximum ?? defaultValues.maximum
        )(control);
        if (error) {
          return error;
        }
      }

      if (templateItem.minimum !== null || defaultValues?.minimum !== null) {
        const error = Validators.min(
          templateItem.minimum ?? defaultValues.minimum
        )(control);
        if (error) {
          return error;
        }
      }

      // eslint-disable-next-line unicorn/no-null
      return null;
    };
  }
}
