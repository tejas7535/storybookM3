import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { SalesPlanningService } from '../../../../../../../feature/sales-planning/sales-planning.service';
import { AuthService } from '../../../../../../../shared/utils/auth/auth.service';
import { CustomerSalesPlanNumberEditModalComponent } from '../../../customer-sales-plan-number-edit-modal/customer-sales-plan-number-edit-modal.component';
import { SalesPlanningAdjustedTotalCellRendererComponent } from './sales-planning-adjusted-total-cell-renderer.component';

describe('SalesPlanningAdjustedTotalCellRendererComponent', () => {
  let spectator: Spectator<SalesPlanningAdjustedTotalCellRendererComponent>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockSalesPlanningService: jest.Mocked<SalesPlanningService>;
  let mockAuthService: jest.Mocked<AuthService>;
  let dialogRefMock: Partial<
    MatDialogRef<CustomerSalesPlanNumberEditModalComponent>
  >;

  const mockReloadData = jest.fn();

  const createComponent = createComponentFactory({
    component: SalesPlanningAdjustedTotalCellRendererComponent,
    declarations: [],
    providers: [
      mockProvider(MatDialog, { open: jest.fn() }),
      mockProvider(SalesPlanningService, {
        deleteDetailedCustomerSalesPlan: jest.fn(),
        updateDetailedCustomerSalesPlan: jest.fn(),
      }),
      mockProvider(AuthService, { hasUserAccess: jest.fn() }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();

    mockDialog = spectator.inject(MatDialog) as jest.Mocked<MatDialog>;
    mockSalesPlanningService = spectator.inject(
      SalesPlanningService
    ) as jest.Mocked<SalesPlanningService>;
    mockAuthService = spectator.inject(AuthService) as jest.Mocked<AuthService>;

    mockAuthService.hasUserAccess.mockReturnValue(of(true));

    dialogRefMock = {
      afterClosed: jest.fn().mockReturnValue(of(null)),
    };

    jest
      .spyOn(mockDialog, 'open')
      .mockReturnValue(
        dialogRefMock as MatDialogRef<CustomerSalesPlanNumberEditModalComponent>
      );

    const mockParams = {
      node: {
        level: 1,
      },
      data: {
        customerNumber: '93090',
        planningMaterial: 'I03',
        planningMaterialText: 'Bearings',
        planningLevelMaterialType: 'PL',
        planningCurrency: 'EUR',
        planningYear: '2025',
      },
      context: {
        reloadData: mockReloadData,
      },
    } as any;

    spectator.component.agInit(mockParams);
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should open the edit modal on button click', () => {
    mockDialog.open.mockReturnValue({ afterClosed: () => of(null) } as any);

    spectator.component.isUserAllowedToEdit$ = of(true);
    spectator.detectChanges();

    spectator.click('button');

    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should call deleteDetailedCustomerSalesPlan on delete', () => {
    mockSalesPlanningService.deleteDetailedCustomerSalesPlan.mockReturnValue(
      of()
    );
    const deleteFn = spectator.component['onDelete']();
    deleteFn();
    expect(
      mockSalesPlanningService.deleteDetailedCustomerSalesPlan
    ).toHaveBeenCalled();
  });

  it('should call updateDetailedCustomerSalesPlan on save', () => {
    mockSalesPlanningService.updateDetailedCustomerSalesPlan.mockReturnValue(
      of()
    );
    const saveFn = spectator.component['onSave']();

    saveFn(15_000);

    expect(
      mockSalesPlanningService.updateDetailedCustomerSalesPlan
    ).toHaveBeenCalledWith('93090', {
      adjustedValue: 15_000,
      planningCurrency: 'EUR',
      planningLevelMaterialType: 'PL',
      planningMaterial: 'I03',
      planningMonth: undefined,
      planningYear: '2025',
    });
  });

  it('editing should not be possible on planning material level for current year > year + 2', () => {
    const mockParams = {
      node: {
        level: 1,
      },
      data: {
        customerNumber: '93090',
        planningMaterial: 'I03',
        planningMaterialText: 'Bearings',
        planningLevelMaterialType: 'PL',
        planningCurrency: 'EUR',
        planningYear: new Date().getFullYear() + 3,
      },
      context: {
        reloadData: mockReloadData,
      },
    } as any;

    spectator.component.agInit(mockParams);
    spectator.detectChanges();

    expect(spectator.component.isEditPossible()).toBe(false);
  });

  it('should trigger reload data when dialog returns a value', () => {
    jest.spyOn(dialogRefMock, 'afterClosed').mockReturnValue(of(7500));

    spectator.component.handleEditCustomerSalesPlanNumberClicked();

    expect(mockReloadData).toHaveBeenCalled();
  });

  it('editing should be possible on year level for year > year + 2', () => {
    const mockParams = {
      node: {
        level: 0,
      },
      data: {
        customerNumber: '93090',
        planningMaterial: 'I03',
        planningMaterialText: 'Bearings',
        planningLevelMaterialType: 'PL',
        planningCurrency: 'EUR',
        planningYear: new Date().getFullYear() + 3,
      },
      context: {
        reloadData: mockReloadData,
      },
    } as any;

    spectator.component.agInit(mockParams);
    spectator.detectChanges();

    expect(spectator.component.isEditPossible()).toBe(true);
  });
});
