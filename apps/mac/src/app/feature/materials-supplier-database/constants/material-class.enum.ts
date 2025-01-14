export enum MaterialClass {
  STEEL = 'st',
  ALUMINUM = 'al',
  POLYMER = 'px',
  COPPER = 'cu',
  CERAMIC = 'ce',
  LUBRICANTS = 'lu',

  SAP_MATERIAL = 'sap',
  VITESCO = 'vitesco',
}

export const SupportedMaterialClasses = Object.values(MaterialClass);
