import { Component } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';
import {
  LanguageSelectModule,
  LocaleSelectModule,
} from '@schaeffler/transloco/components';

import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from '../constants/language';

@Component({
  selector: 'ea-settings-panel',
  imports: [LanguageSelectModule, LocaleSelectModule, SharedTranslocoModule],
  templateUrl: './settings-panel.component.html',
})
export class SettingsPanelComponent {
  public availableLocales = AVAILABLE_LOCALES;
  public defaultLocale = DEFAULT_LOCALE;
}
