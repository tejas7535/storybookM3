import { Component } from '@angular/core';

import { environment } from '@ga/environments/environment';
import {
  AVAILABLE_LOCALES,
  DEFAULT_LOCALE,
} from '@ga/shared/constants/localization';

@Component({
  selector: 'ga-user-settings',
  templateUrl: './user-settings.component.html',
})
export class UserSettingsComponent {
  public availableLocales = AVAILABLE_LOCALES;
  public defaultLocale = DEFAULT_LOCALE;
  public isProduction = environment.production; // TODO: remove once Bearinx 2022.1 is released
}
