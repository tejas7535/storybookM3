import { InjectionToken } from '@angular/core';

import { Observable } from 'rxjs';

export interface LegalOptions {
  personResponsible?: string;
  termsOfUse?: string;
}

export const PERSON_RESPONSIBLE = new InjectionToken<string>('');

export const TERMS_OF_USE = new InjectionToken<Observable<any>>('');
