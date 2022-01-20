import { Injectable } from '@angular/core';

import { translate } from '@ngneat/transloco';

import { Field, Hint, Subordinate, TableItem, TitleId } from './models';

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
            ...(table2?.data?.items
              .slice(0, 3)
              .map((item: TableItem[], index: number) => {
                const table1Values = table1?.data?.items[index];

                const findItem = (searchField: Field): TableItem =>
                  table1Values?.find(
                    ({ field }: TableItem) => field === searchField
                  ) as TableItem;

                const greaseResult = {
                  title: '',
                  subtitlePart1: '',
                  subtitlePart2: '',
                  subtitlePart3: '',
                  showValues: false,
                  displayedColumns: ['title', 'values'],
                  dataSource: [
                    findItem(Field.QVIN)?.value && {
                      title: 'initalGreaseQuantity',
                      values: `${findItem(Field.QVIN).value} ${
                        findItem(Field.QVIN).unit
                      }`,
                    },
                    (findItem(Field.QVRE_MAN_MIN) as any)?.value && {
                      title: 'manualRelubricationQuantityInterval',
                      values: `${
                        (+(findItem(Field.QVRE_MAN_MIN) as any).value +
                          +(findItem(Field.QVRE_MAN_MAX) as any).value) /
                        2
                      } ${findItem(Field.QVRE_MAN_MIN).unit}/${Math.round(
                        (+(findItem(Field.TFR_MIN) as any).value +
                          +(findItem(Field.TFR_MIN) as any).value) /
                          2 /
                          24
                      )} d`,
                      tooltip: 'manualRelubricationQuantityIntervalTooltip',
                    },
                    (findItem(Field.QVRE_AUT_MIN) as any)?.value && {
                      title: 'automaticRelubricationQuantityPerDay',
                      values: `${(
                        (+(findItem(Field.QVRE_AUT_MIN) as any).value +
                          +(findItem(Field.QVRE_AUT_MAX) as any).value) /
                        2
                      ).toFixed(4)} ${findItem(Field.QVRE_AUT_MIN).unit}`,
                      tooltip: 'automaticRelubricationQuantityPerDayTooltip',
                    },
                  ],
                };

                (greaseResult.dataSource as any)[3] = (
                  findItem(Field.QVRE_AUT_MIN) as any
                )?.value && {
                  title: 'automaticRelubricationPerWeek',
                  values: `${Number(
                    ((+(findItem(Field.QVRE_AUT_MIN) as any).value +
                      +(findItem(Field.QVRE_AUT_MAX) as any).value) /
                      2) *
                      7
                  ).toFixed(2)} ${findItem(Field.QVIN).unit}/7d`,
                  display: false,
                };
                (greaseResult.dataSource as any)[4] = (
                  findItem(Field.QVRE_AUT_MIN) as any
                )?.value && {
                  title: 'automaticRelubricationPerMonth',
                  values: `${Number(
                    ((+(findItem(Field.QVRE_AUT_MIN) as any).value +
                      +(findItem(Field.QVRE_AUT_MAX) as any).value) /
                      2) *
                      30
                  ).toFixed(2)} ${findItem(Field.QVIN).unit}/30d`,
                  display: false,
                };
                (greaseResult.dataSource as any)[5] = (
                  findItem(Field.QVRE_AUT_MIN) as any
                )?.value && {
                  title: 'automaticRelubricationPerYear',
                  values: `${Number(
                    ((+(findItem(Field.QVRE_AUT_MIN) as any).value +
                      +(findItem(Field.QVRE_AUT_MAX) as any).value) /
                      2) *
                      365
                  ).toFixed(2)} ${findItem(Field.QVIN).unit}/365d`,
                  display: false,
                };
                (greaseResult.dataSource as any)[9] = (
                  findItem(Field.TFG_MIN) as any
                )?.value && {
                  title: 'greaseServiceLife',
                  values: `~ ${Math.round(
                    (+(findItem(Field.TFG_MIN) as any).value +
                      +(findItem(Field.TFG_MAX) as any).value) /
                      2 /
                      24
                  )} d`,
                  display: false,
                };
                (greaseResult.dataSource as any)[10] = findItem(Field.ADD_REQ)
                  ?.value && {
                  title: 'additiveRequired',
                  values: `${findItem(Field.ADD_REQ).value}`,
                  display: false,
                  tooltip: 'additiveRequiredTooltip',
                };
                (greaseResult.dataSource as any)[11] = findItem(Field.ADD_W)
                  ?.value && {
                  title: 'effectiveEpAdditivation',
                  values: `${findItem(Field.ADD_W).value}`,
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
}
