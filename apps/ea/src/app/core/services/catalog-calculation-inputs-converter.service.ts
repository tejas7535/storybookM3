import { Injectable } from '@angular/core';

import { roundToThreeSigFigs } from '@ea/shared/helper';
import { translate } from '@jsverse/transloco';

import { CalculationResultReportInput } from '../store/models/calculation-result-report-input.model';
import { extractSubordinatesFromPath } from './bearinx-helper';
import {
  BLOCK,
  LOADCASE_DESIGNATION_FIELD_NAME_TRANSLATION_KEY,
  LOADCASE_TYPE_OF_MOTION_TRANSLATION_KEY,
  LOADCASES_TITLE_TRANSLATION_KEY,
  STRING_OUTP_BASIC_FREQUENCIES_FACTOR,
  STRING_OUTP_INPUT,
  STRING_OUTP_INPUT_DATA_FOR_ALL_LOADCASES,
  STRING_OUTP_LOAD,
  STRING_OUTP_LOADCASE_DATA,
  TABLE,
  VARIABLE_BLOCK,
  VARIABLE_LINE,
} from './bearinx-result.constant';
import {
  BearinxOnlineResult,
  BearinxOnlineResultSubordinate,
} from './bearinx-result.interface';

@Injectable({ providedIn: 'root' })
export class CatalogCalculationInputsConverterService {
  private readonly meaningFulRoundTitleIDs = [
    STRING_OUTP_BASIC_FREQUENCIES_FACTOR,
  ];

  public convertCatalogInputsResponse(
    response: BearinxOnlineResult
  ): CalculationResultReportInput[] {
    let inputs: CalculationResultReportInput[] = [];

    const inputData = extractSubordinatesFromPath(response, [
      { titleID: STRING_OUTP_INPUT, identifier: BLOCK },
    ]);

    if (!inputData) {
      return inputs;
    }

    const formattedInputData = this.formatReportInputResult(
      inputData?.subordinates
    );

    if (formattedInputData) {
      inputs = formattedInputData;
    }

    return inputs;
  }

  formatReportInputResult = (
    input: BearinxOnlineResultSubordinate[],
    meaningFulRound?: boolean
  ): CalculationResultReportInput[] =>
    input?.map((reportInput) =>
      this.getReportInput(reportInput, meaningFulRound)
    );

  private getReportInput(
    input: BearinxOnlineResultSubordinate,
    meaningFulRound: boolean
  ): CalculationResultReportInput {
    let shouldRoundNumber = meaningFulRound;

    if (this.meaningFulRoundTitleIDs.includes(input?.titleID)) {
      shouldRoundNumber = true;
    }
    const result: CalculationResultReportInput = {
      hasNestedStructure:
        input.identifier === BLOCK || input.identifier === TABLE,
      title: input?.title,
      titleID: input?.titleID,
    };

    if (input.identifier === BLOCK || input.identifier === VARIABLE_BLOCK) {
      if (input.titleID === STRING_OUTP_INPUT_DATA_FOR_ALL_LOADCASES) {
        result.title = translate(LOADCASES_TITLE_TRANSLATION_KEY);
        result.subItems = this.extractReportInputForAllLoadTableSubordinates(
          input.subordinates
        );
      } else {
        result.subItems = this.formatReportInputResult(
          input.subordinates,
          shouldRoundNumber
        );
      }
    }

    if (input.identifier === TABLE) {
      result.subItems = this.extractReportInputFromTableSubordinate(input);
    }

    if (input.identifier === VARIABLE_LINE) {
      let value = input?.value;

      if (shouldRoundNumber) {
        value = this.formatNumber(input?.value);
      }

      result.designation = input?.designation;
      result.abbreviation = input?.abbreviation;
      result.value = value;
      result.unit = input?.unit;
    }

    return result;
  }

  private formatNumber(value: string): string {
    if (value === undefined || value === null) {
      return value;
    }

    const prefix =
      (typeof value === 'string' && this.extractPrefix(value)) || '';

    const roundedNumber = roundToThreeSigFigs(
      typeof value === 'number'
        ? value
        : Number.parseFloat(value.replace(prefix, ''))
    );

    return roundedNumber;
  }

  private extractPrefix(input: string): string | undefined {
    const regex = /^(\S+\s)/;

    const match = regex.exec(input);

    return match ? match[1] : undefined;
  }

  private extractReportInputForAllLoadTableSubordinates(
    input: Partial<BearinxOnlineResultSubordinate[]>
  ): CalculationResultReportInput[] | undefined {
    if (
      input?.length !== 2 ||
      !input?.some(
        (subordinate) => subordinate.titleID === STRING_OUTP_LOADCASE_DATA
      ) ||
      !input?.some((subordinate) => subordinate.titleID === STRING_OUTP_LOAD)
    ) {
      return undefined;
    }

    const combinedLoadInputs: CalculationResultReportInput[] = [];

    for (const loadInputSubordinate of input) {
      const description = loadInputSubordinate.description;
      const { items } = loadInputSubordinate.data;

      for (const loadcaseItem of items) {
        const loadcaseName = loadcaseItem.find(
          (item) =>
            item.field ===
            translate(LOADCASE_DESIGNATION_FIELD_NAME_TRANSLATION_KEY)
        ).value;

        const newInputs = loadcaseItem
          .filter(
            (tableRow) =>
              tableRow.field !==
              translate(LOADCASE_DESIGNATION_FIELD_NAME_TRANSLATION_KEY)
          )
          .map((tableRow) => ({
            hasNestedStructure: false,
            designation: this.mapFieldsWithDescriptions(
              tableRow.field,
              description.entries
            ),
            value: tableRow.value,
            unit: tableRow?.unit,
          }));

        if (
          combinedLoadInputs.some(
            (loadInput) => loadInput.title === loadcaseName
          )
        ) {
          combinedLoadInputs
            .find((loadInput) => loadInput.title === loadcaseName)
            ?.subItems.push(...newInputs);
        } else {
          combinedLoadInputs.push({
            hasNestedStructure: false,
            title: loadcaseName,
            subItems: newInputs,
          });
        }
      }
    }

    return combinedLoadInputs;
  }

  private extractReportInputFromTableSubordinate(
    input: Partial<BearinxOnlineResultSubordinate>
  ): CalculationResultReportInput[] | undefined {
    if (!input?.data) {
      return undefined;
    }

    const description = input.description;
    const { items } = input.data;

    const newInputs = items.map((loadcaseItem, index) => ({
      subItems: loadcaseItem
        .filter(
          (tableRow) =>
            tableRow.field !==
            translate(LOADCASE_DESIGNATION_FIELD_NAME_TRANSLATION_KEY)
        )
        .map((tableRow) => ({
          hasNestedStructure: false,
          designation: this.mapFieldsWithDescriptions(
            tableRow.field,
            description.entries
          ),
          value: tableRow.value,
          unit: tableRow?.unit,
        })),
      hasNestedStructure: false,
      titleID: index.toString(),
      title: loadcaseItem.find(
        (tableRow) =>
          tableRow.field ===
          translate(LOADCASE_DESIGNATION_FIELD_NAME_TRANSLATION_KEY)
      )?.value,
    }));

    return newInputs;
  }

  private mapFieldsWithDescriptions(
    field: string,
    mapping: [string, string][]
  ): string {
    // type of movement field name is empty for multi load case results because it has no abbreviation
    if (field === '') {
      return translate(LOADCASE_TYPE_OF_MOTION_TRANSLATION_KEY);
    }

    const designation = mapping.find(
      ([abbreviation, _designation]) => abbreviation.replace(': ', '') === field
    )?.[1];

    return `${designation} (${field})`;
  }
}
