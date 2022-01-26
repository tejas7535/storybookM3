import { Injectable } from '@angular/core';

import { translate } from '@ngneat/transloco';

import { Field, Hint, Subordinate, TableItem, TitleId } from '../models';

import {
  mass,
  findItem,
  initalGreaseQuantity,
  manualRelubricationQuantity,
  manualRelubricationQuantitySpan,
  automaticRelubricationQuantityPerDay,
  automaticRelubricationPerWeek,
  automaticRelubricationPerMonth,
  automaticRelubricationPerYear,
  automaticRelubricationQuantityUnit,
} from './grease-helpers';

@Injectable()
export class GreaseReportService {
  public formatGreaseReport(result: Subordinate[]): Subordinate[] {
    let formattedResult = result;

    // remove unneeded sections
    formattedResult = formattedResult.filter(
      (section: Subordinate) => section.titleID === TitleId.STRING_OUTP_INPUT
    );

    // compose result sections
    const resultSection = result.find(
      (section: Subordinate) => section.titleID === TitleId.STRING_OUTP_RESULTS
    ) as Subordinate;

    // get tables
    const tables = resultSection?.subordinates
      ?.filter(
        ({ titleID }: Subordinate) =>
          titleID === TitleId.STRING_OUTP_RESULTS_FOR_GREASE_SELECTION
      )
      .pop();

    // get table 1
    const table1 = tables?.subordinates?.find(
      ({ titleID }: Subordinate) =>
        titleID ===
        TitleId.STRING_OUTP_RESULTS_FOR_GREASE_SERVICE_STRING_OUTP_GREASE_QUANTITY_IN_CCM
    );

    // get table 2
    const table2 = tables?.subordinates?.find(
      ({ titleID }: Subordinate) =>
        titleID === TitleId.STRING_OUTP_OVERVIEW_OF_CALCULATION_DATA_FOR_GREASES
    );

    // compose compact grease table
    if (resultSection) {
      formattedResult = [
        ...formattedResult,
        {
          ...resultSection,
          defaultOpen: true,
          subordinates: [
            ...(table2?.data?.items.map((item: TableItem[], index: number) => {
              const table1Values = table1?.data?.items[index] as TableItem[];

              const greaseResult = {
                title: '',
                subtitlePart1: '',
                subtitlePart2: '',
                subtitlePart3: '',
                showValues: false,
                displayedColumns: ['title', 'values'],
                dataSource: [
                  findItem(table1Values, Field.QVIN)?.value && {
                    title: 'initalGreaseQuantity',
                    values: `${initalGreaseQuantity(table1Values)}</br>${mass(
                      item,
                      findItem(table1Values, Field.QVIN).value as number
                    )}`,
                  },
                  findItem(table1Values, Field.QVRE_MAN_MIN)?.value && {
                    title: 'manualRelubricationQuantityInterval',
                    values: `${manualRelubricationQuantity(table1Values)} ${
                      findItem(table1Values, Field.QVRE_MAN_MIN).unit
                    }/${manualRelubricationQuantitySpan(
                      table1Values
                    )}<br>${mass(
                      item,
                      manualRelubricationQuantity(table1Values),
                      manualRelubricationQuantitySpan(table1Values)
                    )}`,
                    tooltip: 'manualRelubricationQuantityIntervalTooltip',
                  },
                  findItem(table1Values, Field.QVRE_AUT_MIN)?.value && {
                    title: 'automaticRelubricationQuantityPerDay',
                    values: `${automaticRelubricationQuantityPerDay(
                      table1Values
                    )} ${automaticRelubricationQuantityUnit(
                      table1Values
                    )}/${translate('day')}<br>${mass(
                      item,
                      automaticRelubricationQuantityPerDay(table1Values),
                      translate('day')
                    )}`,
                    tooltip: 'automaticRelubricationQuantityPerDayTooltip',
                  },
                ],
              };

              (greaseResult.dataSource as any)[3] = findItem(
                table1Values,
                Field.QVRE_AUT_MIN
              )?.value && {
                title: 'automaticRelubricationPerWeek',
                values: `${Number(
                  automaticRelubricationPerWeek(table1Values)
                ).toFixed(2)} ${automaticRelubricationQuantityUnit(
                  table1Values
                )}/7 ${translate('days')}<br>${mass(
                  item,
                  automaticRelubricationPerWeek(table1Values),
                  `7 ${translate('days')}`
                )}`,
                display: false,
              };
              (greaseResult.dataSource as any)[4] = findItem(
                table1Values,
                Field.QVRE_AUT_MIN
              )?.value && {
                title: 'automaticRelubricationPerMonth',
                values: `${Number(
                  automaticRelubricationPerMonth(table1Values)
                ).toFixed(2)} ${automaticRelubricationQuantityUnit(
                  table1Values
                )}/30 ${translate('days')}<br>${mass(
                  item,
                  automaticRelubricationPerMonth(table1Values),
                  `30 ${translate('days')}`
                )}`,
                display: false,
              };
              (greaseResult.dataSource as any)[5] = findItem(
                table1Values,
                Field.QVRE_AUT_MIN
              )?.value && {
                title: 'automaticRelubricationPerYear',
                values: `${Number(
                  automaticRelubricationPerYear(table1Values)
                ).toFixed(2)} ${automaticRelubricationQuantityUnit(
                  table1Values
                )}/365 ${translate('days')}<br>${mass(
                  item,
                  automaticRelubricationPerYear(table1Values),
                  `365 ${translate('days')}`
                )}`,
                display: false,
              };
              (greaseResult.dataSource as any)[9] = findItem(
                table1Values,
                Field.TFG_MIN
              )?.value && {
                title: 'greaseServiceLife',
                values: `~ ${Math.round(
                  (+(findItem(table1Values, Field.TFG_MIN) as any).value +
                    +(findItem(table1Values, Field.TFG_MAX) as any).value) /
                    2 /
                    24
                )} ${translate('day')}`,
                display: false,
              };
              (greaseResult.dataSource as any)[10] = findItem(
                table1Values,
                Field.ADD_REQ
              )?.value && {
                title: 'additiveRequired',
                values: `${findItem(table1Values, Field.ADD_REQ).value}`,
                display: false,
                tooltip: 'additiveRequiredTooltip',
              };
              (greaseResult.dataSource as any)[11] = findItem(
                table1Values,
                Field.ADD_W
              )?.value && {
                title: 'effectiveEpAdditivation',
                values: `${findItem(table1Values, Field.ADD_W).value}`,
                display: false,
              };

              item.forEach(
                ({ field, value, unit }: TableItem, index: number) => {
                  if (index === 0) greaseResult.title = `${value}`;
                  switch (field) {
                    case Field.BASEOIL:
                      greaseResult.subtitlePart1 = `${value}`;
                      break;
                    case Field.NLGI:
                      greaseResult.subtitlePart2 = `NLGI${value}`;
                      break;
                    case Field.THICKENER:
                      greaseResult.subtitlePart3 = `${value}`;
                      break;
                    case Field.NY40:
                      (greaseResult.dataSource as any)[6] = {
                        title: 'baseOilViscosityAt40',
                        values: `${value} ${unit}`,
                        display: false,
                      };
                      break;
                    case Field.T_LIM_LOW:
                      (greaseResult.dataSource as any)[7] = {
                        title: 'lowerTemperatureLimit',
                        values: `${value} ${unit}`,
                        display: false,
                        tooltip: 'lowerTemperatureLimitTooltip',
                      };
                      break;
                    case Field.T_LIM_UP:
                      (greaseResult.dataSource as any)[8] = {
                        title: 'upperTemperatureLimit',
                        values: `${value} ${unit}`,
                        display: false,
                        tooltip: 'upperTemperatureLimitTooltip',
                      };
                      break;
                    case Field.RHO:
                      (greaseResult.dataSource as any)[12] = {
                        title: 'density',
                        values: `${value} ${unit}`,
                        display: false,
                      };
                      break;
                    case Field.F_LOW:
                      (greaseResult.dataSource as any)[13] = {
                        title: 'lowFriction',
                        values: value
                          ? `${value} (${this.checkSuitablity(
                              value as string
                            )})`
                          : `-`,
                        display: false,
                      };
                      break;
                    case Field.VIP:
                      (greaseResult.dataSource as any)[14] = {
                        title: 'suitableForVibrations',
                        values: value
                          ? `${value} (${this.checkSuitablity(
                              value as string
                            )})`
                          : `-`,
                        display: false,
                      };
                      break;
                    case Field.SEAL:
                      (greaseResult.dataSource as any)[15] = {
                        title: 'supportForSeals',
                        values: value
                          ? `${value} (${this.checkSuitablity(
                              value as string
                            )})`
                          : `-`,
                        display: false,
                      };
                      break;
                    case Field.NSF_H1:
                      (greaseResult.dataSource as any)[16] = {
                        title: 'H1Registration',
                        values: `${value}`,
                        display: false,
                      };
                      break;
                    default:
                      break;
                  }
                }
              );

              return {
                greaseResult,
                index,
                identifier: 'greaseResult',
              } as Subordinate;
            }) as Subordinate[]),
          ],
        },
      ];
    }

    // add errors, warning, notes
    formattedResult = [
      ...formattedResult,
      {
        identifier: 'block',
        defaultOpen: !resultSection,
        title: translate('errorsWarningsNotes'), // language change not considered
        subordinates: result.filter(
          (section: Subordinate) =>
            section.title &&
            Object.values(Hint)
              .map((value) => translate(value))
              .includes(section.title as any)
        ),
      },
    ];

    return formattedResult;
  }

  public checkSuitablity(suitable: string) {
    const suitablityLevels = {
      '++': 'extremely suitable',
      '+': 'highly suitable',
      '0': 'suitable',
      '-': 'lett suitable',
      '--': 'note suitable',
    };

    return (suitablityLevels as any)[suitable] || '';
  }

  public toggleShowValues(
    subordinate: Subordinate,
    formattedResult: Subordinate[]
  ): Subordinate[] {
    const toggledFormattedResult = formattedResult.map((section: Subordinate) =>
      section.titleID === TitleId.STRING_OUTP_RESULTS
        ? {
            ...section,
            subordinates: section.subordinates?.map((subsection: any) =>
              subsection.index === (subordinate as any).index
                ? {
                    ...subsection,
                    greaseResult: {
                      ...subsection.greaseResult,
                      showValues: !subsection.greaseResult.showValues,
                    },
                  }
                : subsection
            ),
          }
        : section
    ) as Subordinate[];

    return toggledFormattedResult;
  }

  public showActiveData(formattedResult: Subordinate[]): Subordinate[] {
    return formattedResult.map((section: Subordinate) =>
      section.titleID === TitleId.STRING_OUTP_RESULTS
        ? {
            ...section,
            subordinates: section.subordinates?.map((subsection: any) => ({
              ...subsection,
              greaseResult: {
                ...subsection.greaseResult,
                dataSource: subsection.greaseResult?.dataSource.filter(
                  (entry: any) =>
                    entry?.display !== subsection.greaseResult.showValues
                ),
              },
            })),
          }
        : section
    ) as Subordinate[];
  }

  public getResultAmount(formattedResult: Subordinate[]): number {
    return (
      formattedResult.find(
        (section: Subordinate) =>
          section.titleID === TitleId.STRING_OUTP_RESULTS
      )?.subordinates?.length ?? 0
    );
  }
}
