export enum MaterialClass {
  STEEL = 'st',
  ALUMINUM = 'al',
  POLYMER = 'px',
  COPPER = 'cu',
  CERAMIC = 'ce',
  LUBRICANTS = 'lu',

  SAP_MATERIAL = 'sap',
  DS_VITESCO = 'vitesco',
  DS_ESTIMATIONMATRIX = 'estimationmatrix',
}

export const SupportedMaterialClasses = Object.values(
  MaterialClass
) as MaterialClass[];
