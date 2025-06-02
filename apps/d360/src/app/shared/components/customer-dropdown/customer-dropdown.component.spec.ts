import { FormControl, FormGroup } from '@angular/forms';

import { Stub } from '../../test/stub.class';
import { SingleAutocompleteSelectedEvent } from '../inputs/autocomplete/model';
import { CustomerDropDownComponent } from './customer-dropdown.component';

describe('CustomerDropDownComponent', () => {
  let component: CustomerDropDownComponent;
  let control: FormControl;
  let form: FormGroup;

  beforeEach(() => {
    control = new FormControl();
    form = new FormGroup({});

    component = Stub.getForEffect<CustomerDropDownComponent>({
      component: CustomerDropDownComponent,
    });

    Stub.setInputs([
      { property: 'control', value: control },
      { property: 'form', value: form },
      { property: 'disabled', value: false },
    ]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {
    it('should disable control when disabled input is true', () => {
      Stub.setInput('disabled', true);

      Stub.detectChanges();

      expect(control.disabled).toBe(true);
    });

    it('should enable control when disabled input is false', () => {
      control.disable();
      Stub.setInput('disabled', false);
      Stub.detectChanges();

      expect(control.enabled).toBe(true);
    });
  });

  describe('onChange', () => {
    it('should emit selectionChange event when onChange is called', () => {
      const event: SingleAutocompleteSelectedEvent = {
        item: { id: '1', name: 'Test Customer' },
      } as any;
      jest.spyOn(component.selectionChange, 'emit');
      component['onChange'](event);
      expect(component.selectionChange.emit).toHaveBeenCalledWith(event);
    });
  });
});
