import { FormControl, FormGroup, Validators } from '@angular/forms';

import { EMPTY, of } from 'rxjs';

import {
  AlertRuleSaveResponse,
  AlertTypeDescription,
} from '../../../../../../feature/alert-rules/model';
import { SelectableValue } from '../../../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { Stub } from '../../../../../../shared/test/stub.class';
import { SingleAutocompleteSelectedEvent } from './../../../../../../shared/components/inputs/autocomplete/model';
import { MessageType } from './../../../../../../shared/models/message-type.enum';
import { AlertRuleEditSingleModalComponent } from './alert-rule-edit-single-modal.component';

describe('AlertRuleEditSingleModalComponent', () => {
  let component: AlertRuleEditSingleModalComponent;

  beforeEach(() => {
    component = Stub.get<AlertRuleEditSingleModalComponent>({
      component: AlertRuleEditSingleModalComponent,
      providers: [
        Stub.getMatDialogDataProvider({
          open: false,
          gridApi: Stub.getGridApi(),
          alertRule: {},
          title: 'edit',
        }),
        Stub.getAlertRulesServiceProvider(),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize the component and set initial values', (done) => {
      const alertTypeData = [{ alertType: 'type1' }] as AlertTypeDescription[];
      const currency = 'USD';

      jest
        .spyOn(component['alertRuleService'], 'getRuleTypeData')
        .mockReturnValue(of(alertTypeData));
      jest
        .spyOn(component['currencyService'], 'getCurrentCurrency')
        .mockReturnValue(of(currency));
      jest.spyOn(component as any, 'setInitialValues');
      jest.spyOn(component as any, 'setExecDays');
      jest.spyOn(component as any, 'updateThresholds');
      jest.spyOn(component as any, 'setIsAtLeastOneRequireStatus');

      component.ngOnInit();

      setTimeout(() => {
        expect(component['alertTypeData']).toEqual(alertTypeData);
        expect(component['currentCurrency']).toEqual(currency);
        expect(component['setInitialValues']).toHaveBeenCalled();
        expect(component['setExecDays']).toHaveBeenCalled();
        expect(component['updateThresholds']).toHaveBeenCalled();
        expect(component['setIsAtLeastOneRequireStatus']).toHaveBeenCalled();
        expect(component.loading()).toBe(false);
        done();
      });
    });
  });

  describe('init', () => {
    it('should set loading to true initially', () => {
      jest
        .spyOn(component['alertRuleService'], 'getRuleTypeData')
        .mockReturnValue(EMPTY);
      jest
        .spyOn(component['currencyService'], 'getCurrentCurrency')
        .mockReturnValue(EMPTY);

      jest.spyOn(component['loading'], 'set');
      component['init']();
      expect(component['loading'].set).toHaveBeenCalledWith(true);
    });

    it('should set alertTypeData and currentCurrency', (done) => {
      const alertTypeData = [{ alertType: 'type1' }] as AlertTypeDescription[];
      const currency = 'USD';

      jest
        .spyOn(component['alertRuleService'], 'getRuleTypeData')
        .mockReturnValue(of(alertTypeData));
      jest
        .spyOn(component['currencyService'], 'getCurrentCurrency')
        .mockReturnValue(of(currency));

      component['init']();

      setTimeout(() => {
        expect(component['alertTypeData']).toEqual(alertTypeData);
        expect(component['currentCurrency']).toEqual(currency);
        done();
      });
    });

    it('should call setInitialValues, setExecDays, updateThresholds, and setIsAtLeastOneRequireStatus', (done) => {
      jest
        .spyOn(component['alertRuleService'], 'getRuleTypeData')
        .mockReturnValue(of([]));
      jest
        .spyOn(component['currencyService'], 'getCurrentCurrency')
        .mockReturnValue(of('USD'));
      jest.spyOn(component as any, 'setInitialValues');
      jest.spyOn(component as any, 'setExecDays');
      jest.spyOn(component as any, 'updateThresholds');
      jest.spyOn(component as any, 'setIsAtLeastOneRequireStatus');

      component['init']();

      setTimeout(() => {
        expect(component['setInitialValues']).toHaveBeenCalled();
        expect(component['setExecDays']).toHaveBeenCalled();
        expect(component['updateThresholds']).toHaveBeenCalled();
        expect(component['setIsAtLeastOneRequireStatus']).toHaveBeenCalled();
        done();
      });
    });

    it('should set loading to false after initialization', (done) => {
      jest
        .spyOn(component['alertRuleService'], 'getRuleTypeData')
        .mockReturnValue(of([]));
      jest
        .spyOn(component['currencyService'], 'getCurrentCurrency')
        .mockReturnValue(of('USD'));
      jest.spyOn(component['loading'], 'set');

      component['init']();

      setTimeout(() => {
        expect(component['loading'].set).toHaveBeenCalledWith(false);
        done();
      });
    });
  });

  describe('setInitialValues', () => {
    it('should set the form values with the provided alertRule data', () => {
      const alertRule = {
        id: 'abc',
        customerNumber: '12345',
        demandPlannerId: 'dp1',
        endDate: new Date('2024-12-31'),
        execInterval: 'M1',
        execDay: 'M01',
        gkamNumber: 'gk1',
        materialClassification: 'AP',
        materialNumber: 'mat1',
        productionLine: 'prod1',
        productLine: 'pl1',
        region: 'region1',
        salesArea: 'sa1',
        salesOrg: 'so1',
        sectorManagement: 'sm1',
        startDate: new Date('2024-01-01'),
        threshold1: 10,
        threshold2: 20,
        threshold3: 30,
        type: 'type1',
        currency: 'EUR',
      } as any;

      component['data'].alertRule = alertRule;
      component['currentCurrency'] = 'USD';

      component['setInitialValues']();

      expect(component.formGroup.value).toEqual({
        alertComment: null,
        customerNumber: '12345',
        demandPlannerId: 'dp1',
        endDate: new Date('2024-12-31'),
        execInterval: 'M1',
        execDay: 'M01',
        gkamNumber: 'gk1',
        materialClassification: 'AP',
        materialNumber: 'mat1',
        productionLine: 'prod1',
        productLine: 'pl1',
        region: 'region1',
        salesArea: 'sa1',
        salesOrg: 'so1',
        sectorManagement: 'sm1',
        startDate: new Date('2024-01-01'),
        threshold1: 10,
        threshold2: 20,
        threshold3: 30,
        type: 'type1',
        currency: 'EUR',
      });
    });

    it('should set the currency to currentCurrency if alertRule currency is not provided', () => {
      const alertRule = {
        id: 'abc',
        customerNumber: '12345',
        demandPlannerId: 'dp1',
        endDate: new Date('2024-12-31'),
        execInterval: 'M1',
        execDay: 'M01',
        gkamNumber: 'gk1',
        materialClassification: 'AP',
        materialNumber: 'mat1',
        productionLine: 'prod1',
        productLine: 'pl1',
        region: 'region1',
        salesArea: 'sa1',
        salesOrg: 'so1',
        sectorManagement: 'sm1',
        startDate: new Date('2024-01-01'),
        threshold1: 10,
        threshold2: 20,
        threshold3: 30,
        type: 'type1',
        currency: null,
      } as any;

      component['data'].alertRule = alertRule;
      component['currentCurrency'] = 'USD';

      component['setInitialValues']();

      expect(component.formGroup.value.currency).toEqual('USD');
    });

    it('should not emit events when patching the form values', () => {
      const alertRule = {
        id: 'abc',
        customerNumber: '12345',
        demandPlannerId: 'dp1',
        endDate: new Date('2024-12-31'),
        execInterval: 'M1',
        execDay: 'M01',
        gkamNumber: 'gk1',
        materialClassification: 'AP',
        materialNumber: 'mat1',
        productionLine: 'prod1',
        productLine: 'pl1',
        region: 'region1',
        salesArea: 'sa1',
        salesOrg: 'so1',
        sectorManagement: 'sm1',
        startDate: new Date('2024-01-01'),
        threshold1: 10,
        threshold2: 20,
        threshold3: 30,
        type: 'type1',
        currency: 'EUR',
      } as any;

      component['data'].alertRule = alertRule;
      component['currentCurrency'] = 'USD';

      const patchValueSpy = jest.spyOn(component.formGroup, 'patchValue');

      component['setInitialValues']();

      expect(patchValueSpy).toHaveBeenCalledWith(
        {
          ...alertRule,
          currency: 'EUR',
        },
        { emitEvent: false }
      );
    });
  });

  describe('getOptions', () => {
    it('should return the selectable options by key', () => {
      const key = 'interval';
      const options = { options: [{ id: 'M1', text: 'Monthly' }] };
      jest
        .spyOn(component['selectableOptionsService'], 'get')
        .mockReturnValue(options);

      const result = component['getOptions'](key);

      expect(result).toEqual(options);
    });
  });

  describe('updateForm', () => {
    it('should update the required fields if the key is in conditionalRequired', () => {
      const event = {
        option: { id: 'salesArea' },
      } as SingleAutocompleteSelectedEvent;
      jest.spyOn(component as any, 'setIsAtLeastOneRequireStatus');

      component['updateForm'](event, 'salesArea');

      expect(component['setIsAtLeastOneRequireStatus']).toHaveBeenCalled();
    });

    it('should update thresholds if the key is type', () => {
      const event = {
        option: { id: 'type1' },
      } as SingleAutocompleteSelectedEvent;
      jest.spyOn(component as any, 'applyRuleTypeChange');
      jest.spyOn(component as any, 'updateThresholds');

      component['updateForm'](event, 'type');

      expect(component['applyRuleTypeChange']).toHaveBeenCalledWith({
        id: 'type1',
        text: '',
      });
      expect(component['updateThresholds']).toHaveBeenCalled();
    });
  });

  describe('setIsAtLeastOneRequireStatus', () => {
    it('should set or remove required validator based on other input fields', () => {
      component.formGroup.patchValue({
        salesArea: 'area1',
        salesOrg: null,
        customerNumber: null,
        sectorManagement: null,
        demandPlannerId: null,
        gkamNumber: null,
      });

      jest.spyOn(component as any, 'setOrRemoveRequired');

      component['setIsAtLeastOneRequireStatus']();

      expect(component['setOrRemoveRequired']).toHaveBeenCalledWith(
        false,
        component.formGroup.get('salesArea')
      );
      expect(component['setOrRemoveRequired']).toHaveBeenCalledWith(
        false,
        component.formGroup.get('salesOrg')
      );
      expect(component['setOrRemoveRequired']).toHaveBeenCalledWith(
        false,
        component.formGroup.get('customerNumber')
      );
      expect(component['setOrRemoveRequired']).toHaveBeenCalledWith(
        false,
        component.formGroup.get('sectorManagement')
      );
      expect(component['setOrRemoveRequired']).toHaveBeenCalledWith(
        false,
        component.formGroup.get('demandPlannerId')
      );
      expect(component['setOrRemoveRequired']).toHaveBeenCalledWith(
        false,
        component.formGroup.get('gkamNumber')
      );
    });
  });

  describe('setOrRemoveRequired', () => {
    it('should set required validator if required is true', () => {
      const control = new FormControl(null);
      jest.spyOn(control, 'setValidators');
      jest.spyOn(control, 'updateValueAndValidity');

      component['setOrRemoveRequired'](true, control);

      expect(control.setValidators).toHaveBeenCalledWith(Validators.required);
      expect(control.updateValueAndValidity).toHaveBeenCalledWith({
        emitEvent: true,
      });
    });

    it('should remove required validator if required is false', () => {
      const control = new FormControl(null);
      jest.spyOn(control, 'removeValidators');
      jest.spyOn(control, 'updateValueAndValidity');

      component['setOrRemoveRequired'](false, control);

      expect(control.removeValidators).toHaveBeenCalledWith(
        Validators.required
      );
      expect(control.updateValueAndValidity).toHaveBeenCalledWith({
        emitEvent: true,
      });
    });
  });

  describe('getThresholdDescription', () => {
    it('should return the threshold description for the given number', () => {
      component['alertTypeDescription'] = {
        threshold1Description: 'Threshold 1',
        threshold2Description: 'Threshold 2',
        threshold3Description: 'Threshold 3',
      } as AlertTypeDescription;

      expect(component['getThresholdDescription'](1)).toEqual('Threshold 1');
      expect(component['getThresholdDescription'](2)).toEqual('Threshold 2');
      expect(component['getThresholdDescription'](3)).toEqual('Threshold 3');
    });

    it('should return an empty string if alertTypeDescription is null', () => {
      component['alertTypeDescription'] = null;

      expect(component['getThresholdDescription'](1)).toEqual('');
    });
  });

  describe('updateThresholds', () => {
    it('should update the threshold data based on the selected type', () => {
      const alertTypeData = [
        {
          alertType: 'type1',
          threshold1Type: '1',
          threshold2Type: '2',
          threshold3Type: '3',
        },
      ] as AlertTypeDescription[];
      component['alertTypeData'] = alertTypeData;
      component.formGroup.patchValue({ type: { id: 'type1' } });

      jest.spyOn(component as any, 'setOrRemoveRequired');

      component['updateThresholds']();

      expect(component['alertTypeDescription']).toEqual(alertTypeData[0]);
      expect(component['setOrRemoveRequired']).toHaveBeenCalledWith(
        true,
        component.formGroup.get('threshold1')
      );
      expect(component['setOrRemoveRequired']).toHaveBeenCalledWith(
        true,
        component.formGroup.get('threshold2')
      );
      expect(component['setOrRemoveRequired']).toHaveBeenCalledWith(
        false,
        component.formGroup.get('threshold3')
      );
    });

    it('should reset thresholds if the selected type is not found', () => {
      component['alertTypeData'] = [];
      component.formGroup.patchValue({ type: { id: 'type1' } });

      jest.spyOn(component as any, 'setOrRemoveRequired');

      component['updateThresholds']();

      expect(component['alertTypeDescription']).toBeNull();
      expect(component['setOrRemoveRequired']).toHaveBeenCalledWith(
        false,
        component.formGroup.get('threshold1')
      );
      expect(component['setOrRemoveRequired']).toHaveBeenCalledWith(
        false,
        component.formGroup.get('threshold2')
      );
      expect(component['setOrRemoveRequired']).toHaveBeenCalledWith(
        false,
        component.formGroup.get('threshold3')
      );
    });
  });

  describe('setExecDays', () => {
    it('should set the execDayOptions based on the execInterval value', () => {
      component.formGroup.patchValue({ execInterval: { id: 'M1' } });

      component['setExecDays']();

      expect(component['execDayOptions']).toEqual(['M01', 'M15']);
    });

    it('should set the execDayOptions to an empty array if execInterval is null', () => {
      component.formGroup.patchValue({ execInterval: null });

      component['setExecDays']();

      expect(component['execDayOptions']).toEqual([]);
    });
  });

  describe('onIntervalSelectionChange', () => {
    it('should update execDay based on the selected execInterval', () => {
      const value = { id: 'M1' } as SelectableValue;
      component.formGroup.patchValue({ execDay: null });

      component['onIntervalSelectionChange'](value);

      expect(component.formGroup.get('execDay')?.value).toEqual('M01');
    });

    it('should keep the current execDay if it is valid for the selected execInterval', () => {
      const value = { id: 'M1' } as SelectableValue;
      component.formGroup.patchValue({ execDay: 'M15' });

      component['onIntervalSelectionChange'](value);

      expect(component.formGroup.get('execDay')?.value).toEqual('M15');
    });

    it('should set execDay to null if the selected execInterval is not valid', () => {
      const value = { id: 'invalid' } as SelectableValue;
      component.formGroup.patchValue({ execDay: 'M15' });

      component['onIntervalSelectionChange'](value);

      expect(component.formGroup.get('execDay')?.value).toBeNull();
    });
  });

  describe('crossFieldValidator', () => {
    it('should return a ValidatorFn that validates the start and end dates', () => {
      const formGroup = new FormGroup({
        startDate: new FormControl(new Date('2024-01-01')),
        endDate: new FormControl(new Date('2024-12-31')),
      });

      const validatorFn = component['crossFieldValidator']();
      const result = validatorFn(formGroup);

      expect(result).toBeNull();
    });

    it('should return an error if the start date is after the end date', () => {
      const formGroup = new FormGroup({
        startDate: new FormControl(new Date('2024-12-31')),
        endDate: new FormControl(new Date('2024-01-01')),
      });

      const validatorFn = component['crossFieldValidator']();
      const result = validatorFn(formGroup);

      expect(result).toEqual({ endDate: ['end-before-start'] });
    });
  });

  describe('applyRuleTypeChange', () => {
    it('should reset thresholds if the selected type is different from the current type', () => {
      component.formGroup.patchValue({ type: { id: 'type1' } });

      component['applyRuleTypeChange']({ id: 'type2' } as any);

      expect(component.formGroup.get('threshold1')?.value).toBeNull();
      expect(component.formGroup.get('threshold2')?.value).toBeNull();
      expect(component.formGroup.get('threshold3')?.value).toBeNull();
    });

    it('should not reset thresholds if the selected type is the same as the current type', () => {
      component.formGroup.patchValue({ type: 'type1' });
      component.formGroup.patchValue({
        threshold1: 10,
        threshold2: 20,
        threshold3: 30,
      });

      component['applyRuleTypeChange']({ id: 'type1' } as any);

      expect(component.formGroup.get('threshold1')?.value).toEqual(10);
      expect(component.formGroup.get('threshold2')?.value).toEqual(20);
      expect(component.formGroup.get('threshold3')?.value).toEqual(30);
    });
  });

  describe('onSave', () => {
    it('should not save the form if it is invalid', () => {
      component.formGroup.patchValue({ type: null });

      jest.spyOn(component['alertRuleService'], 'saveMultiAlertRules');

      component['onSave']();

      expect(
        component['alertRuleService'].saveMultiAlertRules
      ).not.toHaveBeenCalled();
    });

    it('should save the form if it is valid', (done) => {
      component.formGroup.patchValue({
        type: 'type1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
      });

      jest.spyOn(component.formGroup, 'valid', 'get').mockReturnValue(true);

      jest
        .spyOn(component['alertRuleService'], 'saveMultiAlertRules')
        .mockReturnValue(
          of({
            overallStatus: MessageType.Success,
            overallErrorMsg: null,
            response: [],
          })
        );

      jest.spyOn(component['snackbarService'], 'openSnackBar');
      jest.spyOn(component as any, 'handleOnClose');

      component['onSave']();

      setTimeout(() => {
        expect(
          component['alertRuleService'].saveMultiAlertRules
        ).toHaveBeenCalled();
        expect(component['snackbarService'].openSnackBar).toHaveBeenCalled();
        expect(component['handleOnClose']).toHaveBeenCalled();
        done();
      });
    });

    it('should show an error message if the save operation fails', (done) => {
      component.formGroup.patchValue({
        type: 'type1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
      });

      jest.spyOn(component.formGroup, 'valid', 'get').mockReturnValue(true);

      jest
        .spyOn(component['alertRuleService'], 'saveMultiAlertRules')
        .mockReturnValue(
          of({
            overallStatus: MessageType.Error,
            overallErrorMsg: 'error.unknown',
            response: [
              {
                result: {
                  messageType: MessageType.Error,
                  message: 'Error message',
                },
              },
            ] as any,
          })
        );

      jest.spyOn(component['snackbarService'], 'openSnackBar');

      component['onSave']();

      setTimeout(() => {
        expect(component['snackbarService'].openSnackBar).toHaveBeenCalledWith(
          'error.unknown'
        );
        expect(component.loading()).toBe(false);
        done();
      });
    });
  });

  describe('handleOnClose', () => {
    it('should close the dialog with the provided result', () => {
      const result = [{ id: '1' }] as AlertRuleSaveResponse[];
      jest.spyOn(component['dialogRef'], 'close');

      component['handleOnClose'](result);

      expect(component['dialogRef'].close).toHaveBeenCalledWith(result);
    });
  });
});
