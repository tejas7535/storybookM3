import { InjectionToken } from '@angular/core';

import { Observable } from 'rxjs';

export interface LegalOptions {
  personResponsible?: string;
  termsOfUse?: string;
  purpose?: string;
}

export const PERSON_RESPONSIBLE = new InjectionToken<string>('');

export const TERMS_OF_USE = new InjectionToken<Observable<any>>('');

export const PURPOSE = new InjectionToken<Observable<any>>('');

export const CUSTOM_DATA_PRIVACY = new InjectionToken<Observable<string>>('');

export const RESPONSIBLE_DEFAULT = 'Schaeffler Technologies AG & Co. KG';
