import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { StringOption } from '@schaeffler/inputs';
import { SelectModule } from '@schaeffler/inputs/select';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ManufacturerSupplier } from '@mac/feature/materials-supplier-database/models';
import {
  addCustomSupplierCountry,
  addCustomSupplierName,
  addCustomSupplierPlant,
} from '@mac/msd/store/actions/dialog';
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

describe('ManufacturerSupplierComponent', () => {
  let component: ManufacturerSupplierComponent;
  let spectator: Spectator<ManufacturerSupplierComponent>;
  let store: MockStore;
  let manufacturerSupplierIdControl: FormControl<number>;
  let supplierControl: FormControl<StringOption>;
  let supplierPlantControl: FormControl<StringOption>;
  let supplierCountryControl: FormControl<StringOption>;

  const createComponent = createComponentFactory({
    component: ManufacturerSupplierComponent,
    // required so we can set the inüuts
    detectChanges: false,
    imports: [
      CommonModule,
      MatButtonModule,
      MatFormFieldModule,
      MatIconModule,
      PushModule,
      ReactiveFormsModule,
      SelectModule,
      provideTranslocoTestingModule({ en }),
    ],
    providers: [provideMockStore({ initialState })],
    declarations: [ManufacturerSupplierComponent],
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
    });
    // run ngOnInit
    spectator.detectChanges();

    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('formControls', () => {
    describe('supplierPlantControl valueChanges', () => {
      const mockSupplierPlantBase: StringOption = {
        id: 1,
        title: 'plant',
      };
      it('should reset and enable the country control if the data is undefined', () => {
        const mockSupplierPlant = {
          ...mockSupplierPlantBase,
        };
        supplierCountryControl.reset = jest.fn();
        supplierCountryControl.enable = jest.fn();

        supplierPlantControl.setValue(mockSupplierPlant);

        expect(supplierCountryControl.reset).toHaveBeenCalled();
        expect(supplierCountryControl.enable).toHaveBeenCalled();
      });
      it('should set the country and disable the control if it is defined in the plant data', () => {
        const mockSupplierPlant = {
          ...mockSupplierPlantBase,
          data: {
            supplierCountry: 'country',
          },
        };
        supplierCountryControl.setValue = jest.fn();
        supplierCountryControl.disable = jest.fn();

        supplierPlantControl.setValue(mockSupplierPlant);

        expect(supplierCountryControl.setValue).toHaveBeenCalledWith({
          id: 'country',
          title: 'country',
        });
        expect(supplierCountryControl.disable).toHaveBeenCalled();
      });
    });

    describe('supplierDependencies valueChanges', () => {
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

        // eslint-disable-next-line unicorn/no-useless-undefined
        supplierControl.setValue(undefined);

        expect(manufacturerSupplierIdControl.reset).toHaveBeenCalled();
        expect(supplierPlantControl.reset).toHaveBeenCalledWith(undefined, {
          emitEvent: false,
        });
        expect(supplierCountryControl.reset).toHaveBeenCalledWith(undefined, {
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
      component['dialogFacade'].dispatch = jest.fn();
      const supplierName = 'test';

      component.addSupplierName(supplierName);

      expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
        addCustomSupplierName({ supplierName })
      );
    });
  });

  describe('addSupplierPlant', () => {
    it('should dispatch the action', () => {
      component['dialogFacade'].dispatch = jest.fn();
      const supplierPlant = 'test';

      component.addSupplierPlant(supplierPlant);

      expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
        addCustomSupplierPlant({ supplierPlant })
      );
    });
  });

  describe('addSupplierCountry', () => {
    it('should dispatch the action', () => {
      component['dialogFacade'].dispatch = jest.fn();
      const supplierCountry = 'test';

      component.addSupplierCountry(supplierCountry);

      expect(component['dialogFacade'].dispatch).toHaveBeenCalledWith(
        addCustomSupplierCountry({ supplierCountry })
      );
    });
  });
});
