import { Field, JsonTable, TableItem } from '../lib/models';

export const mockTableItemUnit = 'mock_unit';
export const mockTableItemValueString = 'mock_value';
export const mockTableItemValueNumber = 1_234_567.89;
export const mockTableItemFieldTitle: `${Field}` = Field.GREASE_GRADE;
export const mockTableItemFieldString: `${Field}` = 'add_req';
export const mockTableItemFieldNumber: `${Field}` = 'BaseOil';

export const rhoMock = 1;

export const tableItemTitleMock: TableItem = {
  value: undefined,
  unit: '',
  field: mockTableItemFieldTitle,
};

export const tableItemNumberMock: TableItem = {
  value: mockTableItemValueNumber,
  unit: mockTableItemUnit,
  field: mockTableItemFieldNumber,
};

export const tableItemStringMock: TableItem = {
  value: mockTableItemValueString,
  unit: undefined,
  field: mockTableItemFieldString,
};

export const jsonTableMock: JsonTable = {
  originalFields: [],
  fields: [],
  unitFields: [],
  items: [[tableItemTitleMock, tableItemNumberMock, tableItemStringMock]],
};
