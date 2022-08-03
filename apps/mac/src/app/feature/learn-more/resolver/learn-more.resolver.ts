import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { RoutePath } from '../../../app-routing.enum';
import { hardnessConverterLearnMoreData } from '../config/hardness-converter';
import { LearnMoreData } from '../models';

@Injectable({
  providedIn: 'root',
})
export class LearnMoreResolver implements Resolve<LearnMoreData> {
  constructor(private readonly router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): LearnMoreData {
    const id = route.paramMap.get('id');
    switch (id) {
      case RoutePath.HardnessConverterPath:
        return hardnessConverterLearnMoreData;
      case RoutePath.AQMCalculatorPath:
        return undefined;
      case RoutePath.LifetimePredictorPath:
        return undefined;
      case RoutePath.MaterialsSupplierDatabasePath:
        return undefined;
      default:
        this.router.navigate(['/notfound']);
    }

    return undefined;
  }
}
