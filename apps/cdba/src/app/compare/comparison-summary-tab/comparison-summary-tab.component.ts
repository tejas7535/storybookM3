import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable, Subscription, take } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { Store } from '@ngrx/store';
import { ECharts } from 'echarts';

import { StringOption } from '@schaeffler/inputs';

import { CHART_HIGHLIGHT_ERROR } from '@cdba/shared/constants/colors';
import { Calculation } from '@cdba/shared/models';
import {
  Comparison,
  ComparisonDetail,
} from '@cdba/shared/models/comparison.model';
import { toCamelCase } from '@cdba/shared/utils';

import {
  areBomItemsValidForComparison,
  getComparison,
  getComparisonError,
  getSelectedCalculations,
  isComparisonLoading,
} from '../store';
import { ComparisonChartComponent } from './comparison-chart/comparison-chart.component';
import { ComparisonSummaryChartService } from './service/comparison-summary-chart.service';

@Component({
  selector: 'cdba-comparison-summary-tab',
  templateUrl: './comparison-summary-tab.component.html',
  styleUrl: './comparison-summary-tab.component.scss',
  standalone: false,
})
export class ComparisonSummaryTabComponent implements OnInit, OnDestroy {
  @ViewChild('leftErrorTemplate', { static: true })
  leftErrorTemplate: TemplateRef<any>;
  @ViewChild('rightErrorTemplate', { static: true })
  rightErrorTemplate: TemplateRef<any>;

  @ViewChild('leftNoDataTemplate', { static: true })
  leftNoDataTemplate: TemplateRef<any>;
  @ViewChild('rightNoDataTemplate', { static: true })
  rightNoDataTemplate: TemplateRef<any>;

  @ViewChild('leftValidTemplate')
  leftValidTemplate: TemplateRef<any>;
  @ViewChild('rightValidTemplate')
  rightValidTemplate: TemplateRef<any>;

  @ViewChild('comparisonChart')
  comparisonChart: ComparisonChartComponent;

  tableColumns = this.chartService.provideSummaryTableColumns();

  echartsInstance: ECharts;
  eChartOptions: any;

  isLoading$ = this.store.select(isComparisonLoading);
  isLoadingSubscription: Subscription;
  isLoading: boolean;

  areBomItemsValidForComparisonSubscription: Subscription;
  areBomItemsValidForComparison$ = this.store.select(
    areBomItemsValidForComparison
  );
  areBomItemsValidForComparison: boolean;

  errorMessage$: Observable<string> = this.store.select(getComparisonError);
  errorMessageSubscription: Subscription;
  errorMessage: string;

  comparison$: Observable<Comparison> = this.store.select(getComparison);
  comparisonSubscription: Subscription;
  comparison: Comparison;

  firstMaterialDesignation: string;
  secondMaterialDesignation: string;

  invariantDetails: ComparisonDetail[] = [];
  selectedDetails: ComparisonDetail[] = [];
  details: ComparisonDetail[] = [];

  formControl = new FormControl();
  valueChangesSubscription: Subscription;

  invariantStringOptions: StringOption[] = [];
  selectedStringOptions: StringOption[] = [];
  stringOptions: StringOption[] = [];

  chartHighlightError = CHART_HIGHLIGHT_ERROR;

  constructor(
    private readonly chartService: ComparisonSummaryChartService,
    private readonly transloco: TranslocoService,
    private readonly localeService: TranslocoLocaleService,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.areBomItemsValidForComparisonSubscription =
      this.areBomItemsValidForComparison$.subscribe(
        (areValid) => (this.areBomItemsValidForComparison = areValid)
      );
    this.valueChangesSubscription = this.formControl.valueChanges.subscribe(
      (value) => {
        if (value) {
          this.selectedStringOptions = [...value];
        }
      }
    );
    this.isLoadingSubscription = this.isLoading$.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );
    this.errorMessageSubscription = this.errorMessage$.subscribe(
      (errorMessage) => (this.errorMessage = errorMessage)
    );

    this.comparisonSubscription = this.comparison$.subscribe((comparison) => {
      this.comparison =
        comparison === undefined
          ? undefined
          : // Copy to new object so it'll be mutable
            (this.comparison = JSON.parse(JSON.stringify(comparison)));

      if (
        this.comparison?.details &&
        this.comparison?.summary &&
        !this.isLoading
      ) {
        this.localizeComparisonSummary();
        this.populateOptions();

        this.invariantDetails = this.comparison.details;
        this.details = this.invariantDetails;

        this.eChartOptions =
          this.chartService.provideSummarizedRadarChartConfig(
            this.firstMaterialDesignation,
            this.secondMaterialDesignation,
            this.comparison
          );
      }
    });
  }

  localizeComparisonSummary(): void {
    if (
      this.comparison.summary.firstMaterialDesignation ===
      this.comparison.summary.secondMaterialDesignation
    ) {
      let selectedCalculations: Calculation[];
      this.store
        .select(getSelectedCalculations)
        .pipe(take(1))
        .subscribe((selCalcs) => (selectedCalculations = selCalcs));

      const localizedCalculationDateForFirstMaterialDesignation =
        this.localeService.localizeDate(
          selectedCalculations[0].calculationDate
        );
      const localizedCalculationDateForSecondMaterialDesignation =
        this.localeService.localizeDate(
          selectedCalculations[1].calculationDate
        );

      this.firstMaterialDesignation = `${this.comparison.summary.firstMaterialDesignation} ${selectedCalculations[0].costType}@${localizedCalculationDateForFirstMaterialDesignation}`;
      this.secondMaterialDesignation = `${this.comparison.summary.secondMaterialDesignation} ${selectedCalculations[1].costType}@${localizedCalculationDateForSecondMaterialDesignation}`;
    } else {
      this.firstMaterialDesignation =
        this.comparison.summary.firstMaterialDesignation;
      this.secondMaterialDesignation =
        this.comparison.summary.secondMaterialDesignation;
    }

    this.comparison.summary.costDifferences =
      this.comparison.summary.costDifferences.map((costDifference) => ({
        ...costDifference,
        title: this.transloco.translate(
          `compare.summary.common.${toCamelCase(costDifference.type)}`
        ),
      }));
  }

  populateOptions(): void {
    let id = 0;
    this.comparison.details.forEach((detail) => {
      this.stringOptions.push({
        id,
        title: detail.title,
      } as StringOption);
      id += 1;
    });

    this.invariantStringOptions = this.stringOptions;
  }

  ngOnDestroy(): void {
    this.comparisonSubscription?.unsubscribe();
    this.isLoadingSubscription?.unsubscribe();
    this.errorMessageSubscription?.unsubscribe();
    this.valueChangesSubscription?.unsubscribe();
    this.areBomItemsValidForComparisonSubscription?.unsubscribe();
  }

  onChartInit(ec: ECharts): void {
    this.echartsInstance = ec;
  }

  onSearchUpdated(search: string): void {
    const filteredOptions = this.invariantStringOptions.filter(
      (option) =>
        option.title.toLowerCase().includes(search.toLowerCase()) &&
        !this.selectedStringOptions.some(
          (selectedOption) => selectedOption.title === option.title
        )
    );

    this.stringOptions = [...this.selectedStringOptions, ...filteredOptions];
  }

  onOptionSelected(options: StringOption | StringOption[]): void {
    const optionsArray = Array.isArray(options) ? options : [options];

    this.selectedDetails =
      options && optionsArray.length > 0
        ? this.invariantDetails.filter((detail) =>
            optionsArray.some((option) => option.title === detail.title)
          )
        : this.invariantDetails;
  }

  onOpenedChange(change: boolean): void {
    if (change) {
      this.formControl.setValue(this.formControl.value, { emitEvent: false });
    } else {
      const removedDuplicates = this.stringOptions.filter(
        (option) =>
          !this.selectedStringOptions.some(
            (selectedOption) => selectedOption.id === option.id
          )
      );

      this.stringOptions = [
        ...this.selectedStringOptions,
        ...removedDuplicates,
      ];

      this.comparisonChart.filterCostTypes(
        this.selectedStringOptions.map((option) => option.title)
      );

      this.details =
        this.selectedDetails.length > 0
          ? this.selectedDetails
          : this.invariantDetails;
    }
  }

  pickTemplate(side: 'left' | 'right'): TemplateRef<any> {
    switch (side) {
      case 'left': {
        if (this.errorMessage !== undefined && this.errorMessage !== '') {
          return this.leftErrorTemplate;
        }
        if (!this.comparison?.details && !this.comparison?.summary) {
          return this.leftNoDataTemplate;
        }

        return this.leftValidTemplate;
      }
      case 'right': {
        if (this.errorMessage !== undefined && this.errorMessage !== '') {
          return this.rightErrorTemplate;
        }
        if (!this.comparison?.details && !this.comparison?.summary) {
          return this.rightNoDataTemplate;
        }

        return this.rightValidTemplate;
      }
      default: {
        throw new Error(`Incorrect value passed ${side}`);
      }
    }
  }
}
