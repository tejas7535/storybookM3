import { Stub } from '../../../../../../../shared/test/stub.class';
import { SalesPlanningEditButtonComponent } from './sales-planning-edit-button.component';

describe('SalesPlanningEditButtonComponent', () => {
  let component: SalesPlanningEditButtonComponent;

  beforeEach(() => {
    component = Stub.getForEffect({
      component: SalesPlanningEditButtonComponent,
      providers: [Stub.getAuthServiceProvider()],
    });
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show the edit button for editStatus 1', () => {
    Stub.setInput('editStatus', '1');
    expect(component['showEditButton']()).toBe(true);
    expect(component['disableEditButton']()).toBe(false);
    expect(component['tooltipText']()).toBe(
      'sales_planning.table.editSalesPlanAllowed'
    );
  });

  it('should hide the button for editStatus 2', () => {
    Stub.setInput('editStatus', '2');
    expect(component['showEditButton']()).toBe(false);
    expect(component['tooltipText']()).toBeNull();
  });

  it('should show a disabled button and a tooltip for editStatus 3', () => {
    Stub.setInput('editStatus', '3');
    expect(component['showEditButton']()).toBe(true);
    expect(component['disableEditButton']()).toBe(true);
    expect(component['tooltipText']()).toBe(
      'sales_planning.table.planExistsOnOtherLevel'
    );
  });

  it('should show a disabled button and a tooltip for editStatus 4', () => {
    Stub.setInput('editStatus', '4');
    expect(component['showEditButton']()).toBe(true);
    expect(component['disableEditButton']()).toBe(true);
    expect(component['tooltipText']()).toBe(
      'sales_planning.table.planOnlyInPlanningCurrency'
    );
  });

  it('should show a disabled button and a tooltip for editStatus 5', () => {
    Stub.setInput('editStatus', '5');
    expect(component['showEditButton']()).toBe(true);
    expect(component['disableEditButton']()).toBe(true);
    expect(component['tooltipText']()).toBe(
      'sales_planning.table.noMaterialsToDistributePlan'
    );
  });

  it('should show a disabled button and a tooltip for editStatus 6', () => {
    Stub.setInput('editStatus', '6');
    expect(component['showEditButton']()).toBe(true);
    expect(component['disableEditButton']()).toBe(true);
    expect(component['tooltipText']()).toBe(
      'sales_planning.table.planInvalidOnlyDelete'
    );
  });

  it('should show a disabled button and a tooltip for editStatus 7', () => {
    Stub.setInput('editStatus', '7');
    expect(component['showEditButton']()).toBe(true);
    expect(component['disableEditButton']()).toBe(true);
    expect(component['tooltipText']()).toBe(
      'sales_planning.table.noMaintenanceInThePastAllowed'
    );
  });

  it('should hide the button for an empty editStatus', () => {
    Stub.setInput('editStatus', '');
    expect(component['showEditButton']()).toBe(false);
    expect(component['tooltipText']()).toBeNull();
  });

  it('should hide the button for an unknown editStatus', () => {
    Stub.setInput('editStatus', '999');
    expect(component['showEditButton']()).toBe(false);
    expect(component['tooltipText']()).toBeNull();
  });

  it('should show the button when the user has edit rights', (done) => {
    component['isUserAllowedToEdit$'].subscribe((isUserAllowedToEdit) => {
      expect(isUserAllowedToEdit).toBe(true);
      done();
    });
  });
});
