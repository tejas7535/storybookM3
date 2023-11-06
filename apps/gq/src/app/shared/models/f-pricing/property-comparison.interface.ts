import { PropertyValue } from './property-value.interface';

export interface PropertyComparison {
  key: string;
  // for each key there are exactly two propertyValues to compare
  values: PropertyValue[];
}
