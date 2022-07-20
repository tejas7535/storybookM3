import { Component } from '@angular/core';

import { Locale } from '@schaeffler/transloco/components';

import { environment } from '../../../../environments/environment';
import { serivceNowAdress } from '../../constants';

@Component({
  selector: 'gq-user-settings',
  templateUrl: './user-settings.component.html',
})
export class UserSettingsComponent {
  production = environment.production;
  serivceNowAdress = serivceNowAdress;
  availableLocales: Locale[] = [
    {
      id: 'de-DE',
      label: 'Deutsch (Deutschland)',
    },
    {
      id: 'en-US',
      label: 'English (United States)',
    },
  ];
  defaultLocale: Locale = this.availableLocales[0];
}
