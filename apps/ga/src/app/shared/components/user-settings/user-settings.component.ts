import { Component } from '@angular/core';

import {
  AVAILABLE_LOCALES,
  DEFAULT_LOCALE,
} from '@cdba/shared/constants/index';

@Component({
  selector: 'ga-user-settings',
  templateUrl: './user-settings.component.html',
})
export class UserSettingsComponent {
  availableLocales = AVAILABLE_LOCALES;
  defaultLocale = DEFAULT_LOCALE;
}
