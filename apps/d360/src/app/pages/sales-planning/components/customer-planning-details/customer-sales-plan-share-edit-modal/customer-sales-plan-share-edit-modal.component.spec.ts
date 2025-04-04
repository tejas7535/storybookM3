import { of } from 'rxjs';

import { Stub } from '../../../../../shared/test/stub.class';
import { CustomerSalesPlanShareEditModalComponent } from './customer-sales-plan-share-edit-modal.component';

describe('CustomerSalesPlanShareEditModalComponent', () => {
  let component: CustomerSalesPlanShareEditModalComponent;
  let dialogSpy: jest.SpyInstance;
  let loadingSpy: jest.SpyInstance;

  beforeEach(() => {
    component = Stub.get({
      component: CustomerSalesPlanShareEditModalComponent,
      providers: [
        Stub.getSalesPlanningServiceProvider(),
        Stub.getMatDialogDataProvider({
          customerNumber: 'testnumber',
          planningYear: 'testyear',
        }),
      ],
    });
    dialogSpy = jest.spyOn(component['dialogRef'], 'close');

    loadingSpy = jest.spyOn(component['loading'], 'set');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onDelete', () => {
    it('should delete the data, close the dialog and reload the table onDelete', () => {
      const deleteSpy = jest
        .spyOn(component['salesPlanningService'], 'deleteShares')
        .mockImplementation(() => of(null));
      component['onDelete']();
      expect(loadingSpy).toHaveBeenCalledWith(true);
      expect(deleteSpy).toHaveBeenCalledWith('testnumber', 'testyear');
      expect(dialogSpy).toHaveBeenCalledWith(true);
      expect(loadingSpy).toHaveBeenLastCalledWith(false);
    });
  });

  describe('onSave', () => {
    it('should update the data, close the dialog and reload the table onSave', () => {
      const updateSpy = jest
        .spyOn(component['salesPlanningService'], 'updateShares')
        .mockImplementation(() => of(null));
      component['form'].patchValue({
        adjustedAPValue: 10,
        adjustedOPValue: 20,
        adjustedSPValue: 70,
      });
      component['onSave']();
      expect(loadingSpy).toHaveBeenCalledWith(true);
      expect(updateSpy).toHaveBeenCalledWith('testnumber', 'testyear', {
        apShare: 10,
        opShare: 20,
        spShare: 70,
      });
      expect(dialogSpy).toHaveBeenCalledWith(true);
      expect(loadingSpy).toHaveBeenLastCalledWith(false);
    });
  });

  describe('onCancel', () => {
    it('should not reload the table onCancel', () => {
      component['onCancel']();
      expect(dialogSpy).toHaveBeenCalledWith(false);
    });
  });
});
