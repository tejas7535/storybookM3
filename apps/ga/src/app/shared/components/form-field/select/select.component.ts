import { Component, Input } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { SubscriptSizing } from '@angular/material/form-field';

import { DropdownOption } from '@ga/shared/models';

@Component({
  selector: 'ga-select',
  templateUrl: './select.component.html',
})
export class SelectComponent {
  @Input() public control: UntypedFormControl;
  @Input() public placeholder?: string;
  @Input() public hint?: string;
  @Input() public label?: string;
  @Input() public options: DropdownOption[] = [];
  @Input() public tooltipText?: string;
  @Input() public customErrors?: { name: string; message: string }[];
  @Input() public subscriptSizing: SubscriptSizing = 'fixed';
  @Input() public translateText = true;
}
