import { Stub } from '../../../../shared/test/stub.class';
import { CustomerPlanningLevelConfirmationModalComponent } from '../customer-planning-level-confirmation-modal/customer-planning-level-confirmation-modal.component';
import { CustomerPlanningLevelConfigurationModalComponent } from './customer-planning-level-configuration-modal.component';

describe('CustomerPlanningLevelConfigurationModalComponent', () => {
  let component: CustomerPlanningLevelConfigurationModalComponent;

  beforeEach(() => {
    component =
      Stub.getForEffect<CustomerPlanningLevelConfigurationModalComponent>({
        component: CustomerPlanningLevelConfigurationModalComponent,
        providers: [
          Stub.getMatDialogDataProvider({
            customerName: 'Tesla Inc',
            customerNumber: '0000086023',
            planningLevelMaterial: {
              planningLevelMaterialType: 'GP',
              isDefaultPlanningLevelMaterialType: true,
            },
          }),
        ],
      });
  });

  it('should open the confirmation dialog when material type is overridden with data deletion', () => {
    jest.spyOn(component['dialog'], 'open');
    component['data'].planningLevelMaterial.isDefaultPlanningLevelMaterialType =
      false;

    component.control.setValue('PL');
    component.onSave();
    expect(component['dialog'].open).toHaveBeenCalledWith(
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
    jest.spyOn(component['dialogRef'], 'close');
    component['data'].planningLevelMaterial.isDefaultPlanningLevelMaterialType =
      true;

    component.control.setValue('PL');

    component.onSave();

    expect(component['dialogRef'].close).toHaveBeenCalledWith({
      deleteExistingPlanningData: false,
      newPlanningLevelMaterialType: 'PL',
    });
  });

  it('should close the dialog without updating data if no changes are made', () => {
    jest.spyOn(component['dialogRef'], 'close');
    component.control.setValue('GP'); // Same as current value
    component.onSave();
    expect(component['dialogRef'].close).toHaveBeenCalledWith({
      deleteExistingPlanningData: false,
    });
  });

  it('should close the dialog without deleting data if changes can be made without deletion', () => {
    jest.spyOn(component['dialogRef'], 'close');
    component.control.setValue('PL');
    component['data'].planningLevelMaterial.isDefaultPlanningLevelMaterialType =
      true;
    component.onSave();
    expect(component['dialogRef'].close).toHaveBeenCalledWith({
      deleteExistingPlanningData: false,
      newPlanningLevelMaterialType: 'PL',
    });
  });

  it('should close the dialog with false on cancel', () => {
    jest.spyOn(component['dialogRef'], 'close');
    component.onCancel();
    expect(component['dialogRef'].close).toHaveBeenCalledWith({
      deleteExistingPlanningData: false,
    });
  });
});
