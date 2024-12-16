export enum API {
  v1 = 'api/v1',
  v2 = 'api/v2',
}

export enum ProductDetailPath {
  Detail = 'details',
  Drawings = 'drawings',
  Calculations = 'calculations',
  Bom = 'bom',
  CostComponentSplit = 'cost-component-split',
}

export const BomExportPath = 'bom/export';
export const BomExportStatusPath = `${BomExportPath}/status`;
export const BomExportStatusLivePath = `${BomExportStatusPath}/live`;
