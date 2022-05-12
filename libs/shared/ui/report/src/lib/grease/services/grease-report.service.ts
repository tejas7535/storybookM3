/* eslint-disable max-lines */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { lastValueFrom } from 'rxjs';

import { translate } from '@ngneat/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import {
  Field,
  Hint,
  Report,
  Subordinate,
  TableItem,
  TitleId,
  WARNINGSOPENED,
} from '../../models';
import { GreaseResult } from '../../models/grease-result.model';
import * as fromHelpers from '../helpers/grease-helpers';
import { SuitabilityLevels } from '../models/suitability.model';

@Injectable()
export class GreaseReportService {
  public constructor(
    private readonly http: HttpClient,
    private readonly applicationInsightsService: ApplicationInsightsService
  ) {}

  public async getGreaseReport(greaseReportUrl: string) {
    return lastValueFrom(this.http.get<Report>(greaseReportUrl));
  }

  public formatGreaseReport(result: Subordinate[]): Subordinate[] {
    let formattedResult = result || [];

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

              const greaseResult: GreaseResult = {
                title: '',
                subtitlePart1: '',
                subtitlePart2: '',
                subtitlePart3: '',
                showValues: false,
                displayedColumns: ['title', 'values'],
                dataSource: [
                  fromHelpers.findItem(table1Values, Field.QVIN)?.value && {
                    title: 'initialGreaseQuantity',
                    values: `${fromHelpers.mass(
                      item,
                      fromHelpers.findItem(table1Values, Field.QVIN)
                        .value as number
                    )}</br>${fromHelpers.secondaryValue(
                      fromHelpers.initialGreaseQuantity(table1Values)
                    )}`,
                  },
                  fromHelpers.findItem(table1Values, Field.QVRE_MAN_MIN)
                    ?.value && {
                    title: 'manualRelubricationQuantityInterval',
                    values: `${fromHelpers.mass(
                      item,
                      fromHelpers.manualRelubricationQuantity(table1Values),
                      fromHelpers.manualRelubricationQuantitySpan(table1Values)
                    )}<br>${fromHelpers.secondaryValue(
                      `${fromHelpers
                        .manualRelubricationQuantity(table1Values)
                        .toFixed(2)} ${
                        fromHelpers.findItem(table1Values, Field.QVRE_MAN_MIN)
                          .unit
                      }/${fromHelpers.manualRelubricationQuantitySpan(
                        table1Values
                      )}`
                    )}`,
                    tooltip: 'manualRelubricationQuantityIntervalTooltip',
                  },
                  fromHelpers.findItem(table1Values, Field.QVRE_AUT_MIN)
                    ?.value && {
                    title: 'automaticRelubricationQuantityPerDay',
                    values: `${fromHelpers.mass(
                      item,
                      fromHelpers.automaticRelubricationQuantityPerDay(
                        table1Values
                      ),
                      translate('day'),
                      true
                    )}<br>${fromHelpers.secondaryValue(
                      `${fromHelpers.formatDecimals(
                        fromHelpers.automaticRelubricationQuantityPerDay(
                          table1Values
                        )
                      )} ${fromHelpers.automaticRelubricationQuantityUnit(
                        table1Values
                      )}/${translate('day')}`
                    )}`,
                    tooltip: 'automaticRelubricationQuantityPerDayTooltip',
                  },
                ],
              };

              greaseResult.dataSource[4] = fromHelpers.findItem(
                table1Values,
                Field.QVRE_AUT_MIN
              )?.value && {
                title: 'automaticRelubricationPerWeek',
                values: `${fromHelpers.mass(
                  item,
                  fromHelpers.automaticRelubricationPerWeek(table1Values),
                  `7 ${translate('days')}`,
                  true
                )}<br>${fromHelpers.secondaryValue(
                  `${fromHelpers.formatDecimals(
                    fromHelpers.automaticRelubricationPerWeek(table1Values)
                  )} ${fromHelpers.automaticRelubricationQuantityUnit(
                    table1Values
                  )}/7 ${translate('days')}`
                )}`,
                display: false,
              };
              greaseResult.dataSource[5] = fromHelpers.findItem(
                table1Values,
                Field.QVRE_AUT_MIN
              )?.value && {
                title: 'automaticRelubricationPerMonth',
                values: `${fromHelpers.mass(
                  item,
                  fromHelpers.automaticRelubricationPerMonth(table1Values),
                  `30 ${translate('days')}`
                )}<br>${fromHelpers.secondaryValue(
                  `${Number(
                    fromHelpers.automaticRelubricationPerMonth(table1Values)
                  ).toFixed(
                    2
                  )} ${fromHelpers.automaticRelubricationQuantityUnit(
                    table1Values
                  )}/30 ${translate('days')}`
                )}`,
                display: false,
              };
              greaseResult.dataSource[6] = fromHelpers.findItem(
                table1Values,
                Field.QVRE_AUT_MIN
              )?.value && {
                title: 'automaticRelubricationPerYear',
                values: `${fromHelpers.mass(
                  item,
                  fromHelpers.automaticRelubricationPerYear(table1Values),
                  `365 ${translate('days')}`
                )}<br>${fromHelpers.secondaryValue(
                  `${Number(
                    fromHelpers.automaticRelubricationPerYear(table1Values)
                  ).toFixed(
                    2
                  )} ${fromHelpers.automaticRelubricationQuantityUnit(
                    table1Values
                  )}/365 ${translate('days')}`
                )}`,
                display: false,
              };
              greaseResult.dataSource[7] = {
                title: 'viscosityRatio',
                values: `${
                  (fromHelpers.findItem(table1Values, Field.KAPPA) as any).value
                }`,
                display: false,
              };
              greaseResult.dataSource[3] = fromHelpers.findItem(
                table1Values,
                Field.TFG_MIN
              )?.value && {
                title: 'greaseServiceLife',
                values: `~ ${Math.round(
                  (+(fromHelpers.findItem(table1Values, Field.TFG_MIN) as any)
                    .value +
                    +(fromHelpers.findItem(table1Values, Field.TFG_MAX) as any)
                      .value) /
                    2 /
                    24
                )} ${translate('day')}`,
                display: false,
              };
              greaseResult.dataSource[11] = fromHelpers.findItem(
                table1Values,
                Field.ADD_REQ
              )?.value && {
                title: 'additiveRequired',
                values: `${
                  fromHelpers.findItem(table1Values, Field.ADD_REQ).value
                }`,
                display: false,
                tooltip: 'additiveRequiredTooltip',
              };
              greaseResult.dataSource[12] = fromHelpers.findItem(
                table1Values,
                Field.ADD_W
              )?.value && {
                title: 'effectiveEpAdditivation',
                values: `${
                  fromHelpers.findItem(table1Values, Field.ADD_W).value
                }`,
                display: false,
              };

              item.forEach(
                ({ field, value, unit }: TableItem, itemIndex: number) => {
                  if (itemIndex === 0) {
                    greaseResult.title = `${value}`;
                  }

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
                      greaseResult.dataSource[8] = {
                        title: 'baseOilViscosityAt40',
                        values: `${value} ${unit}`,
                        display: false,
                      };
                      break;
                    case Field.T_LIM_LOW:
                      greaseResult.dataSource[9] = {
                        title: 'lowerTemperatureLimit',
                        values: `${value} ${unit}`,
                        display: false,
                        tooltip: 'lowerTemperatureLimitTooltip',
                      };
                      break;
                    case Field.T_LIM_UP:
                      greaseResult.dataSource[10] = {
                        title: 'upperTemperatureLimit',
                        values: `${value} ${unit}`,
                        display: false,
                        tooltip: 'upperTemperatureLimitTooltip',
                      };
                      break;
                    case Field.RHO:
                      greaseResult.dataSource[13] = {
                        title: 'density',
                        values: `${value} ${unit}`,
                        display: false,
                      };
                      break;
                    case Field.F_LOW:
                      greaseResult.dataSource[14] = {
                        title: 'lowFriction',
                        values: value
                          ? `${value} (${translate(
                              `suitabilityLevel${fromHelpers.checkSuitability(
                                value as `${SuitabilityLevels}`
                              )}`
                            )})`
                          : `-`,
                        display: false,
                      };
                      break;
                    case Field.VIP:
                      greaseResult.dataSource[15] = {
                        title: 'suitableForVibrations',
                        values: value
                          ? `${value} (${translate(
                              `suitabilityLevel${fromHelpers.checkSuitability(
                                value as `${SuitabilityLevels}`
                              )}`
                            )})`
                          : `-`,
                        display: false,
                      };
                      break;
                    case Field.SEAL:
                      greaseResult.dataSource[16] = {
                        title: 'supportForSeals',
                        values: value
                          ? `${value} (${translate(
                              `suitabilityLevel${fromHelpers.checkSuitability(
                                value as `${SuitabilityLevels}`
                              )}`
                            )})`
                          : `-`,
                        display: false,
                      };
                      break;
                    case Field.NSF_H1:
                      greaseResult.dataSource[17] = {
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
        clickHandler: () => this.trackWarningsOpened(),
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

  public getResultAmount(formattedResult: Subordinate[]): number {
    return (
      formattedResult.find(
        (section: Subordinate) =>
          section.titleID === TitleId.STRING_OUTP_RESULTS
      )?.subordinates?.length ?? 0
    );
  }

  public trackWarningsOpened(): void {
    this.applicationInsightsService.logEvent(WARNINGSOPENED);
  }
}
