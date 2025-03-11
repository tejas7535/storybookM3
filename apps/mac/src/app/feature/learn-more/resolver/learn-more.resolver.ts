import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { RoutePath } from '../../../app-routing.enum';
import {
  aqmCalculatorLearnMoreData,
  cctCalculatorLearnMoreData,
  insulationSolutionsLearnMoreData,
  materialPropertiesEstimatorLearnMoreData,
  materialsGpt,
  materialSupplierDbLearnMoreData,
} from '../config/';
import { substanceInformationSystemLearnMoreData } from '../config/substance-information-system';
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
      case RoutePath.MaterialsGPT: {
        return materialsGpt;
      }
      case RoutePath.AQMCalculatorPath: {
        return aqmCalculatorLearnMoreData;
      }
      case RoutePath.InsulationSolutionsPath: {
        return insulationSolutionsLearnMoreData;
      }
      case RoutePath.MaterialPropertiesEstimator: {
        return materialPropertiesEstimatorLearnMoreData;
      }
      case RoutePath.MaterialsSupplierDatabasePath: {
        return materialSupplierDbLearnMoreData;
      }
      case RoutePath.CCTCalculatorPath: {
        return cctCalculatorLearnMoreData;
      }
      case RoutePath.SubstanceInformationSystemPath: {
        return substanceInformationSystemLearnMoreData;
      }
      default: {
        this.router.navigate(['/notfound']);
      }
    }

    return undefined;
  }
}
