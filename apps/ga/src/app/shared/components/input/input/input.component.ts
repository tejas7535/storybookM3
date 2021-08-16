import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ga-input',
  templateUrl: './input.component.html',
})
export class InputComponent {
  @Input() public type = 'text';
  @Input() public control: FormControl;
  @Input() public placeholder?: string;
  @Input() public hint?: string;
  @Input() public label?: string;
  @Input() public unit?: string;
}
