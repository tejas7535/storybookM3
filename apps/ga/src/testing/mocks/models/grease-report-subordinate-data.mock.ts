import {
  GreaseReportSubordinateDataItem,
  SubordinateDataItemField,
} from '@ga/features/grease-calculation/calculation-result/models';

export const dataItemUnitMock = 'mock_unit';
export const dataItemValueStringMock = 'mock_value';
export const dataItemValueNumberMock = 1_234_567.89;
export const dataItemFieldStringMock: `${SubordinateDataItemField}` = 'add_req';
export const dataItemFieldNumberMock: `${SubordinateDataItemField}` = 'BaseOil';

export const rhoMock = 1;

export const greaseReportSubordinateDataItemNumberMock: GreaseReportSubordinateDataItem =
  {
    value: dataItemValueNumberMock,
    unit: dataItemUnitMock,
    field: dataItemFieldNumberMock,
  };

export const greaseReportSubordinateDataItemStringMock: GreaseReportSubordinateDataItem =
  {
    value: dataItemValueStringMock,
    unit: undefined,
    field: dataItemFieldStringMock,
  };
