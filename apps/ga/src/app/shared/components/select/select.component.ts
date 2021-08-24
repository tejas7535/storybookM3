import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ga-select',
  templateUrl: './select.component.html',
})
export class SelectComponent {
  @Input() public control: FormControl;
  @Input() public placeholder?: string;
  @Input() public hint?: string;
  @Input() public label?: string;
  @Input() public options: any[] = [];
}
