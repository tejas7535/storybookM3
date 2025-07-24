import { Pipe, PipeTransform } from '@angular/core';

import {
  greaseSelectionKeys,
  initialResultSections,
  performanceKeys,
  relubricationKeys,
} from '../constants';
import {
  adaptLabelValuesFromGreaseResultData,
  getKappaBadgeColorClass,
} from '../helpers/grease-helpers';
import { GreaseResult, ResultSection, ResultSectionData } from '../models';

@Pipe({
  name: 'resultSection',
  standalone: true,
  pure: true,
})
export class ResultSectionPipe implements PipeTransform {
  transform(result: GreaseResult): ResultSectionData {
    const filteredDatasource = result.dataSource.filter(Boolean);

    const initialLubricationBadge = this.splitBadgeText(
      filteredDatasource.find(({ title }) => title === 'initialGreaseQuantity')
        ?.values || ''
    );
    const performanceBadge = this.splitBadgeText(
      filteredDatasource.find(({ title }) => title === 'viscosityRatio')
        ?.values || ''
    );
    const relubricationBadge = this.splitBadgeText(
      filteredDatasource.find(
        ({ title }) => title === 'relubricationQuantityPer1000OperatingHours'
      )?.values || ''
    );
    const greaseSelectionBadge = this.splitBadgeText(
      filteredDatasource.find(({ title }) => title === 'greaseServiceLife')
        ?.values || ''
    );

    return {
      initialLubrication: {
        ...initialResultSections.initialLubrication,
        badgeText: initialLubricationBadge.badgeText,
        badgeSecondaryText: initialLubricationBadge.badgeSecondaryText,
        extendable: false,
      } as ResultSection,
      performance: {
        ...initialResultSections.performance,
        badgeText: performanceBadge.badgeText,
        badgeSecondaryText: performanceBadge.badgeSecondaryText,
        badgeClass: getKappaBadgeColorClass(performanceBadge.badgeText),
        labelValues: adaptLabelValuesFromGreaseResultData(
          result.dataSource.filter(
            (item) => !!item && performanceKeys.includes(item.title)
          )
        ),
      } as ResultSection,
      relubrication: {
        ...initialResultSections.relubrication,
        badgeText: relubricationBadge.badgeText.replace(/\/1000.+/, ''),
        badgeSecondaryText: relubricationBadge.badgeSecondaryText.replace(
          /\/1000.+/,
          ''
        ),
        labelValues: adaptLabelValuesFromGreaseResultData(
          this.getRelubricationSection(result)
        ),
      } as ResultSection,
      greaseSelection: {
        ...initialResultSections.greaseSelection,
        badgeText: greaseSelectionBadge.badgeText,
        badgeSecondaryText: greaseSelectionBadge.badgeSecondaryText,
        labelValues: adaptLabelValuesFromGreaseResultData(
          result.dataSource.filter(
            (item) => !!item && greaseSelectionKeys.includes(item.title)
          )
        ),
      } as ResultSection,
    };
  }

  private splitBadgeText(badgeText: string): {
    badgeText: string;
    badgeSecondaryText?: string;
  } {
    const regexp = /<[^>]+>/;
    const parts = badgeText.split(regexp).filter((part) => part.trim() !== '');

    return {
      badgeText: parts.at(0),
      badgeSecondaryText: parts.at(1),
    };
  }

  private getRelubricationSection(result: GreaseResult) {
    const filtered = result.dataSource.filter(
      (item) => !!item && relubricationKeys.includes(item.title)
    );

    const sortedReturnValues: GreaseResult['dataSource'] = [];

    for (const item of filtered) {
      sortedReturnValues[relubricationKeys.indexOf(item.title)] = item;
    }

    return sortedReturnValues.filter(Boolean);
  }
}
