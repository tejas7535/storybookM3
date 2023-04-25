import {
  MaterialTableItem,
  ValidationDescription,
} from '../../../app/shared/models/table';

export const MATERIAL_TABLE_ITEM_MOCK: MaterialTableItem = {
  id: 1,
  materialDescription: 'matDesc',
  materialNumber: 'matNumber',
  quantity: 1,
  targetPrice: 10,
  info: {
    valid: true,
    description: [ValidationDescription.Valid],
  },
};
