import { ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { InfoBannerComponent } from '@schaeffler/feedback-banner';

import { CustomerPlanningLevelConfirmationModalComponent } from '../customer-planning-level-confirmation-modal/customer-planning-level-confirmation-modal.component';
import { CustomerPlanningLevelConfigurationModalComponent } from './customer-planning-level-configuration-modal.component';

describe('CustomerPlanningLevelConfigurationModalComponent', () => {
  let spectator: Spectator<CustomerPlanningLevelConfigurationModalComponent>;
  const dialogMock = {
    open: jest.fn(() => ({
      afterClosed: jest.fn(() => of(true)),
    })),
  };
  const dialogRefMock = {
    close: jest.fn(),
  };
  const createComponent = createComponentFactory({
    component: CustomerPlanningLevelConfigurationModalComponent,
    providers: [
      { provide: MatDialogRef, useValue: dialogRefMock },
      { provide: MatDialog, useValue: dialogMock },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          customerName: 'Tesla Inc',
          customerNumber: '0000086023',
          planningLevelMaterial: {
            planningLevelMaterialType: 'GP',
            isDefaultPlanningLevelMaterialType: true,
          },
        },
      },
    ],
    imports: [ReactiveFormsModule],
    declarations: [InfoBannerComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should display the customer name and number', () => {
    const customerInfoElement = spectator.query('p.text-title-small');
    expect(customerInfoElement).toHaveText('0000086023 - Tesla Inc');
  });

  it('should render radio buttons for all material types', () => {
    const radioButtons = spectator.queryAll('mat-radio-button');
    expect(radioButtons.length).toBe(3);
    expect(radioButtons[0]).toHaveText(
      'sales_planning.planning_details.planning_level_material_type.GP'
    );
    expect(radioButtons[1]).toHaveText(
      'sales_planning.planning_details.planning_level_material_type.PL'
    );
    expect(radioButtons[2]).toHaveText(
      'sales_planning.planning_details.planning_level_material_type.PC'
    );
  });

  it('should check the correct radio button based on the current planning level material type', () => {
    const radioButtons = spectator.queryAll('mat-radio-button');
    const checkedButton = radioButtons.find(
      (button) =>
        spectator.component.control.value === button.getAttribute('value')
    );

    expect(checkedButton).toBeTruthy();
    expect(checkedButton).toHaveText('GP');
  });

  it('should open the confirmation dialog when material type is overridden with data deletion', () => {
    spectator.inject(
      MAT_DIALOG_DATA
    ).planningLevelMaterial.isDefaultPlanningLevelMaterialType = false;

    spectator.component.control.setValue('PL');
    spectator.component.onSave();
    expect(dialogMock.open).toHaveBeenCalledWith(
      CustomerPlanningLevelConfirmationModalComponent,
      {
        data: {
          customerName: 'Tesla Inc',
          customerNumber: '0000086023',
        },
        width: '600px',
        maxWidth: '900px',
        autoFocus: false,
        disableClose: true,
      }
    );
  });

  it('should close the dialog with updated data when no override confirmation is needed', () => {
    spectator.inject(
      MAT_DIALOG_DATA
    ).planningLevelMaterial.isDefaultPlanningLevelMaterialType = true;

    spectator.component.control.setValue('PL');
    spectator.component.onSave();
    expect(dialogRefMock.close).toHaveBeenCalledWith({
      deleteExistingPlanningData: false,
      newPlanningLevelMaterialType: 'PL',
    });
  });

  it('should close the dialog without updating data if no changes are made', () => {
    spectator.component.control.setValue('GP'); // Same as current value
    spectator.component.onSave();
    expect(dialogRefMock.close).toHaveBeenCalledWith({
      deleteExistingPlanningData: false,
    });
  });

  it('should close the dialog without deleting data if changes can be made without deletion', () => {
    spectator.component.control.setValue('PL');
    spectator.component[
      'data'
    ].planningLevelMaterial.isDefaultPlanningLevelMaterialType = true;
    spectator.component.onSave();
    expect(dialogRefMock.close).toHaveBeenCalledWith({
      deleteExistingPlanningData: false,
      newPlanningLevelMaterialType: 'PL',
    });
  });

  it('should close the dialog with false on cancel', () => {
    spectator.component.onCancel();
    expect(dialogRefMock.close).toHaveBeenCalledWith({
      deleteExistingPlanningData: false,
    });
  });
});
