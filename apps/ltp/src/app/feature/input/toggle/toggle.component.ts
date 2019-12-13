import { Component, Input } from '@angular/core';

import { ToggleControl } from './toggle.model';

@Component({
  selector: 'ltp-toggle',
  templateUrl: './toggle.component.html'
})
export class ToggleComponent {
  @Input() control: ToggleControl;
}
