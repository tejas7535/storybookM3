import {
  GreaseReportSubordinate,
  GreaseReportSubordinateDataItem,
  GreaseReportSubordinateTitle,
  SubordinateDataItemField,
  SUITABILITY,
  SUITABILITY_LABEL,
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

export const GreaseReportConcept1TitleMock = 'jawollo';
export const GreaseReportConcept1TitleIDMock = SUITABILITY.YES;
export const GreaseReportConcept1LabelMock = SUITABILITY_LABEL.SUITED;
export const GreaseReportConcept1HintMock = 'lube up bro';
export const GreaseReportConcept1125ValueMock = 4.5;
export const GreaseReportConcept160ValueMock = 9;

export const GreaseReportConcept1ItemsMock: GreaseReportSubordinateDataItem[] =
  [
    {
      value: GreaseReportConcept1TitleMock,
      unit: undefined,
      field: SubordinateDataItemField.C1,
    },
    {
      value: GreaseReportConcept1125ValueMock,
      unit: undefined,
      field: SubordinateDataItemField.C1_125,
    },
    {
      value: GreaseReportConcept160ValueMock,
      unit: undefined,
      field: SubordinateDataItemField.C1_60,
    },
  ];

export const greaseReportSubordinateConcept1Mock: GreaseReportSubordinate[] = [
  {
    titleID: GreaseReportSubordinateTitle.STRING_OUTP_CONCEPT1,
    data: {
      items: [GreaseReportConcept1ItemsMock],
    },
  } as unknown as GreaseReportSubordinate,
  {
    title: `${GreaseReportConcept1TitleMock}:`,
    titleID: GreaseReportConcept1TitleIDMock,
    subordinates: [
      {
        text: [GreaseReportConcept1HintMock],
      },
    ],
  } as unknown as GreaseReportSubordinate,
];
