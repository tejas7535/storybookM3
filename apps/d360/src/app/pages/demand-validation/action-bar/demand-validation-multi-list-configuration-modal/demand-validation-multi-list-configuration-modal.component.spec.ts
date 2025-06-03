import { of } from 'rxjs';

import { Stub } from './../../../../shared/test/stub.class';
import { DemandValidationMultiListConfigurationModalComponent } from './demand-validation-multi-list-configuration-modal.component';

describe('DemandValidationMultiListConfigurationModalComponent', () => {
  let component: DemandValidationMultiListConfigurationModalComponent;

  beforeEach(() => {
    component = Stub.get<DemandValidationMultiListConfigurationModalComponent>({
      component: DemandValidationMultiListConfigurationModalComponent,
      providers: [
        Stub.getMatDialogProvider(),
        Stub.getMatDialogDataProvider({
          customerName: 'Test Customer',
          customerNumber: '42',
          materialType: 'schaeffler',
        }),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with schaeffler as default materialType', () => {
    expect(
      component['listEditConfigurationForm'].controls.materialType.value
    ).toEqual('schaeffler');
  });

  it('should change materialType when form control changes', () => {
    component['listEditConfigurationForm'].controls.materialType.setValue(
      'customer'
    );
    expect(
      component['listEditConfigurationForm'].controls.materialType.value
    ).toEqual('customer');
  });

  describe('continueToMultiEdit', () => {
    let dialogSpy: jest.SpyInstance;
    let dialogRefCloseSpy: jest.SpyInstance;
    let mockDialogRef: any;

    beforeEach(() => {
      mockDialogRef = jest.fn().mockReturnValue(of(true));
      dialogSpy = jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: mockDialogRef,
      } as any);
      dialogRefCloseSpy = jest.spyOn(component['dialogRef'], 'close');
    });

    it('should open the DemandValidationMultiListEditModalComponent with correct data', () => {
      component['continueToMultiEdit']();

      expect(dialogSpy).toHaveBeenCalledWith(
        expect.any(Function), // DemandValidationMultiListEditModalComponent
        {
          data: {
            customerName: 'Test Customer',
            customerNumber: '42',
            materialType: 'schaeffler',
          },
          panelClass: ['form-dialog', 'demand-validation-multi-edit'],
          autoFocus: false,
          disableClose: true,
        }
      );
    });

    it('should pass the selected materialType in dialog data', () => {
      component['listEditConfigurationForm'].controls.materialType.setValue(
        'customer'
      );
      component['continueToMultiEdit']();

      expect(dialogSpy).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          data: expect.objectContaining({
            materialType: 'customer',
          }),
        })
      );
    });

    it('should close the current dialog with the returned value when child dialog closes', () => {
      component['continueToMultiEdit']();

      expect(dialogRefCloseSpy).toHaveBeenCalledWith(true);
    });
  });
});
