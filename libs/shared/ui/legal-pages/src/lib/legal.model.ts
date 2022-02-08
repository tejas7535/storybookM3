import { InjectionToken } from '@angular/core';

export interface LegalOptions {
  personResponsible?: string;
  termsOfUse?: string;
}

export const PERSON_RESPONSIBLE = new InjectionToken<string>('');

export const TERMS_OF_USE = new InjectionToken<string>('');
