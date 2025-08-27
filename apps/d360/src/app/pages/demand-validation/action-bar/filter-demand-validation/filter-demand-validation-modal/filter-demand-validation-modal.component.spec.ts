import { FormGroup } from '@angular/forms';

import { Stub } from '../../../../../shared/test/stub.class';
import { FilterDemandValidationModalComponent } from './filter-demand-validation-modal.component';

describe('FilterDemandValidationModalComponent', () => {
  let component: FilterDemandValidationModalComponent;

  beforeEach(() => {
    component = Stub.get<FilterDemandValidationModalComponent>({
      component: FilterDemandValidationModalComponent,
      providers: [
        Stub.getMatDialogDataProvider({
          formGroup: new FormGroup({}),
          activeFilterFn: jest.fn().mockReturnValue(1),
        }),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleApplyFilter', () => {
    it('should call dialogRef.close with form values', () => {
      const mockFormValues = { productionLine: ['line1'] } as any;
      const spyClose = jest.spyOn(component['dialogRef'], 'close');
      jest
        .spyOn(component['data'].formGroup, 'getRawValue')
        .mockReturnValue(mockFormValues);
      jest.spyOn(component as any, 'close');

      component.handleApplyFilter();

      expect(component['data'].formGroup.getRawValue).toHaveBeenCalled();
      expect(spyClose).toHaveBeenCalledWith(mockFormValues);
      expect(component['close']).toHaveBeenCalledWith(mockFormValues);
    });
  });

  describe('handleReset', () => {
    it('should reset form and call close with reset values', () => {
      const resetValues = {
        productionLine: [],
        productLine: [],
        customerMaterialNumber: [],
        stochasticType: [],
        forecastMaintained: null,
      } as any;
      const spyReset = jest.spyOn(component['data'].formGroup, 'reset');
      jest
        .spyOn(component['data'].formGroup, 'getRawValue')
        .mockReturnValue(resetValues);
      jest.spyOn(component as any, 'close');

      component.handleReset();

      expect(spyReset).toHaveBeenCalledWith(resetValues);
      expect(component['close']).toHaveBeenCalledWith(resetValues);
    });
  });

  describe('close', () => {
    it('should close dialog with provided data', () => {
      const mockData = { productionLine: ['line1'] } as any;
      const spyClose = jest.spyOn(component['dialogRef'], 'close');

      component['close'](mockData);

      expect(spyClose).toHaveBeenCalledWith(mockData);
    });

    it('should close dialog with undefined when no data is provided', () => {
      const spyClose = jest.spyOn(component['dialogRef'], 'close');

      component['close']();

      expect(spyClose).toHaveBeenCalledWith(undefined);
    });
  });

  describe('initialization', () => {
    it('should initialize with form controls', () => {
      expect(component['searchProductionLine']).toBeDefined();
      expect(component['searchProductLine']).toBeDefined();
      expect(component['searchCustomerMaterial']).toBeDefined();
      expect(component['searchStochasticType']).toBeDefined();
    });
  });
});
