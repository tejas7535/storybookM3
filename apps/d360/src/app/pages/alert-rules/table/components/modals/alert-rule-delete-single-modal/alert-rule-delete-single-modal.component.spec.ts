import { of } from 'rxjs';

import { AlertRule } from '../../../../../../feature/alert-rules/model';
import { Stub } from '../../../../../../shared/test/stub.class';
import { AlertRuleDeleteSingleModalComponent } from './alert-rule-delete-single-modal.component';

describe('AlertRuleDeleteSingleModalComponent', () => {
  let component: AlertRuleDeleteSingleModalComponent;

  beforeEach(() => {
    component = Stub.get<AlertRuleDeleteSingleModalComponent>({
      component: AlertRuleDeleteSingleModalComponent,
      providers: [
        Stub.getAlertRulesServiceProvider(),
        Stub.getMatDialogDataProvider({
          gridApi: Stub.getGridApi(),
          alertRule: {},
        }),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('deleteEntry', () => {
    it('should not call deleteSingleAlterRule if alertRule is not provided', () => {
      component.data.alertRule = null;
      const deleteSpy = jest.spyOn(
        component['alertRuleService'],
        'deleteSingleAlterRule'
      );

      component['deleteEntry']();

      expect(deleteSpy).not.toHaveBeenCalled();
    });

    it('should call deleteSingleAlterRule with the provided alertRule', () => {
      const alertRule = { id: '1' } as AlertRule;
      component.data.alertRule = alertRule;
      const deleteSpy = jest
        .spyOn(component['alertRuleService'], 'deleteSingleAlterRule')
        .mockReturnValue(
          of({
            overallStatus: 'SUCCESS',
            overallErrorMsg: null,
            response: [],
          })
        );

      component['deleteEntry']();

      expect(deleteSpy).toHaveBeenCalledWith(alertRule);
    });

    it('should show a success message and remove the alertRule from the grid if the delete operation is successful', (done) => {
      const alertRule = { id: '1' } as AlertRule;
      component.data.alertRule = alertRule;
      const response = {
        overallStatus: 'SUCCESS',
        overallErrorMsg: null,
        response: [],
      } as any;
      jest
        .spyOn(component['alertRuleService'], 'deleteSingleAlterRule')
        .mockReturnValue(of(response));
      const snackBarSpy = jest.spyOn(
        component['snackBarService'],
        'openSnackBar'
      );
      const applyTransactionSpy = jest.spyOn(
        component.data.gridApi,
        'applyTransaction'
      );
      const closeSpy = jest.spyOn(component.dialogRef, 'close');

      component['deleteEntry']();

      setTimeout(() => {
        expect(snackBarSpy).toHaveBeenCalledWith(
          'alert_rules.action_menu_deleted'
        );
        expect(applyTransactionSpy).toHaveBeenCalledWith({
          remove: [alertRule],
        });
        expect(closeSpy).toHaveBeenCalled();
        done();
      });
    });

    it('should show an error message if the delete operation fails', (done) => {
      const alertRule = { id: '1' } as AlertRule;
      component.data.alertRule = alertRule;
      const response = {
        overallStatus: 'ERROR',
        overallErrorMsg: 'Error',
        response: [],
      } as any;
      jest
        .spyOn(component['alertRuleService'], 'deleteSingleAlterRule')
        .mockReturnValue(of(response));
      const snackBarSpy = jest.spyOn(
        component['snackBarService'],
        'openSnackBar'
      );
      const applyTransactionSpy = jest.spyOn(
        component.data.gridApi,
        'applyTransaction'
      );
      const closeSpy = jest.spyOn(component.dialogRef, 'close');

      component['deleteEntry']();

      setTimeout(() => {
        expect(snackBarSpy).toHaveBeenCalledWith('Error');
        expect(applyTransactionSpy).not.toHaveBeenCalled();
        expect(closeSpy).not.toHaveBeenCalled();
        done();
      });
    });
  });
});
