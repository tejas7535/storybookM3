import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ga-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  @Input() public control: FormControl;
  @Input() public placeholder?: string;
  @Input() public hint?: string;
  @Input() public label?: string;
  @Input() public unit?: string;
  @Input() public tooltipText?: string = 'test';
  @Input() public customErrors?: { name: string; message: string }[];
}
