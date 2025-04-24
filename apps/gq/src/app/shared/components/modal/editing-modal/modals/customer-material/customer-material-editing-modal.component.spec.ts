import { signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { BehaviorSubject, of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { AutoCompleteFacade } from '@gq/core/store/facades';
import { CaseFilterItem } from '@gq/core/store/reducers/models';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { AutocompleteRequestDialog } from '@gq/shared/components/autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '@gq/shared/components/autocomplete-input/filter-names.enum';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { EditingModal } from '@gq/shared/components/modal/editing-modal/models/editing-modal.model';
import { DragDialogDirective } from '@gq/shared/directives/drag-dialog/drag-dialog.directive';
import { IdValue } from '@gq/shared/models/search';
import { SelectableValue } from '@gq/shared/models/selectable-value.model';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockDirective, MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CUSTOMER_MOCK } from '../../../../../../../testing/mocks';
import { QUOTATION_DETAIL_MOCK } from '../../../../../../../testing/mocks/models/quotation-detail/quotation-details.mock';
import { CustomerMaterialEditingModalComponent } from './customer-material-editing-modal.component';

describe('CustomerMaterialEditingModalComponent', () => {
  let component: CustomerMaterialEditingModalComponent;
  let spectator: Spectator<CustomerMaterialEditingModalComponent>;
  const materialNumberForEditMaterial$$: BehaviorSubject<CaseFilterItem> =
    new BehaviorSubject<CaseFilterItem>({
      filter: FilterNames.MATERIAL_NUMBER,
      options: [],
    });

  const createComponent = createComponentFactory({
    component: CustomerMaterialEditingModalComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      DialogHeaderModule,
      ReactiveFormsModule,
      PushPipe,
      MockDirective(DragDialogDirective),
    ],
    providers: [
      {
        provide: MatDialogRef,
        useValue: {},
      },
      mockProvider(ActiveCaseFacade),
      MockProvider(AutoCompleteFacade, {
        materialNumberForEditMaterial$:
          materialNumberForEditMaterial$$.asObservable(),
        materialNumberAutocompleteLoading$: of(true),
      }),
    ],
  });

  beforeEach(() => {
    const modalData: EditingModal = {
      field: ColumnFields.CUSTOMER_MATERIAL,
      quotationDetail: QUOTATION_DETAIL_MOCK,
      customerId: CUSTOMER_MOCK.identifier,
    };
    spectator = createComponent({
      props: {
        modalData,
      },
    });

    spectator.setInput('modalData', signal(modalData));
    component = spectator.debugElement.componentInstance;
  });
  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('materialNumberForEditMaterial$', () => {
    test(
      'should return the materialNumberForEditMaterial$',
      marbles((m) => {
        const options: IdValue[] = [
          {
            id: 'testId',
            value: 'testValue',
            value2: null,
            selected: false,
          },
          {
            id: 'testId2',
            value: 'testValue2',
            value2: 'customerMaterial',
            selected: false,
          },
        ];
        spectator.setInput('modalData', {
          quotationDetail: { customerMaterial: 'customerMaterial' },
        } as EditingModal);
        materialNumberForEditMaterial$$.next({
          filter: FilterNames.MATERIAL_NUMBER,
          options,
        });

        m.expect(component.materialNumberForEditMaterial$).toBeObservable('a', {
          a: [
            {
              id: 'testId2',
              value: 'testValue2',
              value2: 'customerMaterial',
              defaultSelection: true,
            },
          ],
        });
      })
    );
  });
  describe('ngOnInit', () => {
    test('should create the form control', () => {
      component.requestCustomerMaterials = jest.fn();
      component.addButtonDisabledSubscription = jest.fn();
      component.ngOnInit();
      expect(component.customerMaterialForm).toBeDefined();
      expect(
        component.customerMaterialForm.get('customerMaterial')
      ).toBeDefined();
      expect(component.requestCustomerMaterials).toHaveBeenCalledTimes(1);
      expect(component.addButtonDisabledSubscription).toHaveBeenCalledTimes(1);
    });
  });

  describe('requestCustomerMaterials', () => {
    test('should call the autocompleteFacade', () => {
      component['autocompleteFacade'].setRequestDialog = jest.fn();
      component['autocompleteFacade'].autocomplete = jest.fn();
      const modalData: EditingModal = {
        field: ColumnFields.CUSTOMER_MATERIAL,
        quotationDetail: QUOTATION_DETAIL_MOCK,
        customerId: CUSTOMER_MOCK.identifier,
      };

      spectator.setInput('modalData', modalData);

      component.requestCustomerMaterials();

      expect(
        component['autocompleteFacade'].setRequestDialog
      ).toHaveBeenCalledWith(AutocompleteRequestDialog.EDIT_MATERIAL);
      expect(component['autocompleteFacade'].autocomplete).toHaveBeenCalledWith(
        {
          filter: FilterNames.MATERIAL_NUMBER,
          searchFor: modalData.quotationDetail.material.materialNumber15,
        },
        modalData.customerId
      );
    });
  });

  describe('addButtonDisabledSubscription', () => {
    test('should set button to disabled if form value is the same as current customer material', () => {
      const formControl = component['customerMaterialForm'].get(
        'customerMaterialNumber'
      );
      spectator.setInput('modalData', {
        quotationDetail: {
          customerMaterial: 'test',
        },
      } as EditingModal);
      component.addButtonDisabledSubscription();
      formControl.setValue('test');

      expect(component.confirmButtonDisabled).toBeTruthy();
    });

    test('should set button to enabled if form value is different then current customer material', () => {
      const formControl = component['customerMaterialForm'].get(
        'customerMaterialNumber'
      );
      spectator.setInput('modalData', {
        quotationDetail: {
          customerMaterial: 'any',
        },
      } as EditingModal);
      component.addButtonDisabledSubscription();
      formControl.setValue('different');

      expect(component.confirmButtonDisabled).toBeFalsy();
    });
  });

  describe('getFormControlValue', () => {
    test('should return the form control value for string', () => {
      const result = component.getFormControlValue('plainString');
      expect(result).toEqual('plainString');
    });
    test('should return the form control value for object', () => {
      const obj: SelectableValue = {
        value: 'test',
        id: 'testId',
        value2: 'testValue',
      };
      const result = component.getFormControlValue(obj);
      expect(result).toEqual(obj.value2);
    });
  });
  describe('closeDialog', () => {
    test('should close the dialog', () => {
      component['dialogRef'].close = jest.fn();
      component['autocompleteFacade'].resetAutocompleteMaterials = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(
        component['autocompleteFacade'].resetAutocompleteMaterials
      ).toHaveBeenCalledTimes(1);
    });
  });
});
