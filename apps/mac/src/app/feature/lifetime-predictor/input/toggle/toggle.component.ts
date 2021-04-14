import { Component, Input } from '@angular/core';

import { ToggleControl } from './toggle.model';

@Component({
  selector: 'mac-ltp-toggle',
  templateUrl: './toggle.component.html',
})
export class ToggleComponent {
  @Input() control: ToggleControl;
}
