export interface PredictionRequest {
  prediction?: number;
  mpa: number;
  v90: number;
  hv: number;
  rrelation: number;
  burdeningType: number;
  spreading: number;
  rArea: number;
  es: number;
  rz: number;
  hv_core: number;
  hv_lower?: number; // only present once altered
  hv_upper?: number; // only present once altered
  model?: number; // these are not optional once the input fields are active
  a90?: number;
  gradient?: number;
  multiaxiality?: number;
}
