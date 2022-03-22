import { BomItemClassic } from './bom-item-classic.model';
import { BomItemOdata } from './bom-item-odata.model';

export interface BomItem
  extends Partial<BomItemClassic>,
    Partial<BomItemOdata> {}
