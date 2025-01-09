export interface PreflightData {
  innerRingExpansion: string;
  radialClearanceReduction: string;
  shaftDiameter: string;
  shaftMaterial: string;
  modulusOfElasticity: string;
  poissonRatio: string;
  hudraulicNutType: {
    value: string;
    options: {
      label: string;
      value: string;
    }[];
  };
  numberOfPreviousMountings: string;
  mountingOption: string;
}
