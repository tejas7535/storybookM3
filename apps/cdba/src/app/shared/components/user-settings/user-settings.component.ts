import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from '@cdba/shared/constants';

@Component({
  selector: 'cdba-user-settings',
  templateUrl: './user-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsComponent {
  availableLocales = AVAILABLE_LOCALES;
  defaultLocale = DEFAULT_LOCALE;
}
