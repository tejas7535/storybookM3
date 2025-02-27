import { Component, computed, input } from '@angular/core';

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
  public isMessageSectionExpanded = input<boolean>(false);
  public messages = input<ReportMessages>();
  public bearinxVersions = input<string | undefined>();

  public errors = computed(() => this.messages()?.errors ?? []);
  public warnings = computed(() => this.messages()?.warnings ?? []);
  public notes = computed(() => this.messages()?.notes ?? []);

  public shouldDisplayMessages = computed(
    () =>
      this.errors().length > 0 ||
      this.warnings().length > 0 ||
      this.notes().length > 0
  );
}
