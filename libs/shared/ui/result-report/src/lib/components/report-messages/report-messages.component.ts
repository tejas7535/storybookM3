import { Component, Input } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationResultMessagesComponent } from '../calculation-result-messages/calculation-result-messages.component';
import { ReportExpansionPanelComponent } from '../report-expansion-panel/report-expansion-panel.component';
import { ReportMessages } from './report-messages.component.interface';

@Component({
  selector: 'schaeffler-report-messages',
  templateUrl: './report-messages.component.html',
  standalone: true,
  imports: [
    ReportExpansionPanelComponent,
    CalculationResultMessagesComponent,
    SharedTranslocoModule,
  ],
})
export class ReportMessagesComponent {
  @Input()
  public messages: ReportMessages = {
    notes: [],
    errors: [],
    warnings: [],
  };

  @Input() public isMessageSectionExpanded = false;
}
