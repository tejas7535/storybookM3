import { InjectionToken } from '@angular/core';

export interface LegalOptions {
  personResponsible?: string;
}

export const PERSON_RESPONSIBLE = new InjectionToken<string>('');
