import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { map, take } from 'rxjs/operators';

import { AppRoutePath } from '@ga/app-route-path.enum';

import { CalculationParametersFacade } from '../store';

/**
 * Guards routes requiring a selected competitor grease
 * Redirects to base path if no grease is selected
 */
export const selectedCompetitorGreaseGuard: CanActivateFn = () => {
  const calculationParametersFacade = inject(CalculationParametersFacade);
  const router = inject(Router);

  return calculationParametersFacade.selectedCompetitorGrease$.pipe(
    take(1),
    map((grease) => {
      if (grease) {
        return true;
      }
      router.navigate([AppRoutePath.BasePath]);

      return false;
    })
  );
};
