import { MaterialTableItem, ValidationDescription } from '../../../models';

export const dummyRowData: MaterialTableItem = {
  materialNumber: '0167187...',
  quantity: 123,
  info: { valid: false, description: [ValidationDescription.Dummy] },
};

export const isDummyData = (data: MaterialTableItem): boolean => {
  return (
    data.materialNumber === dummyRowData.materialNumber &&
    data.quantity === dummyRowData.quantity
  );
};
