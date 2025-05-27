export enum MaterialClass {
  STEEL = 'st',
  ALUMINUM = 'al',
  POLYMER = 'px',
  COPPER = 'cu',
  CERAMIC = 'ce',
  LUBRICANTS = 'lu',

  SAP_MATERIAL = 'sap',
  VITESCO = 'vitesco',
  DS_ESTIMATIONMATRIX = 'estimationmatrix',
}

export const SupportedMaterialClasses = Object.values(MaterialClass).filter(
  (c) => c !== MaterialClass.VITESCO
) as MaterialClass[];
