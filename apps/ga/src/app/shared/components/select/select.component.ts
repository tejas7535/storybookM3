import { Component, Input } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { DropdownOption } from '../../models';

@Component({
  selector: 'ga-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
  @Input() public control: UntypedFormControl;
  @Input() public placeholder?: string;
  @Input() public hint?: string;
  @Input() public label?: string;
  @Input() public options: DropdownOption[] = [];
  @Input() public tooltipText?: string;
  @Input() public noInfo? = false;
  @Input() public customErrors?: { name: string; message: string }[];
}
