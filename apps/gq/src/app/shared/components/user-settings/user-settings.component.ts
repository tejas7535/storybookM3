import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';

import {
  LanguageSelectModule,
  Locale,
  LocaleSelectModule,
} from '@schaeffler/transloco/components';

import { AVAILABLE_LOCALES, serivceNowAdress } from '../../constants';
import { RolesRightsModule } from './roles-rights/roles-rights.module';

@Component({
  standalone: true,
  selector: 'gq-user-settings',
  templateUrl: './user-settings.component.html',
  imports: [
    CommonModule,
    RolesRightsModule,
    TranslocoModule,
    LanguageSelectModule,
    LocaleSelectModule,
  ],
  providers: [provideTranslocoScope('user-settings')],
})
export class UserSettingsComponent {
  serivceNowAdress = serivceNowAdress;
  availableLocales: Locale[] = AVAILABLE_LOCALES;
  defaultLocale: Locale = AVAILABLE_LOCALES[0];
}
