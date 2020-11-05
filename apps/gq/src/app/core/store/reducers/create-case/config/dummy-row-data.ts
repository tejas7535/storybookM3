import { CaseTableItem } from '../../../models';

export const dummyRowData: CaseTableItem = {
  materialNumber: '0167187...',
  quantity: '123...',
  info: false,
};

export const isDummyData = (data: CaseTableItem): boolean => {
  return (
    data.materialNumber === dummyRowData.materialNumber &&
    data.quantity === dummyRowData.quantity
  );
};
