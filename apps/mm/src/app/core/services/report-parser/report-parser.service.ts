import { Injectable } from '@angular/core';

import { CalculationResultReportInput } from '@mm/core/store/models/calculation-result-report-input.model';
import {
  CalculationResult,
  MountingTools,
  PumpItem,
  ReportMessages,
  ResultItem,
  ResultItemWithTitle,
} from '@mm/core/store/models/calculation-result-state.model';

import {
  BLOCK,
  STRING_ERROR_BLOCK,
  STRING_NOTE_BLOCK,
  STRING_OUTP_ADDITIONAL_TOOLS,
  STRING_OUTP_CHECK_VALUES_FOR_CLEARANCE_CLASSES,
  STRING_OUTP_END_POSITION,
  STRING_OUTP_HYDRAULIC_NUT,
  STRING_OUTP_INPUT,
  STRING_OUTP_LOCKNUT,
  STRING_OUTP_MOUNTING_RECOMMENDATIONS_IDMM_BEARING_SEAT_IDMM_MOUNTING_METHOD,
  STRING_OUTP_MOUNTING_TOOLS_AND_UTILITIES,
  STRING_OUTP_PUMPS,
  STRING_OUTP_RADIAL_CLEARANCE_REDUCTION_AND_AXIAL_DISPLACEMENT,
  STRING_OUTP_RESULTS,
  STRING_OUTP_SLEEVE_CONNECTORS,
  STRING_OUTP_STARTING_POSITION,
  STRING_WARNING_BLOCK,
  TABLE,
  TEXT,
  VARIABLE_BLOCK,
  VARIABLE_LINE,
} from '../bearinx-result.constant';
import {
  BearinxOnlineResult,
  BearinxOnlineResultSubordinate,
} from '../bearinx-result.interface';

@Injectable({
  providedIn: 'root',
})
export class ReportParserService {
  public parseResponse(response: BearinxOnlineResult): CalculationResult {
    const startPositions = this.extractItemsFromPath(response, [
      { titleID: STRING_OUTP_RESULTS, identifier: BLOCK },
      { titleID: STRING_OUTP_STARTING_POSITION, identifier: VARIABLE_BLOCK },
    ]);

    const endPositions = this.extractItemsFromPath(response, [
      { titleID: STRING_OUTP_RESULTS, identifier: BLOCK },
      { titleID: STRING_OUTP_END_POSITION, identifier: VARIABLE_BLOCK },
    ]);

    return {
      startPositions,
      endPositions,
      mountingRecommendations: this.extractMountingRecommendations(response),
      mountingTools: this.extractMountingTools(response),
      radialClearance:
        this.extractRadialClearanceReductionAndAxialDisplacement(response),
      clearanceClasses: this.extractClearanceClasses(response),
      reportMessages: this.extractReportMessages(response),
      inputs: this.parseInputResponse(response),
    };
  }

  private extractMountingTools(response: BearinxOnlineResult): MountingTools {
    return {
      additionalTools: this.extractAdditionalTools(response),
      hydraulicNut: this.extractHydraulicNut(response),
      pumps: this.extractPumps(response),
      locknut: this.extractLockNut(response),
      sleveConnectors: this.extractSleeveConnectors(response),
    };
  }

  private extractReportMessages(response: BearinxOnlineResult): ReportMessages {
    return {
      errors: this.extractMessageByTitleId(response, STRING_ERROR_BLOCK),
      notes: this.extractMessageByTitleId(response, STRING_NOTE_BLOCK),
      warnings: this.extractMessageByTitleId(response, STRING_WARNING_BLOCK),
    };
  }

  private extractMessageByTitleId(
    originalResult: BearinxOnlineResult,
    titleId: string
  ): string[] {
    const msg = this.extractSubordinatesByTitleID(titleId, originalResult);

    return this.formatMessageSubordinates(msg);
  }

  private extractSubordinatesByTitleID(
    titleId: string,
    input: BearinxOnlineResult
  ): BearinxOnlineResultSubordinate[] {
    return input.subordinates.filter(
      (subordinate) => subordinate.titleID === titleId
    );
  }

  private extractAdditionalTools(
    originalResult: BearinxOnlineResult
  ): ResultItem[] {
    return this.extractItemsFromPath(
      originalResult,
      this.getMountingToolsItemPath(
        STRING_OUTP_ADDITIONAL_TOOLS,
        VARIABLE_BLOCK
      )
    );
  }

  private extractHydraulicNut(
    originalResult: BearinxOnlineResult
  ): ResultItem[] {
    return this.extractItemsFromPath(
      originalResult,
      this.getMountingToolsItemPath(STRING_OUTP_HYDRAULIC_NUT, VARIABLE_BLOCK)
    );
  }

  private extractLockNut(originalResult: BearinxOnlineResult): ResultItem[] {
    return this.extractItemsFromPath(
      originalResult,
      this.getMountingToolsItemPath(STRING_OUTP_LOCKNUT, VARIABLE_BLOCK)
    );
  }

  private extractSleeveConnectors(
    originalResult: BearinxOnlineResult
  ): ResultItem[] {
    return this.extractItemsFromPath(
      originalResult,
      this.getMountingToolsItemPath(
        STRING_OUTP_SLEEVE_CONNECTORS,
        VARIABLE_BLOCK
      )
    );
  }

  private getMountingToolsItemPath(titleId: string, identifier: string) {
    return [
      { titleID: STRING_OUTP_RESULTS, identifier: BLOCK },
      {
        titleID: STRING_OUTP_MOUNTING_TOOLS_AND_UTILITIES,
        identifier: BLOCK,
      },
      { titleID: titleId, identifier },
    ];
  }

  private extractRadialClearanceReductionAndAxialDisplacement(
    originalResult: BearinxOnlineResult
  ): ResultItemWithTitle[] {
    return this.extractTableItemsWithTitle(
      originalResult,
      STRING_OUTP_RADIAL_CLEARANCE_REDUCTION_AND_AXIAL_DISPLACEMENT
    );
  }

  private extractClearanceClasses(
    originalResult: BearinxOnlineResult
  ): ResultItemWithTitle[] {
    return this.extractTableItemsWithTitle(
      originalResult,
      STRING_OUTP_CHECK_VALUES_FOR_CLEARANCE_CLASSES
    );
  }

  private extractTableItemsWithTitle(
    originalResult: BearinxOnlineResult,
    titleId: string
  ): ResultItemWithTitle[] {
    const subordinates: BearinxOnlineResultSubordinate =
      this.extractSubordinatesFromPath(originalResult, [
        { titleID: STRING_OUTP_RESULTS, identifier: BLOCK },
        { titleID: titleId, identifier: TABLE },
      ]);

    return (
      subordinates?.data?.items.map((item) => {
        const title = item[0].value;
        const items = item.slice(1).map((fieldItem) => ({
          designation: fieldItem.field,
          value: fieldItem.value,
          unit: fieldItem.unit,
        }));

        return {
          title,
          items,
        };
      }) || []
    );
  }

  private extractPumps(originalResult: BearinxOnlineResult): PumpItem[] {
    const pumpsSubordinates: BearinxOnlineResultSubordinate =
      this.extractSubordinatesFromPath(
        originalResult,
        this.getMountingToolsItemPath(STRING_OUTP_PUMPS, TABLE)
      );

    return (
      pumpsSubordinates?.data?.items
        .filter(([firstItem, secondItem]) => firstItem && secondItem)
        .map(([firstItem, secondItem]) => ({
          isRecommended: firstItem.value === 'recommended',
          field: secondItem.field,
          value: secondItem.value,
        })) || []
    );
  }

  private extractMountingRecommendations(
    originalResult: BearinxOnlineResult
  ): string[] {
    const mountingRecommendationsValue: string[] = [];
    const path = [
      { titleID: STRING_OUTP_RESULTS, identifier: BLOCK },
      {
        titleID:
          STRING_OUTP_MOUNTING_RECOMMENDATIONS_IDMM_BEARING_SEAT_IDMM_MOUNTING_METHOD,
        identifier: BLOCK,
      },
    ];

    const mountingRecommendations = this.extractSubordinatesFromPath(
      originalResult,
      path
    );

    if (!mountingRecommendations) {
      return mountingRecommendationsValue;
    }

    return this.formatMessageSubordinates(mountingRecommendations.subordinates);
  }

  private extractSubordinatesFromPath(
    input: BearinxOnlineResult | BearinxOnlineResultSubordinate,
    path: Partial<BearinxOnlineResultSubordinate>[]
  ): BearinxOnlineResult | BearinxOnlineResultSubordinate | undefined {
    let result: BearinxOnlineResult | BearinxOnlineResultSubordinate = input;

    for (const pathItem of path) {
      // find sub item by identifier and designation
      const item = result.subordinates.find((subordinate) =>
        this.matchItem(subordinate, pathItem)
      );

      if (!item) {
        return undefined;
      }

      result = item;
    }

    return result;
  }

  private matchItem(
    subordinate: BearinxOnlineResultSubordinate,
    objectToMatch: Partial<BearinxOnlineResultSubordinate>
  ): boolean {
    return Object.entries(objectToMatch).every(([key, value]) =>
      key in subordinate
        ? subordinate[key as keyof BearinxOnlineResultSubordinate] === value
        : value === undefined
    );
  }

  private formatMessageSubordinates(
    rawSubordinates: BearinxOnlineResultSubordinate[]
  ): string[] {
    return rawSubordinates
      .flatMap((subordinate) => {
        if (subordinate.identifier === TEXT) {
          return subordinate.text;
        }
        if (subordinate.identifier === BLOCK) {
          return this.formatMessageSubordinates(subordinate.subordinates);
        }

        return [];
      })
      .filter((e) => String(e).trim());
  }

  private parseInputResponse(
    response: BearinxOnlineResult
  ): CalculationResultReportInput[] {
    const path = [{ titleID: STRING_OUTP_INPUT, identifier: BLOCK }];

    const inputData = this.extractSubordinatesFromPath(response, path);

    if (!inputData?.subordinates) {
      return [];
    }

    return this.formatReportInputResult(inputData.subordinates) ?? [];
  }

  private formatReportInputResult(
    input: BearinxOnlineResultSubordinate[]
  ): CalculationResultReportInput[] {
    return input?.map((reportInput) => this.getReportInput(reportInput)) ?? [];
  }

  private getReportInput(
    input: BearinxOnlineResultSubordinate
  ): CalculationResultReportInput {
    const result: CalculationResultReportInput = {
      hasNestedStructure:
        input.identifier === BLOCK || input.identifier === TABLE,
      title: input?.title,
      titleID: input?.titleID,
    };

    switch (input.identifier) {
      case BLOCK:
      case VARIABLE_BLOCK:
        result.subItems = this.formatReportInputResult(input.subordinates);
        break;
      case TABLE:
        result.subItems = this.extractReportInputFromTableSubordinate(input);
        break;
      case VARIABLE_LINE:
        result.designation = input?.designation;
        result.abbreviation = input?.abbreviation;
        result.value = input?.value;
        result.unit = input?.unit;
        break;
      default:
        throw new Error(`Unexpected identifier: ${input.identifier}`);
    }

    return result;
  }

  private extractReportInputFromTableSubordinate(
    input: Partial<BearinxOnlineResultSubordinate>
  ): CalculationResultReportInput[] {
    if (!input?.data) {
      return [];
    }

    const { items } = input.data;

    if (items.length > 1) {
      throw new Error('Only one line tables supported');
    }

    return items[0].map((tableRow) => ({
      hasNestedStructure: false,
      designation: tableRow.field,
      value: tableRow.value,
      unit: tableRow?.unit,
    }));
  }

  private extractItemsFromPath(
    originalResult: BearinxOnlineResult,
    path: { titleID: string; identifier: string }[]
  ): ResultItem[] {
    const resultBlock = this.extractSubordinatesFromPath(originalResult, path);

    if (!resultBlock?.subordinates) {
      return [];
    }

    return resultBlock.subordinates.map(
      (subordinate: BearinxOnlineResultSubordinate) => ({
        abbreviation: subordinate.abbreviation,
        designation: subordinate.designation,
        unit: subordinate.unit,
        value: subordinate.value,
      })
    );
  }
}
