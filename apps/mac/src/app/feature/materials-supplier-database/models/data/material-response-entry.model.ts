export interface MaterialResponseEntry {
  id: number;
  manufacturerSupplier: {
    id: number;
    name: string;
    plant: string;
    kind: number;
    materials?: any[];
  };
  materialStandard: {
    id: number;
    materialName: string;
    standardDocument: string;
    materials?: any[];
  };
  isPrematerial: boolean;
  materialCategory: string;
  materialClass: {
    id: number;
    name: string;
    code: string;
  };
  shape: {
    id: number;
    name: string;
    code: string;
    materials?: any[];
  };
  castingMode: string;
  castingDiameter: string;
  minDimension: number;
  maxDimension: number;
  co2PerTon: number;
  rating: string;
  steelMakingProcess: string;
  releaseDateYear: number;
  releaseDateMonth: number;
  releaseRestrictions: string;
  esr: number;
  var: number;
  export: boolean;
}
