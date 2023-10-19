import { Component, Input } from '@angular/core';

@Component({
  selector: 'gq-tabs-label',
  templateUrl: './tabs-label.component.html',
})
export class TabsLabelComponent {
  @Input() icon: string;
  @Input() iconColor: string;
  @Input() value: string;
  @Input() title: string;
  @Input() isOperator = false;
  @Input() operatorText: string;
}
