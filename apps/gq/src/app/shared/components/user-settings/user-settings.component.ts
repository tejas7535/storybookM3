import { Component } from '@angular/core';

import { Locale } from '@schaeffler/transloco/components';

import { AVAILABLE_LOCALES, serivceNowAdress } from '../../constants';

@Component({
  selector: 'gq-user-settings',
  templateUrl: './user-settings.component.html',
})
export class UserSettingsComponent {
  serivceNowAdress = serivceNowAdress;
  availableLocales: Locale[] = AVAILABLE_LOCALES;
  defaultLocale: Locale = AVAILABLE_LOCALES[0];
}
