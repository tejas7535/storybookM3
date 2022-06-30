import { FeatureParams } from '../../models';
import { EmployeeAnalytics } from '../../models/employee-analytics.model';
import { doFeatureParamsMatchFeature } from '../selectors/attrition-analytics.selector.utils';

export function sortFeaturesBasedOnParams(
  features: EmployeeAnalytics[],
  featuresParams: FeatureParams[]
): EmployeeAnalytics[] {
  return featuresParams.map((param) =>
    features.find((feature) => doFeatureParamsMatchFeature(param, feature))
  );
}
