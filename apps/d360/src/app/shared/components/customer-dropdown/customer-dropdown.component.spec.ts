import { FormControl, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { CustomerDropDownComponent } from './customer-dropdown.component';

describe('CustomerDropDownComponent', () => {
  let component: CustomerDropDownComponent;
  let spectator: Spectator<CustomerDropDownComponent>;

  const createComponent = createComponentFactory({
    component: CustomerDropDownComponent,
    imports: [MatInputModule, MatSelectModule],
  });

  beforeEach(async () => {
    spectator = createComponent({
      props: {
        customers: [],
        fC: new FormControl(),
        fG: new FormGroup({}),
      },
    });
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
