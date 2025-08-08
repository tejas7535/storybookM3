import { inject, Pipe, PipeTransform } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';

import { LabelValue } from '@schaeffler/label-value';

import {
  greaseSelectionKeys,
  initialResultSections,
  performanceKeys,
  relubricationKeys,
} from '../constants';
import {
  getKappaBadgeColorClass,
  getLabelHintForResult,
} from '../helpers/grease-helpers';
import {
  GreaseResultDataItem,
  GreaseResultItem,
  ResultSection,
  ResultSectionRaw,
} from '../models';

@Pipe({
  name: 'resultSection',
  standalone: true,
  pure: true,
})
export class ResultSectionPipe implements PipeTransform {
  private readonly localeService = inject(TranslocoLocaleService);

  transform(sectionRaw: ResultSectionRaw): ResultSection {
    const values: (GreaseResultItem | GreaseResultDataItem)[] =
      Object.values(sectionRaw);
    const initialSection = Object.values(initialResultSections).find(
      (section) => Object.keys(sectionRaw).includes(section.mainValue)
    );

    const mainValue = (
      values.filter(
        (value) => !!value && !('custom' in value)
      ) as GreaseResultItem[]
    ).find((value) => value.value !== undefined);

    const section = {
      ...initialSection,
      mainValue: mainValue.title,
      badgeText: mainValue?.value
        ? this.getLocalizedStringValue(mainValue).replace(/\/\d+\s.+/, '')
        : undefined,
      badgeSecondaryText: mainValue?.secondaryValue
        ? this.getLocalizedStringValue(mainValue, true).replace(/\/\d+\s.+/, '')
        : undefined,
      badgeClass:
        mainValue.title === 'viscosityRatio'
          ? getKappaBadgeColorClass(mainValue.value)
          : initialSection.badgeClass,
      labelValues: this.adaptLabelValuesFromGreaseResultItems(
        values.filter(
          (value) =>
            [
              ...greaseSelectionKeys,
              ...performanceKeys,
              ...relubricationKeys,
            ].includes(value?.title) && value !== undefined
        )
      ),
    } as ResultSection;

    return section;
  }

  private readonly adaptLabelValuesFromGreaseResultItems = (
    results: (GreaseResultItem | GreaseResultDataItem)[] = []
  ): LabelValue[] =>
    results.length > 0
      ? results.map((item) => {
          let value: string;
          if ('value' in item) {
            value =
              item?.title === 'viscosityRatio'
                ? this.getLocalizedStringValue(item)
                : this.getHtmlValue(item);
          } else {
            value = item?.values;
          }

          return {
            label: translate(
              item?.title ? `calculationResult.${item.title}` : ''
            ),
            labelHint: getLabelHintForResult(item),
            metadata:
              item?.title === 'viscosityRatio'
                ? {
                    badgeClass: getKappaBadgeColorClass(
                      (item as GreaseResultItem<number>).value
                    ),
                  }
                : undefined,
            value,
            custom: 'custom' in item ? item.custom : undefined,
            specialTemplate:
              item?.title === 'viscosityRatio' ? 'viscocity' : undefined,
          };
        })
      : [];

  private readonly getLocalizedStringValue = (
    item: GreaseResultItem,
    secondary?: boolean
  ): string => {
    let value = secondary ? item.secondaryValue : item.value;
    const prefix = secondary ? item.secondaryPrefix : item.prefix;
    const unit = secondary ? item.secondaryUnit : item.unit;
    if (typeof value === 'number') {
      const options =
        item.title === 'initialGreaseQuantity'
          ? { maximumFractionDigits: 2 }
          : undefined;
      value = this.localeService.localizeNumber(
        value,
        'decimal',
        undefined,
        options
      );
    }

    return `${prefix || ''} ${value} ${unit || ''}`;
  };

  private readonly getHtmlValue = (item: GreaseResultItem): string => {
    const mainValue = `<span>${this.getLocalizedStringValue(item)}</span>`;

    if (item.secondaryValue) {
      const secondaryValue = `<span class="text-low-emphasis">${this.getLocalizedStringValue(item, true)}</span>`;

      return `${mainValue}<br>${secondaryValue}`;
    }

    return mainValue;
  };
}
