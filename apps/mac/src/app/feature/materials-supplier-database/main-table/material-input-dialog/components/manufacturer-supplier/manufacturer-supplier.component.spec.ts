import { CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule, MockPipe, MockProvider } from 'ng-mocks';

import { StringOption } from '@schaeffler/inputs';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ManufacturerSupplier } from '@mac/feature/materials-supplier-database/models';
import { DialogFacade } from '@mac/feature/materials-supplier-database/store/facades/dialog';
import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';
import { initialState as initialDialogState } from '@mac/msd/store/reducers/dialog/dialog.reducer';

import * as en from '../../../../../../../assets/i18n/en.json';
import { ManufacturerSupplierComponent } from './manufacturer-supplier.component';

const initialState = {
  msd: {
    data: {
      ...initialDataState,
    },
    dialog: {
      ...initialDialogState,
      dialogOptions: {
        ...initialDialogState.dialogOptions,
        ratingsLoading: false,
        manufacturerSuppliers: [] as ManufacturerSupplier[],
      },
    },
  },
};

@Injectable()
class MockDialogFacade extends DialogFacade {
  addCustomSupplierName = jest.fn();
  addCustomSupplierPlant = jest.fn();
}

describe('ManufacturerSupplierComponent', () => {
  let component: ManufacturerSupplierComponent;
  let spectator: Spectator<ManufacturerSupplierComponent>;
  let manufacturerSupplierIdControl: FormControl<number>;
  let supplierControl: FormControl<StringOption>;
  let supplierPlantControl: FormControl<StringOption>;
  let supplierCountryControl: FormControl<StringOption>;
  let readonly = false;
  let editable = false;
  let dialogFacade: DialogFacade;

  const createComponent = createComponentFactory({
    component: ManufacturerSupplierComponent,
    // required so we can set the inputs
    detectChanges: false,
    imports: [
      MockPipe(PushPipe),
      MockModule(ReactiveFormsModule),
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      provideMockStore({ initialState }),
      provideMockActions(() => of()),
      MockProvider(DialogFacade, MockDialogFacade, 'useClass'),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    manufacturerSupplierIdControl = new FormControl<number>(undefined);
    supplierControl = new FormControl<StringOption>(undefined);
    supplierPlantControl = new FormControl<StringOption>(undefined);
    supplierCountryControl = new FormControl<StringOption>(undefined);

    spectator = createComponent();
    spectator.setInput({
      manufacturerSupplierIdControl,
      supplierControl,
      supplierPlantControl,
      supplierCountryControl,
      readonly,
      editable,
    });
    // run ngOnInit
    spectator.detectChanges();
    component = spectator.debugElement.componentInstance;

    dialogFacade = spectator.inject(DialogFacade);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('formControls', () => {
    describe('ADD - supplierPlantControl valueChanges', () => {
      const mockSupplierPlantBase: StringOption = {
        id: 1,
        title: 'plant',
      };
      it('should set and enable the country control if the data is undefined', () => {
        const mockSupplierPlant = {
          ...mockSupplierPlantBase,
        };
        supplierCountryControl.enable = jest.fn();
        supplierCountryControl.setValue = jest.fn();

        supplierPlantControl.setValue(mockSupplierPlant);

        expect(supplierCountryControl.setValue).toHaveBeenCalledWith(
          mockSupplierPlant?.data?.supplierCountry
        );
        expect(supplierCountryControl.enable).toHaveBeenCalled();
      });
      it('should set and disable country control if plant data is available', () => {
        const mockSupplierPlant = {
          ...mockSupplierPlantBase,
          data: {
            supplierCountry: 'country',
          },
        };
        supplierCountryControl.setValue = jest.fn();
        supplierCountryControl.disable = jest.fn();

        supplierPlantControl.setValue(mockSupplierPlant);

        expect(supplierCountryControl.setValue).toHaveBeenCalledWith(
          mockSupplierPlant?.data?.supplierCountry
        );
        expect(supplierCountryControl.disable).toHaveBeenCalled();
      });
    });

    it('should set and disable country control if plant undefined', () => {
      supplierCountryControl.setValue = jest.fn();
      supplierCountryControl.disable = jest.fn();

      // eslint-disable-next-line unicorn/no-useless-undefined
      supplierPlantControl.setValue(undefined);

      expect(supplierCountryControl.setValue).toHaveBeenCalledWith(undefined);
      expect(supplierCountryControl.disable).toHaveBeenCalled();
    });

    describe('ADD - supplierDependencies valueChanges', () => {
      const mockSupplierOptionBase: StringOption = {
        id: 1,
        title: 'supplier',
      };
      const mockSupplierPlantOptionBase: StringOption = {
        id: 1,
        title: 'plant',
      };
      it('should reset the controls if supplier name is undefined', () => {
        manufacturerSupplierIdControl.reset = jest.fn();
        supplierPlantControl.reset = jest.fn();
        supplierCountryControl.reset = jest.fn();
        supplierPlantControl.disable = jest.fn();
        supplierCountryControl.disable = jest.fn();

        // eslint-disable-next-line unicorn/no-useless-undefined
        supplierControl.setValue(undefined);

        expect(manufacturerSupplierIdControl.reset).toHaveBeenCalled();
        expect(supplierPlantControl.reset).toHaveBeenCalledWith(undefined, {
          emitEvent: false,
        });
        expect(supplierCountryControl.reset).toHaveBeenCalledWith(undefined, {
          emitEvent: false,
        });
        expect(supplierPlantControl.disable).toHaveBeenCalledWith({
          emitEvent: false,
        });
        expect(supplierCountryControl.disable).toHaveBeenCalledWith({
          emitEvent: false,
        });
      });

      it('should enable plant and reset id if supplier name is defined', () => {
        manufacturerSupplierIdControl.reset = jest.fn();
        supplierPlantControl.enable = jest.fn();

        const mockSupplier = { ...mockSupplierOptionBase };

        supplierControl.setValue(mockSupplier);

        expect(manufacturerSupplierIdControl.reset).toHaveBeenCalled();
        expect(supplierPlantControl.enable).toHaveBeenCalledWith({
          emitEvent: false,
        });
      });

      it('should set id for existing supplier after plant is selected', () => {
        manufacturerSupplierIdControl.patchValue = jest.fn();
        supplierPlantControl.enable = jest.fn();

        const mockSupplier = { ...mockSupplierOptionBase };
        const mockPlant = {
          ...mockSupplierPlantOptionBase,
          data: { supplierId: 1, supplierName: 'supplier' },
        };

        supplierControl.setValue(mockSupplier, { emitEvent: false });
        supplierPlantControl.setValue(mockPlant);

        expect(manufacturerSupplierIdControl.patchValue).toHaveBeenCalledWith(
          1
        );
        expect(supplierPlantControl.enable).toHaveBeenCalledWith({
          emitEvent: false,
        });
      });

      it('should reset plant and country for custom entries', () => {
        supplierPlantControl.enable = jest.fn();
        supplierPlantControl.reset = jest.fn();
        supplierCountryControl.reset = jest.fn();

        const mockSupplier = { ...mockSupplierOptionBase };
        const mockPlant = {
          ...mockSupplierPlantOptionBase,
          data: { supplierId: 1 },
        };

        supplierControl.setValue(mockSupplier, { emitEvent: false });
        supplierPlantControl.setValue(mockPlant);

        expect(supplierPlantControl.enable).toHaveBeenCalledWith({
          emitEvent: false,
        });
        expect(supplierPlantControl.reset).toHaveBeenCalled();
        expect(supplierCountryControl.reset).toHaveBeenCalled();
      });
    });

    describe('EDIT', () => {
      const val = 'sth';
      const so = { title: val, id: val } as StringOption;
      beforeAll(() => {
        editable = true;
        readonly = false;
      });
      it('should update supplier name', () => {
        component.supplierEditControl.setValue(val);
        expect(component.supplierControl.value).toEqual(so);
      });
      it('should update supplier Plant', () => {
        component.supplierPlantEditControl.setValue(val);
        expect(component.supplierPlantControl.value).toEqual(so);
      });
      it('should update supplier country', () => {
        component.supplierCountryEditControl.setValue(val);
        expect(component.supplierCountryControl.value).toEqual(so);
      });
      it('should prefill edit fields', () => {
        // set
        component.supplierControl.setValue({ title: 'name' } as StringOption);
        component.supplierPlantControl.setValue({
          title: 'plant',
        } as StringOption);
        component.supplierCountryControl.setValue({
          title: 'country',
        } as StringOption);
        component.ngOnInit();

        expect(component.supplierEditControl.value).toBe('name');
        expect(component.supplierPlantEditControl.value).toBe('plant');
        expect(component.supplierCountryEditControl.value).toBe('country');
      });
    });

    describe('readonly', () => {
      beforeEach(() => {
        readonly = true;
        editable = false;
        component.supplierControl.setValue({
          title: 'some value',
        } as StringOption);
      });
      // cleanup
      afterAll(() => {
        readonly = false;
        editable = false;
      });
      it('should not have any subscriptions', () => {
        expect(component.supplierEditControl.value).toBe(undefined);
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete the subject', () => {
      component['destroy$'].next = jest.fn();
      component['destroy$'].complete = jest.fn();

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });

  describe('addSupplierName', () => {
    it('should dispatch the action', () => {
      const supplierName = 'test';

      component.addSupplierName(supplierName);

      expect(dialogFacade.addCustomSupplierName).toHaveBeenCalledWith(
        supplierName
      );
    });
  });

  describe('addSupplierPlant', () => {
    it('should dispatch the action', () => {
      const supplierPlant = 'test';

      component.addSupplierPlant(supplierPlant);

      expect(dialogFacade.addCustomSupplierPlant).toHaveBeenCalledWith(
        supplierPlant
      );
    });
  });
});
