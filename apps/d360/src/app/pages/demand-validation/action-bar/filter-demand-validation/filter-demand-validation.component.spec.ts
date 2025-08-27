import { of, take } from 'rxjs';

import { Stub } from '../../../../shared/test/stub.class';
import { FilterDemandValidationComponent } from './filter-demand-validation.component';

describe('FilterDemandValidationComponent', () => {
  let component: FilterDemandValidationComponent;

  beforeEach(() => {
    component = Stub.getForEffect<FilterDemandValidationComponent>({
      component: FilterDemandValidationComponent,
      providers: [Stub.getMatDialogProvider()],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    it('should initialize form with empty arrays by default', () => {
      expect(component['formGroup'].value).toEqual({
        productionLine: [],
        productLine: [],
        customerMaterialNumber: [],
        stochasticType: [],
        forecastMaintained: null,
      });
    });

    it('should initialize form with provided initial values', () => {
      const initialFilter = {
        productionLine: ['Line1', 'Line2'],
        productLine: ['Product1'],
        customerMaterialNumber: ['M123'],
        stochasticType: ['Type1'],
        forecastMaintained: {},
      };

      Stub.setInput('initial', initialFilter);
      Stub.detectChanges();

      expect(component['formGroup'].value).toEqual(initialFilter);
    });
  });

  describe('openDemandValidationFilterModal', () => {
    it('should open dialog with correct configuration', () => {
      const dialogSpy = jest
        .spyOn(component['dialog'], 'open')
        .mockReturnValue({
          afterClosed: () => ({ pipe: () => ({ subscribe: () => {} }) }),
        } as any);

      component['openDemandValidationFilterModal']();

      expect(dialogSpy).toHaveBeenCalledWith(
        expect.any(Function), // The component
        {
          data: {
            formGroup: component['formGroup'],
            activeFilterFn: expect.any(Function),
          },
          disableClose: true,
          width: '500px',
          autoFocus: false,
        }
      );
    });

    it('should emit filter values when dialog is closed with values', () => {
      const testFilter = {
        productionLine: ['Line1'],
        productLine: ['Product1'],
        customerMaterialNumber: ['M123'],
        stochasticType: ['Type1'],
      };

      jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: () => of(testFilter).pipe(take(1)),
      } as any);

      const emitSpy = jest.spyOn(
        component.demandValidationFilterChange,
        'emit'
      );

      component['openDemandValidationFilterModal']();

      expect(emitSpy).toHaveBeenCalledWith(testFilter);
    });

    it('should not emit when dialog is closed without values', () => {
      jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: () => of(null).pipe(take(1)),
      } as any);

      const emitSpy = jest.spyOn(
        component.demandValidationFilterChange,
        'emit'
      );

      component['openDemandValidationFilterModal']();

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('getCount', () => {
    it('should correctly count the number of selected filters', () => {
      const formGroup = component['formGroup'];
      formGroup.setValue({
        productionLine: ['Line1', 'Line2'],
        productLine: ['Product1'],
        customerMaterialNumber: [],
        stochasticType: ['Type1', 'Type2', 'Type3'],
        forecastMaintained: {
          id: 'true',
          text: 'True',
        },
      });

      const count = component['getCount'](formGroup);

      expect(count).toBe(7); // 2 + 1 + 0 + 3 + 1
    });

    it('should return 0 when no filters are selected', () => {
      const formGroup = component['formGroup'];
      formGroup.setValue({
        productionLine: [],
        productLine: [],
        customerMaterialNumber: [],
        stochasticType: [],
        forecastMaintained: null,
      });

      const count = component['getCount'](formGroup);

      expect(count).toBe(0);
    });
  });

  describe('disabled input', () => {
    it('should default to false', () => {
      expect(component.disabled()).toBe(false);
    });
  });
});
