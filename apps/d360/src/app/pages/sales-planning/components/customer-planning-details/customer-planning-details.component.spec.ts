import { MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { PlanningLevelService } from '../../../../feature/sales-planning/planning-level.service';
import { CustomerPlanningDetailsComponent } from './customer-planning-details.component';

describe('CustomerPlanningDetailsComponent', () => {
  let spectator: Spectator<CustomerPlanningDetailsComponent>;

  const dialogMock = {
    open: jest.fn(() => ({
      afterClosed: jest.fn(() =>
        of({
          deleteExistingPlanningData: true,
          newPlanningLevelMaterialType: 'PL',
        })
      ),
    })),
  };

  const planningLevelServiceMock = {
    getMaterialTypeByCustomerNumber: jest.fn(() =>
      of({
        planningLevelMaterialType: 'GP',
        isDefaultPlanningLevelMaterialType: true,
      })
    ),
    deleteMaterialTypeByCustomerNumber: jest.fn(() => of(null)),
  };

  const createComponent = createComponentFactory({
    component: CustomerPlanningDetailsComponent,
    providers: [
      { provide: MatDialog, useValue: dialogMock },
      { provide: PlanningLevelService, useValue: planningLevelServiceMock },
    ],
  });

  beforeEach(() => {
    jest.clearAllMocks();

    spectator = createComponent({
      props: {
        customerName: 'Tesla Inc',
        customerNumber: '0000086023',
      },
    });
  });

  it('should display the title text', () => {
    const titleElement = spectator.query('h2.text-title-large');
    expect(titleElement).toHaveText('sales_planning.planning_details.title');
  });

  it('should toggle panel content visibility when the button is clicked', () => {
    const toggleButton = spectator.query('button[mat-icon-button]');
    spectator.click(toggleButton);

    expect(spectator.component.openPanelContent()).toBe(false);

    spectator.click(toggleButton);
    expect(spectator.component.openPanelContent()).toBe(true);
  });

  it('should fetch planning level material on initialization', () => {
    expect(
      planningLevelServiceMock.getMaterialTypeByCustomerNumber
    ).toHaveBeenCalledWith('0000086023');
  });

  it('should disable buttons when no customer is selected', () => {
    spectator.setInput('customerName', null);
    spectator.setInput('customerNumber', null);

    const filterButton = spectator.query('button[mat-button][disabled]');
    const settingsButton = spectator.query('button[mat-button][disabled]');
    const historyButton = spectator.query('button[mat-button][disabled]');

    expect(filterButton).toBeTruthy();
    expect(settingsButton).toBeTruthy();
    expect(historyButton).toBeTruthy();
  });

  it('should close dialog and delete data when modal confirms deletion', () => {
    spectator.component.handlePlanningLevelModalClicked();

    expect(
      planningLevelServiceMock.deleteMaterialTypeByCustomerNumber
    ).toHaveBeenCalledWith('0000086023');
  });

  it('should override the planning level material when changed in dialog', () => {
    spectator.component.handlePlanningLevelModalClicked();

    expect(
      spectator.component.planningLevelMaterialConfiguration()
        .planningLevelMaterialType
    ).toBe('PL');
  });

  it('should not delete data when modal does not confirm deletion', () => {
    dialogMock.open = jest.fn(() => ({
      afterClosed: jest.fn(() =>
        of({
          deleteExistingPlanningData: false,
          newPlanningLevelMaterialType: null,
        })
      ),
    }));

    spectator.component.handlePlanningLevelModalClicked();

    expect(
      planningLevelServiceMock.deleteMaterialTypeByCustomerNumber
    ).not.toHaveBeenCalled();
  });
});
