import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

interface Option {
  id: string;
  description: string;
}

@Component({
  selector: 'cdba-multi-select-filter',
  templateUrl: './multi-select-filter.component.html',
})
export class MultiSelectFilterComponent {
  @Input() label: string;
  @Input() options: Option[];

  form = new FormControl();
}
