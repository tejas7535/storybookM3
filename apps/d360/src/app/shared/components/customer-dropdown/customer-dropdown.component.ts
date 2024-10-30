import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CustomerEntry } from '../../../feature/global-selection/model';

@Component({
  selector: 'app-customer-drop-down',
  standalone: true,
  imports: [
    MatInputModule,
    MatSelectModule,
    SharedTranslocoModule,
    ReactiveFormsModule,
  ],
  templateUrl: './customer-dropdown.component.html',
  styleUrls: ['./customer-dropdown.component.scss'],
})
export class CustomerDropDownComponent {
  @Input() customers: CustomerEntry[] = [];
  @Input({ required: true }) fC: FormControl<CustomerEntry>;
  @Input({ required: true }) fG: FormGroup;
}
