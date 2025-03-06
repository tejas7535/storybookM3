import { Component } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';
import { LanguageSelectModule } from '@schaeffler/transloco/components';

@Component({
  selector: 'hc-settings-panel',
  imports: [LanguageSelectModule, SharedTranslocoModule],
  templateUrl: './settings-panel.component.html',
})
export class SettingsPanelComponent {}
