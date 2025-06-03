import { Stub } from './../../../../shared/test/stub.class';
import { CustomerPlanningLevelConfirmationModalComponent } from './customer-planning-level-confirmation-modal.component';

describe('CustomerPlanningLevelConfirmationModalComponent', () => {
  let component: CustomerPlanningLevelConfirmationModalComponent;

  beforeEach(() => {
    component = Stub.get({
      component: CustomerPlanningLevelConfirmationModalComponent,
      providers: [
        Stub.getMatDialogProvider(),
        Stub.getMatDialogDataProvider({
          customerName: 'Tesla Inc',
          customerNumber: '0000086023',
        }),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog with true when confirmed', () => {
    const closeSpy = jest.spyOn(component['dialogRef'], 'close');

    component.onConfirm();

    expect(closeSpy).toHaveBeenCalledWith(true);
  });

  it('should close dialog with false when canceled', () => {
    const closeSpy = jest.spyOn(component['dialogRef'], 'close');

    component.onCancel();

    expect(closeSpy).toHaveBeenCalledWith(false);
  });

  it('should have correct customer data from MAT_DIALOG_DATA', () => {
    expect(component['data'].customerName).toBe('Tesla Inc');
    expect(component['data'].customerNumber).toBe('0000086023');
  });
});
