import { HttpClient } from '@angular/common/http';

import { of, throwError } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { CustomerEntry } from '../../feature/global-selection/model';
import { GlobalSelectionState } from '../../shared/components/global-selection-criteria/global-selection-state.service';
import { SelectableOptionsService } from '../../shared/services/selectable-options.service';
import { SnackbarService } from './../../shared/utils/service/snackbar.service';
import { DemandValidationComponent } from './demand-validation.component';

describe('DemandValidationComponent', () => {
  let component: DemandValidationComponent;
  let spectator: Spectator<DemandValidationComponent>;

  const createComponent = createComponentFactory({
    component: DemandValidationComponent,
    providers: [
      mockProvider(SnackbarService),
      mockProvider(HttpClient, { get: () => of({}), post: () => of({}) }),
      mockProvider(SelectableOptionsService, {
        get: () => of({}),
        loading$: of(false),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('updateCustomerData method', () => {
    it('should update customer data successfully', () => {
      // Arrange
      jest
        .spyOn(component['globalSelectionService'], 'getCustomersData')
        .mockReturnValue(of([{ id: 1, name: 'Test Customer' }] as any));

      // Act
      component['updateCustomerData']();

      // Assert
      expect(component['customerData']()).toEqual([
        { id: 1, name: 'Test Customer' },
      ]);
      expect(component['selectedCustomer']()).toEqual({
        id: 1,
        name: 'Test Customer',
      });
      expect(component['loading']()).toBe(false);
    });

    it('should handle error when fetching customer data', () => {
      // Arrange
      jest
        .spyOn(component['globalSelectionService'], 'getCustomersData')
        .mockReturnValue(
          throwError(() => new Error('Failed to fetch customers'))
        );

      // Act
      component['updateCustomerData']();

      // Assert
      expect(component['loading']()).toBe(false);
    });
  });

  describe('onUpdateGlobalSelection method', () => {
    it('should update global selection state', () => {
      // Arrange
      const newGlobalSelection: GlobalSelectionState = {} as any;
      jest
        .spyOn(component['globalSelectionStateService'], 'getState')
        .mockReturnValue(newGlobalSelection);
      component['updateCustomerData'] = jest.fn();
      jest.spyOn(component as any, 'updateCustomerData').mockReturnValue({});

      // Act
      component['onUpdateGlobalSelection'](newGlobalSelection);

      // Assert
      expect(component['loading']()).toBe(true);
      expect(component['updateCustomerData']).toHaveBeenCalled();
    });
  });

  describe('handleCustomerChange method', () => {
    it('should update selected customer and reset material list entry', () => {
      // Arrange
      const newCustomer: CustomerEntry = { id: 2, name: 'New Customer' } as any;

      // Act
      component['handleCustomerChange'](newCustomer);

      // Assert
      expect(component['selectedCustomer']()).toEqual(newCustomer);
      expect(component['selectedMaterialListEntry']()).toBeNull();
    });
  });

  describe('confirmContinueAndLooseUnsavedChanges method', () => {
    it('should show confirmation dialog when unsaved changes exist', () => {
      // Arrange
      component['unsavedChanges'].set(true);
      const mockConfirm = jest
        .spyOn(window, 'confirm')
        .mockImplementation(() => true);

      // Act
      const result = component['confirmContinueAndLooseUnsavedChanges']();

      // Assert
      expect(mockConfirm).toHaveBeenCalled();
      expect(result).toBe(true);

      // Cleanup
      mockConfirm.mockRestore();
    });

    it('should not show confirmation dialog when no unsaved changes', () => {
      // Arrange
      component['unsavedChanges'].set(false);
      const mockConfirm = jest
        .spyOn(window, 'confirm')
        .mockImplementation(() => true);

      // Act
      const result = component['confirmContinueAndLooseUnsavedChanges']();

      // Assert
      expect(mockConfirm).not.toHaveBeenCalled();
      expect(result).toBe(true);

      // Cleanup
      mockConfirm.mockRestore();
    });
  });

  describe('handleMaterialListVisible method', () => {
    it('should update material list visibility state', () => {
      // Act
      component['handleMaterialListVisible']({ open: false });

      // Assert
      expect(component['materialListVisible']()).toBe(false);
    });
  });
});
