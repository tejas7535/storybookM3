export enum MaterialClass {
  STEEL = 'st',
  ALUMINUM = 'al',
  POLYMER = 'px',
  COPPER = 'cu',
  CERAMIC = 'ce',
  // TODO remove hardmagnet implementation if no longer needed
  HARDMAGNET = 'hm',

  SAP_MATERIAL = 'sap',
}

export const SupportedMaterialClasses = Object.values(MaterialClass).filter(
  (c) => c !== MaterialClass.HARDMAGNET
);
