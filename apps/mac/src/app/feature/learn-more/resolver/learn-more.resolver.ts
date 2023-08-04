import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { RoutePath } from '../../../app-routing.enum';
import {
  aqmCalculatorLearnMoreData,
  hardnessConverterLearnMoreData,
  insulationSolutionsLearnMoreData,
  materialPropertiesEstimatorLearnMoreData,
  materialSupplierDbLearnMoreData,
} from '../config/';
import { LearnMoreData } from '../models';

@Injectable({
  providedIn: 'root',
})
export class LearnMoreResolver {
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
        return aqmCalculatorLearnMoreData;
      case RoutePath.InsulationSolutionsPath:
        return insulationSolutionsLearnMoreData;
      case RoutePath.MaterialPropertiesEstimator:
        return materialPropertiesEstimatorLearnMoreData;
      case RoutePath.MaterialsSupplierDatabasePath:
        return materialSupplierDbLearnMoreData;
      default:
        this.router.navigate(['/notfound']);
    }

    return undefined;
  }
}
