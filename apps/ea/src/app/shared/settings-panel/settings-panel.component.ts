import { Component } from '@angular/core';

import {
  LanguageSelectModule,
  LocaleSelectModule,
} from '@schaeffler/transloco/components';

import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from '../constants/language';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'ea-settings-panel',
  standalone: true,
  imports: [LanguageSelectModule, LocaleSelectModule, SharedTranslocoModule],
  templateUrl: './settings-panel.component.html',
})
export class SettingsPanelComponent {
  public availableLocales = AVAILABLE_LOCALES;
  public defaultLocale = DEFAULT_LOCALE;
}
