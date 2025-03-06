import { Component, Input } from '@angular/core';

@Component({
  selector: 'gq-label-text',
  templateUrl: './label-text.component.html',
  standalone: false,
})
export class LabelTextComponent {
  @Input() marginBottom = true;
  @Input() modalVersion = false;
  @Input() modalFlexRow = false;
  @Input() tooltipText = '';
}
