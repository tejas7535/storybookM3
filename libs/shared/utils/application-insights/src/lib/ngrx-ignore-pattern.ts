import { InjectionToken } from '@angular/core';

export const NGRX_IGNORE_PATTERN = new InjectionToken<string[]>(
  'NgrxIgnorePattern'
);
