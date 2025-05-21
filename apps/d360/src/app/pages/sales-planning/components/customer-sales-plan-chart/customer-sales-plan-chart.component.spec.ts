import { Stub } from '../../../../shared/test/stub.class';
import { CustomerSalesPlanChartComponent } from './customer-sales-plan-chart.component';

describe('CustomerSalesPlanChartComponent', () => {
  let component: CustomerSalesPlanChartComponent;

  beforeEach(() => {
    component = Stub.getForEffect<CustomerSalesPlanChartComponent>({
      component: CustomerSalesPlanChartComponent,
    });
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('globalSelectionState', () => {
    it('should return customer data in selection state when both customerName and customerNumber are available', () => {
      // Set up the input with valid customer information
      Stub.setInput('customer', {
        customerName: 'Test Customer',
        customerNumber: '12345',
      });

      // Access the computed signal value
      const result = component['globalSelectionState']();

      // Check that the result has the expected structure
      expect(result.customerNumber).toHaveLength(1);
      expect(result.customerNumber[0]).toEqual({
        id: '12345',
        text: 'Test Customer',
      });

      // Check that all other fields are empty arrays (from EMPTY_GLOBAL_SELECTION_STATE)
      expect(result.alertType).toEqual([]);
      expect(result.materialNumber).toEqual([]);
      // We don't need to check all fields, just confirming the structure is correct
    });

    it('should return empty selection state when customerName is missing', () => {
      // Set up the input with missing customerName
      Stub.setInput('customer', {
        customerName: null,
        customerNumber: '12345',
      });

      // Access the computed signal value
      const result = component['globalSelectionState']();

      // Check that the result is the empty selection state
      expect(result.customerNumber).toEqual([]);
      expect(result.alertType).toEqual([]);
    });

    it('should return empty selection state when customerNumber is missing', () => {
      // Set up the input with missing customerNumber
      Stub.setInput('customer', {
        customerName: 'Test Customer',
        customerNumber: null,
      });

      // Access the computed signal value
      const result = component['globalSelectionState']();

      // Check that the result is the empty selection state
      expect(result.customerNumber).toEqual([]);
      expect(result.alertType).toEqual([]);
    });

    it('should return empty selection state when both customerName and customerNumber are missing', () => {
      // Set up the input with both values missing
      Stub.setInput('customer', {
        customerName: null,
        customerNumber: null,
      });

      // Access the computed signal value
      const result = component['globalSelectionState']();

      // Check that the result is the empty selection state
      expect(result.customerNumber).toEqual([]);
      expect(result.alertType).toEqual([]);
    });
  });
});
