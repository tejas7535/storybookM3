import { Stub } from './../../../../shared/test/stub.class';
import { DemandValidationSettingModalComponent } from './demand-validation-setting-modal.component';

describe('DemandValidationSettingModalComponent', () => {
  let component: DemandValidationSettingModalComponent;

  beforeEach(() => {
    component = Stub.getForEffect({
      component: DemandValidationSettingModalComponent,
      providers: [Stub.getMatDialogDataProvider({})],
    });

    Stub.setInput('data', {
      planningView: 'demandValidation',
      close: () => {},
      selectionChange: () => {},
    });
    Stub.setInput('close', () => {});
    Stub.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct data input', () => {
    expect(component.data()).toBeDefined();
    expect(component.close()).toBeDefined();
  });

  it('should emit selectionChange when handleSettingsChange is called', () => {
    const spy = jest.spyOn(component.selectionChange, 'emit');
    const mockEvent = { value: 'salesPlanning' } as any;

    component['handleSettingsChange'](mockEvent);

    expect(spy).toHaveBeenCalledWith('salesPlanning');
  });

  it('should handle different planning view options', () => {
    const spy = jest.spyOn(component.selectionChange, 'emit');

    // Test with 'demandValidation'
    component['handleSettingsChange']({ value: 'demandValidation' } as any);
    expect(spy).toHaveBeenCalledWith('demandValidation');

    // Test with 'salesPlanning'
    component['handleSettingsChange']({ value: 'salesPlanning' } as any);
    expect(spy).toHaveBeenCalledWith('salesPlanning');
  });

  it('should expose PlanningView enum to the template', () => {
    expect(component['PlanningView']).toBeDefined();
  });
});
