import { FeatureChange, FeatureParams } from '../../models';
import { EmployeeAnalytics } from '../../models/employee-analytics.model';
import { doFeatureParamsMatchFeature } from '../selectors/attrition-analytics.selector.utils';

export function didFeaturesChange(
  featuresParams: FeatureParams[],
  currentSelected: EmployeeAnalytics[]
): FeatureChange {
  let didChange = true;
  if (featuresParams.length === currentSelected?.length) {
    didChange = featuresParams.some(
      (featureParams: FeatureParams) =>
        !currentSelected.some((currFeature) =>
          doFeatureParamsMatchFeature(featureParams, currFeature)
        )
    );
  }

  return { didChange, features: featuresParams };
}

export function sortFeaturesBasedOnParams(
  features: EmployeeAnalytics[],
  featuresParams: FeatureParams[]
): EmployeeAnalytics[] {
  return featuresParams.map((param) =>
    features.find((feature) => doFeatureParamsMatchFeature(param, feature))
  );
}
