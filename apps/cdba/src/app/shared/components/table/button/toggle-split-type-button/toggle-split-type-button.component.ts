import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CostComponentSplitType } from '@cdba/shared/models';

@Component({
  selector: 'cdba-toggle-split-type-button',
  templateUrl: './toggle-split-type-button.component.html',
})
export class ToggleSplitTypeButtonComponent {
  @Input() currentSplitType: CostComponentSplitType;
  @Output() toggleSplitType = new EventEmitter<void>();

  agInit(): void {}
}
