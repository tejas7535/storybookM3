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
  rating?: {
    id: number;
    code: string;
    barDiameter: string;
    squareDiameter: string;
    remark: string;
    kind: {
      id: number;
      name: string;
      code: string;
    };
  };
  steelMakingProcess: string;
  releaseDateYear: number;
  releaseDateMonth: number;
  releaseRestrictions: string;
  esr: boolean;
  var: boolean;
  export: boolean;
}
