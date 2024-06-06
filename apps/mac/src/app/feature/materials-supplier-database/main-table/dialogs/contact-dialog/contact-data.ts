import { MaterialClass } from '../../../constants';

export interface ContactData {
  section: string;
  name: string;
  email?: string;
}
export const contacts: ContactData[] = [
  {
    section: MaterialClass.STEEL,
    name: `${MaterialClass.STEEL}1`,
    email: `${MaterialClass.STEEL}1`,
  },
  {
    section: MaterialClass.STEEL,
    name: `${MaterialClass.STEEL}2`,
    email: `${MaterialClass.STEEL}2`,
  },
  {
    section: MaterialClass.ALUMINUM,
    name: MaterialClass.ALUMINUM,
    email: MaterialClass.ALUMINUM,
  },
  {
    section: MaterialClass.POLYMER,
    name: MaterialClass.POLYMER,
    email: MaterialClass.POLYMER,
  },
  {
    section: MaterialClass.COPPER,
    name: MaterialClass.COPPER,
    email: MaterialClass.COPPER,
  },
  {
    section: MaterialClass.CERAMIC,
    name: MaterialClass.CERAMIC,
    email: MaterialClass.CERAMIC,
  },
  {
    section: MaterialClass.LUBRICANTS,
    name: MaterialClass.LUBRICANTS,
    email: MaterialClass.LUBRICANTS,
  },
  {
    section: MaterialClass.SAP_MATERIAL,
    name: MaterialClass.SAP_MATERIAL,
  },
];
