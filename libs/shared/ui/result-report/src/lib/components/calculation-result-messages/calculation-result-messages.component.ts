import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'schaeffler-calculation-result-messages',
  templateUrl: './calculation-result-messages.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculationResultMessagesComponent {
  @Input()
  public title = '';
  @Input() public messages: string[] = [];
}
