import { ChangeDetectorRef } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { AutoCompleteFacade } from '@gq/core/store/facades';
import { MaterialColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { FilterNames } from '@gq/shared/components/autocomplete-input/filter-names.enum';
import { IdValue } from '@gq/shared/models/search';
import { MaterialTableItem } from '@gq/shared/models/table';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { MATERIAL_TABLE_ITEM_MOCK } from '../../../../../../testing/mocks';
import {
  EditMaterialInputs,
  InitializeMaterialControlsServiceService,
} from './initialize-material-controls.service';

describe('InitializeMaterialControlsServiceTsService', () => {
  let service: InitializeMaterialControlsServiceService;
  let spectator: SpectatorService<InitializeMaterialControlsServiceService>;
  const getAutocompleteOptionsSuccessMock: BehaviorSubject<{
    options: IdValue[];
    filter: FilterNames;
  }> = new BehaviorSubject({} as any);

  const createService = createServiceFactory({
    service: InitializeMaterialControlsServiceService,
    providers: [
      MockProvider(AutoCompleteFacade, {
        getAutocompleteOptionsSuccess$:
          getAutocompleteOptionsSuccessMock.asObservable(),
        selectMaterialNumberDescriptionOrCustomerMaterial: jest.fn(),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });
  describe('initializeMaterialControls', () => {
    test('should call methods', () => {
      service['setMaterialFormControls'] = jest.fn();
      service['focusRequestedField'] = jest.fn();
      service['markFieldsAsTouched'] = jest.fn();

      const fieldsToFocus = MaterialColumnFields.MATERIAL;
      const materialToEdit = {} as MaterialTableItem;
      const inputs = {} as EditMaterialInputs;
      const cdref = {} as ChangeDetectorRef;

      service.initializeMaterialFormControls(
        fieldsToFocus,
        materialToEdit,
        inputs,
        cdref
      );

      expect(service['setMaterialFormControls']).toHaveBeenCalledWith(
        fieldsToFocus,
        materialToEdit,
        inputs,
        cdref
      );
      expect(service['focusRequestedField']).toHaveBeenCalledWith(
        fieldsToFocus,
        inputs
      );
      expect(service['markFieldsAsTouched']).toHaveBeenCalledWith(inputs);
    });
  });

  describe('mapping methods', () => {
    test('getOptionForCustomerMaterialNumber', () => {
      const result = service['getOptionForCustomerMaterial'](
        MATERIAL_TABLE_ITEM_MOCK
      );
      expect(result).toEqual({
        id: MATERIAL_TABLE_ITEM_MOCK.customerMaterialNumber,
        value: MATERIAL_TABLE_ITEM_MOCK.materialNumber,
        value2: MATERIAL_TABLE_ITEM_MOCK.materialDescription,
        deliveryUnit: MATERIAL_TABLE_ITEM_MOCK.deliveryUnit,
        uom: MATERIAL_TABLE_ITEM_MOCK.UoM,
        selected: false,
      });
    });

    test('getOptionForMaterialDescription', () => {
      const result = service['getOptionForMaterialDescription'](
        MATERIAL_TABLE_ITEM_MOCK
      );
      expect(result).toEqual({
        id: MATERIAL_TABLE_ITEM_MOCK.materialDescription,
        value: MATERIAL_TABLE_ITEM_MOCK.materialNumber,
        value2: MATERIAL_TABLE_ITEM_MOCK.customerMaterialNumber,
        deliveryUnit: MATERIAL_TABLE_ITEM_MOCK.deliveryUnit,
        uom: MATERIAL_TABLE_ITEM_MOCK.UoM,
        selected: false,
      });
    });

    test('getOptionForMaterialNumber', () => {
      const result = service['getOptionForMaterialNumber'](
        MATERIAL_TABLE_ITEM_MOCK
      );
      expect(result).toEqual({
        id: MATERIAL_TABLE_ITEM_MOCK.materialNumber,
        value: MATERIAL_TABLE_ITEM_MOCK.materialDescription,
        value2: MATERIAL_TABLE_ITEM_MOCK.customerMaterialNumber,
        deliveryUnit: MATERIAL_TABLE_ITEM_MOCK.deliveryUnit,
        uom: MATERIAL_TABLE_ITEM_MOCK.UoM,
        selected: false,
      });
    });
  });

  describe('getOptionByFilterName', () => {
    beforeEach(() => {
      service['getOptionForMaterialNumber'] = jest.fn();
      service['getOptionForMaterialDescription'] = jest.fn();
      service['getOptionForCustomerMaterial'] = jest.fn();
    });
    test('should return option for MaterialNumber', () => {
      service['getOptionByFilterName'](
        FilterNames.MATERIAL_NUMBER,
        MATERIAL_TABLE_ITEM_MOCK
      );
      expect(service['getOptionForMaterialNumber']).toHaveBeenCalled();
    });
    test('should return option for MaterialDescription', () => {
      service['getOptionByFilterName'](
        FilterNames.MATERIAL_DESCRIPTION,
        MATERIAL_TABLE_ITEM_MOCK
      );
      expect(service['getOptionForMaterialDescription']).toHaveBeenCalled();
    });
    test('should return option for CustomerMaterial', () => {
      service['getOptionByFilterName'](
        FilterNames.CUSTOMER_MATERIAL,
        MATERIAL_TABLE_ITEM_MOCK
      );
      expect(service['getOptionForCustomerMaterial']).toHaveBeenCalled();
    });
    test('should return option for materialNumber when filter is not an autocomplete field', () => {
      service['getOptionByFilterName'](
        FilterNames.MATERIAL_NUMBER_OR_DESCRIPTION,
        MATERIAL_TABLE_ITEM_MOCK
      );
      expect(service['getOptionForMaterialNumber']).toHaveBeenCalled();
    });
  });

  describe('validateAutocompleteResult', () => {
    describe('directMatch', () => {
      const inputs = {} as EditMaterialInputs;
      const materialToEdit = {} as MaterialTableItem;
      const cdref = {} as ChangeDetectorRef;

      test('directMatch has been found, shall select the option', () => {
        const foundOption = {
          id: 'matNumber',
          value: 'matDesc',
          value2: 'custMat',
          selected: false,
        };
        service['getOptionByFilterName'] = jest
          .fn()
          .mockReturnValue(foundOption);
        getAutocompleteOptionsSuccessMock.next({
          filter: FilterNames.MATERIAL_NUMBER,
          options: [foundOption],
        });
        service['validateAutocompleteResult'](
          FilterNames.MATERIAL_NUMBER,
          inputs,
          materialToEdit,
          cdref
        );
        expect(
          service['autoCompleteFacade']
            .selectMaterialNumberDescriptionOrCustomerMaterial
        ).toHaveBeenCalledWith(foundOption, FilterNames.MATERIAL_NUMBER);
      });
    });

    describe('no direct match found for initialAutocomplete', () => {
      const inputs: EditMaterialInputs = {} as any;
      let materialNumberAutocomplete: any;
      let materialDescriptionAutocomplete: any;
      let customerMaterialNumberAutocomplete: any;
      const cdref = {} as ChangeDetectorRef;

      beforeEach(() => {
        materialNumberAutocomplete = {
          searchFormControl: {
            setValue: jest.fn(),
            markAllAsTouched: jest.fn(),
          },
          focus: jest.fn(),
        } as any;
        materialDescriptionAutocomplete = {
          searchFormControl: {
            setValue: jest.fn(),
          },
          focus: jest.fn(),
        } as any;
        customerMaterialNumberAutocomplete = {
          searchFormControl: {
            setValue: jest.fn(),
          },
          focus: jest.fn(),
        } as any;
        inputs.matDescInput = materialDescriptionAutocomplete;
        inputs.matNumberInput = materialNumberAutocomplete;
        inputs.customerMaterialInput = customerMaterialNumberAutocomplete;
      });

      describe('matNumber and matDesc are set', () => {
        const materialToEdit: MaterialTableItem = {} as any;
        test('matNumber and matDesc are set, select given option, incoming filter is MATERIAL_NUMBER', () => {
          const autocompleteOption = {
            id: 'matNumber',
            value: 'matDesc',
            value2: 'custMat',
            selected: false,
          };
          const optionToCheck = {
            ...autocompleteOption,
            value2: 'anyFancyCustomerMat',
          };
          service['getOptionByFilterName'] = jest
            .fn()
            .mockReturnValue(optionToCheck);
          getAutocompleteOptionsSuccessMock.next({
            filter: FilterNames.MATERIAL_NUMBER,
            options: [
              autocompleteOption,
              { ...autocompleteOption, id: 'matNumber2' },
            ],
          });
          service['validateAutocompleteResult'](
            FilterNames.MATERIAL_NUMBER,
            inputs,
            materialToEdit,
            cdref
          );
          expect(
            service['autoCompleteFacade']
              .selectMaterialNumberDescriptionOrCustomerMaterial
          ).toHaveBeenCalledWith(
            optionToCheck,
            FilterNames.MATERIAL_NUMBER,
            false
          );
        });
        test('matNumber and matDesc are set, select given option, incoming filter is CUSTOMER_MATERIAL', () => {
          const autocompleteOption = {
            id: 'custMat',
            value: 'matNumber',
            value2: 'matDESC',
            selected: false,
          };
          const optionToCheck = {
            ...autocompleteOption,
            id: 'anyFancyCustomerMat',
          };
          service['getOptionByFilterName'] = jest
            .fn()
            .mockReturnValue(optionToCheck);
          getAutocompleteOptionsSuccessMock.next({
            filter: FilterNames.CUSTOMER_MATERIAL,
            options: [autocompleteOption],
          });
          service['validateAutocompleteResult'](
            FilterNames.CUSTOMER_MATERIAL,
            inputs,
            materialToEdit,
            cdref
          );
          expect(
            service['autoCompleteFacade']
              .selectMaterialNumberDescriptionOrCustomerMaterial
          ).toHaveBeenCalledWith(
            optionToCheck,
            FilterNames.CUSTOMER_MATERIAL,
            true
          );
        });
      });

      describe('materialNumber is not set, incoming filter is MATERIAL_NUMBER', () => {
        const autocompleteOption = {
          id: 'matNumber',
          value: 'matDesc',
          value2: 'custMat',
          selected: false,
        };

        beforeEach(() => {
          getAutocompleteOptionsSuccessMock.next({
            filter: FilterNames.MATERIAL_NUMBER,
            options: [autocompleteOption],
          });
        });
        test('matNumber is not set, set value for matNumber+matDesc, setValue for customerMaterial', () => {
          const optionToCheck = {
            ...autocompleteOption,
            id: null as string,
            value2: 'anyFancyCustomerMat',
          };
          const materialToEdit = {
            materialNumber: optionToCheck.id,
            materialDescription: optionToCheck.value,
            customerMaterialNumber: optionToCheck.value2,
          };

          service['getOptionByFilterName'] = jest
            .fn()
            .mockReturnValue(optionToCheck);
          service['validateAutocompleteResult'](
            FilterNames.MATERIAL_NUMBER,
            inputs,
            materialToEdit,
            cdref
          );
          expect(
            materialNumberAutocomplete.searchFormControl.setValue
          ).toHaveBeenCalledWith(optionToCheck.id, {
            emitEvent: false,
          });
          expect(
            materialDescriptionAutocomplete.searchFormControl.setValue
          ).toHaveBeenCalledWith(optionToCheck.value, { emitEvent: false });
          expect(
            customerMaterialNumberAutocomplete.searchFormControl.setValue
          ).toHaveBeenCalledWith(optionToCheck.value2);
        });
        test('matNumber is not set, set value for matNumber+matDesc', () => {
          const optionToCheck = {
            ...autocompleteOption,
            id: null as string,
            value2: null as string,
          };
          const materialToEdit = {
            materialNumber: optionToCheck.id,
            materialDescription: optionToCheck.value,
            customerMaterialNumber: optionToCheck.value2,
          };

          service['getOptionByFilterName'] = jest
            .fn()
            .mockReturnValue(optionToCheck);
          service['validateAutocompleteResult'](
            FilterNames.MATERIAL_NUMBER,
            inputs,
            materialToEdit,
            cdref
          );
          expect(
            materialNumberAutocomplete.searchFormControl.setValue
          ).toHaveBeenCalledWith(optionToCheck.id, {
            emitEvent: false,
          });
          expect(
            materialDescriptionAutocomplete.searchFormControl.setValue
          ).toHaveBeenCalledWith(optionToCheck.value, { emitEvent: false });
          expect(
            customerMaterialNumberAutocomplete.searchFormControl.setValue
          ).not.toHaveBeenCalledWith(optionToCheck.value2);
        });
      });
      describe('materialDesc is not set, incoming filter is CUSTOMER_MATERIAL', () => {
        const autocompleteOption = {
          id: 'custMat',
          value: 'matNumber',
          value2: 'matDesc',
          selected: false,
        };

        beforeEach(() => {
          getAutocompleteOptionsSuccessMock.next({
            filter: FilterNames.CUSTOMER_MATERIAL,
            options: [autocompleteOption],
          });
        });

        test('materialDesc is not set, set value for matNumber', () => {
          const optionToCheck = {
            ...autocompleteOption,
            value2: null as string,
          };
          const materialToEdit = {
            materialNumber: optionToCheck.id,
            materialDescription: optionToCheck.value,
            customerMaterialNumber: optionToCheck.value2,
          };

          service['getOptionByFilterName'] = jest
            .fn()
            .mockReturnValue(optionToCheck);
          service['validateAutocompleteResult'](
            FilterNames.CUSTOMER_MATERIAL,
            inputs,
            materialToEdit,
            cdref
          );
          expect(
            materialNumberAutocomplete.searchFormControl.setValue
          ).toHaveBeenCalledWith(optionToCheck.id);
          expect(
            materialNumberAutocomplete.searchFormControl.markAllAsTouched
          ).toHaveBeenCalled();
        });
      });
    });
  });

  describe('focusRequestedField', () => {
    test('should focus on materialDescription', () => {
      const inputs = {
        matDescInput: {
          focus: jest.fn(),
        },
      } as any;
      service['focusRequestedField'](
        MaterialColumnFields.MATERIAL_DESCRIPTION,
        inputs
      );
      expect(inputs.matDescInput.focus).toHaveBeenCalled();
    });
    test('should focus on materialNumber', () => {
      const inputs = {
        matNumberInput: {
          focus: jest.fn(),
        },
      } as any;
      service['focusRequestedField'](MaterialColumnFields.MATERIAL, inputs);
      expect(inputs.matNumberInput.focus).toHaveBeenCalled();
    });

    test('should focus on customerMaterial', () => {
      const inputs = {
        customerMaterialInput: {
          focus: jest.fn(),
        },
      } as any;
      service['focusRequestedField'](
        MaterialColumnFields.CUSTOMER_MATERIAL_NUMBER,
        inputs
      );
      expect(inputs.customerMaterialInput.focus).toHaveBeenCalled();
    });

    test('should focus on quantity', () => {
      const inputs = {
        quantityInput: {
          nativeElement: {
            focus: jest.fn(),
          },
        },
      } as any;
      service['focusRequestedField'](MaterialColumnFields.QUANTITY, inputs);
      expect(inputs.quantityInput.nativeElement.focus).toHaveBeenCalled();
    });

    test('should focus on targetPrice', () => {
      const inputs = {
        targetPriceInput: {
          nativeElement: {
            focus: jest.fn(),
          },
        },
      } as any;
      service['focusRequestedField'](MaterialColumnFields.TARGET_PRICE, inputs);
      expect(inputs.targetPriceInput.nativeElement.focus).toHaveBeenCalled();
    });

    test('should focus on targetPriceSource', () => {
      const inputs = {
        targetPriceSourceInput: {
          focus: jest.fn(),
        },
      } as any;
      service['focusRequestedField'](
        MaterialColumnFields.TARGET_PRICE_SOURCE,
        inputs
      );
      expect(inputs.targetPriceSourceInput.focus).toHaveBeenCalled();
    });
  });

  describe('markFieldsAsTouched', () => {
    test('should mark all fields as touched', () => {
      const inputs = {
        matDescInput: {
          searchFormControl: {
            markAllAsTouched: jest.fn(),
            invalid: true,
          },
        },
        matNumberInput: {
          searchFormControl: {
            markAllAsTouched: jest.fn(),
            invalid: true,
          },
        },
      } as any as EditMaterialInputs;

      service['markFieldsAsTouched'](inputs);
      expect(
        inputs.matDescInput.searchFormControl.markAllAsTouched
      ).toHaveBeenCalled();
      expect(
        inputs.matNumberInput.searchFormControl.markAllAsTouched
      ).toHaveBeenCalled();
    });
  });

  describe('setMaterialFormControls', () => {
    const cdref = {} as ChangeDetectorRef;
    beforeEach(() => {
      service['validateAutocompleteResult'] = jest.fn();
    });

    describe('MaterialColumnFields.MATERIAL', () => {
      test('should set for materialNumber with materialNumber present', () => {
        const inputs: EditMaterialInputs = {
          matNumberInput: {
            searchFormControl: {
              setValue: jest.fn(),
            },
          },
        } as any;
        const materialToEdit = {
          materialNumber: 'matNumber',
        } as MaterialTableItem;
        service['setMaterialFormControls'](
          MaterialColumnFields.MATERIAL,
          materialToEdit,
          inputs,
          cdref
        );
        expect(
          inputs.matNumberInput.searchFormControl.setValue
        ).toHaveBeenCalledWith(materialToEdit.materialNumber);
        expect(service['validateAutocompleteResult']).toHaveBeenCalledWith(
          FilterNames.MATERIAL_NUMBER,
          inputs,
          materialToEdit,
          cdref
        );
      });
      test('should set for materialNumber with materialNumber not present', () => {
        const inputs: EditMaterialInputs = {
          customerMaterialInput: {
            searchFormControl: {
              setValue: jest.fn(),
            },
          },
        } as any;
        const materialToEdit = {
          customerMaterialNumber: 'custMat',
        } as MaterialTableItem;
        service['setMaterialFormControls'](
          MaterialColumnFields.MATERIAL,
          materialToEdit,
          inputs,
          cdref
        );
        expect(
          inputs.customerMaterialInput.searchFormControl.setValue
        ).toHaveBeenCalledWith(materialToEdit.customerMaterialNumber);
      });
    });

    describe('MaterialColumnFields.MATERIAL_DESCRIPTION', () => {
      test('should set for materialDescription with materialDescription present', () => {
        const inputs: EditMaterialInputs = {
          matDescInput: {
            searchFormControl: {
              setValue: jest.fn(),
            },
          },
        } as any;
        const materialToEdit = {
          materialDescription: 'matDesc',
        } as MaterialTableItem;

        service['setMaterialFormControls'](
          MaterialColumnFields.MATERIAL_DESCRIPTION,
          materialToEdit,
          inputs,
          cdref
        );

        expect(
          inputs.matDescInput.searchFormControl.setValue
        ).toHaveBeenCalledWith(materialToEdit.materialDescription);
        expect(service['validateAutocompleteResult']).toHaveBeenCalledWith(
          FilterNames.MATERIAL_DESCRIPTION,
          inputs,
          materialToEdit,
          cdref
        );
      });
      test('should set for materialDescription with materialDescription not present and materialNumber present', () => {
        const inputs: EditMaterialInputs = {
          matNumberInput: {
            searchFormControl: {
              setValue: jest.fn(),
            },
          },
        } as any;
        const materialToEdit = {
          materialNumber: 'materialNumber',
        } as MaterialTableItem;

        service['setMaterialFormControls'](
          MaterialColumnFields.MATERIAL_DESCRIPTION,
          materialToEdit,
          inputs,
          cdref
        );

        expect(
          inputs.matNumberInput.searchFormControl.setValue
        ).toHaveBeenCalledWith(materialToEdit.materialNumber);
        expect(service['validateAutocompleteResult']).toHaveBeenCalledWith(
          FilterNames.MATERIAL_NUMBER,
          inputs,
          materialToEdit,
          cdref
        );
      });
      test('should set for materialDescription with materialDescription and materialNumber not present and customerMaterialNumber present', () => {
        const inputs: EditMaterialInputs = {
          customerMaterialInput: {
            searchFormControl: {
              setValue: jest.fn(),
            },
          },
        } as any;
        const materialToEdit = {
          customerMaterialNumber: 'customerMaterialNumber',
        } as MaterialTableItem;

        service['setMaterialFormControls'](
          MaterialColumnFields.MATERIAL_DESCRIPTION,
          materialToEdit,
          inputs,
          cdref
        );

        expect(
          inputs.customerMaterialInput.searchFormControl.setValue
        ).toHaveBeenCalledWith(materialToEdit.customerMaterialNumber);
        expect(service['validateAutocompleteResult']).toHaveBeenCalledWith(
          FilterNames.CUSTOMER_MATERIAL,
          inputs,
          materialToEdit,
          cdref
        );
      });
    });

    describe('MaterialColumnFields.CUSTOMER_MATERIAL_NUMBER', () => {
      test('should set for customerMaterialNumber with customerMaterialNumber present', () => {
        const inputs: EditMaterialInputs = {
          customerMaterialInput: {
            searchFormControl: {
              setValue: jest.fn(),
            },
          },
        } as any;
        const materialToEdit = {
          customerMaterialNumber: 'customerMaterialNumber',
        } as MaterialTableItem;

        service['setMaterialFormControls'](
          MaterialColumnFields.CUSTOMER_MATERIAL_NUMBER,
          materialToEdit,
          inputs,
          cdref
        );

        expect(
          inputs.customerMaterialInput.searchFormControl.setValue
        ).toHaveBeenCalledWith(materialToEdit.customerMaterialNumber);
        expect(service['validateAutocompleteResult']).toHaveBeenCalledWith(
          FilterNames.CUSTOMER_MATERIAL,
          inputs,
          materialToEdit,
          cdref
        );
      });
      test('should set for customerMaterialNumber with customerMaterialNumber not present and materialNumber present', () => {
        const inputs: EditMaterialInputs = {
          matNumberInput: {
            searchFormControl: {
              setValue: jest.fn(),
            },
          },
        } as any;
        const materialToEdit = {
          materialNumber: 'materialNumber',
        } as MaterialTableItem;

        service['setMaterialFormControls'](
          MaterialColumnFields.CUSTOMER_MATERIAL_NUMBER,
          materialToEdit,
          inputs,
          cdref
        );

        expect(
          inputs.matNumberInput.searchFormControl.setValue
        ).toHaveBeenCalledWith(materialToEdit.materialNumber);
      });
    });

    describe('default case MaterialColumnFields.QUANTITY', () => {
      test('should set MaterialNumber if present', () => {
        const inputs: EditMaterialInputs = {
          matNumberInput: {
            searchFormControl: {
              setValue: jest.fn(),
            },
          },
        } as any;
        const materialToEdit = {
          materialNumber: 'materialNumber',
        } as MaterialTableItem;

        service['setMaterialFormControls'](
          MaterialColumnFields.QUANTITY,
          materialToEdit,
          inputs,
          cdref
        );

        expect(
          inputs.matNumberInput.searchFormControl.setValue
        ).toHaveBeenCalledWith(materialToEdit.materialNumber);
        expect(service['validateAutocompleteResult']).toHaveBeenCalledWith(
          FilterNames.MATERIAL_NUMBER,
          inputs,
          materialToEdit,
          cdref
        );
      });
      test('should set customerMaterial when materialNumer is not present', () => {
        const inputs: EditMaterialInputs = {
          customerMaterialInput: {
            searchFormControl: {
              setValue: jest.fn(),
            },
          },
        } as any;
        const materialToEdit = {
          customerMaterialNumber: 'customerMaterialNumber',
        } as MaterialTableItem;

        service['setMaterialFormControls'](
          MaterialColumnFields.QUANTITY,
          materialToEdit,
          inputs,
          cdref
        );

        expect(
          inputs.customerMaterialInput.searchFormControl.setValue
        ).toHaveBeenCalledWith(materialToEdit.customerMaterialNumber);
        expect(service['validateAutocompleteResult']).toHaveBeenCalledWith(
          FilterNames.CUSTOMER_MATERIAL,
          inputs,
          materialToEdit,
          cdref
        );
      });
    });
  });
});
