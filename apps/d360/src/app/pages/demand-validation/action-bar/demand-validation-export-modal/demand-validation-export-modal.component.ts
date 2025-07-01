/* eslint-disable max-lines */
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import {
  MatStepperModule,
  StepperOrientation,
} from '@angular/material/stepper';

import { filter, map, Observable, take, tap } from 'rxjs';

import { translate, TranslocoService } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';
import { addMonths } from 'date-fns';
import { v4 as uuid } from 'uuid';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DemandValidationService } from '../../../../feature/demand-validation/demand-validation.service';
import { DemandValidationFilter } from '../../../../feature/demand-validation/demand-validation-filters';
import {
  DateRanges,
  KpiDateRanges,
  SelectedKpis,
  SelectedKpisAndMetadata,
} from '../../../../feature/demand-validation/model';
import { PlanningView } from '../../../../feature/demand-validation/planning-view';
import {
  defaultMonthlyPeriodTypeOption,
  defaultPeriodTypes,
  fillGapBetweenRanges,
} from '../../../../feature/demand-validation/time-range';
import { CustomerEntry } from '../../../../feature/global-selection/model';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import * as LANG from '../../../../shared/constants/language';
import { ValidateForm } from '../../../../shared/decorators';
import {
  DemandValidationExport,
  DemandValidationUserSettingsKey,
  UserSettingsKey,
} from '../../../../shared/models/user-settings.model';
import { UserService } from '../../../../shared/services/user.service';
import { toNativeDate } from '../../../../shared/utils/date-format';
import {
  DateRangePeriod,
  DateRangePeriodType,
} from '../../../../shared/utils/date-range';
import { isEqual } from '../../../../shared/utils/validation/data-validation';
import { ValidationHelper } from '../../../../shared/utils/validation/validation-helper';
import { DemandValidationDatePickerComponent } from '../demand-validation-date-picker/demand-validation-date-picker.component';
import { DemandValidationLoadingModalComponent } from '../demand-validation-loading-modal/demand-validation-loading-modal.component';

export interface DemandValidationExportModalProps {
  customerData: CustomerEntry[];
  dateRanges: KpiDateRanges;
  demandValidationFilters: DemandValidationFilter;
}

enum AdditionalProps {
  CustomerInformation = 'CustomerInformation',
  ContactPerson = 'ContactPerson',
  MaterialInformation = 'MaterialInformation',
  SupplyChain = 'SupplyChain',
}

@Component({
  selector: 'd360-demand-validation-export-modal',
  imports: [
    CommonModule,
    DemandValidationDatePickerComponent,
    MatButton,
    MatDialogActions,
    MatDialogModule,
    MatDivider,
    MatFormFieldModule,
    MatIcon,
    MatIconButton,
    MatInputModule,
    MatRadioModule,
    MatSlideToggle,
    MatStepperModule,
    PushPipe,
    ReactiveFormsModule,
    SharedTranslocoModule,
  ],
  templateUrl: './demand-validation-export-modal.component.html',
  styleUrl: './demand-validation-export-modal.component.scss',
})
export class DemandValidationExportModalComponent implements OnInit {
  private readonly maxWidthBreakpoints = {
    [LANG.AVAILABLE_LANGUAGE_DE.id]: '1470px',
    [LANG.AVAILABLE_LANGUAGE_EN.id]: '1400px',
    [LANG.AVAILABLE_LANGUAGE_ES.id]: '1570px',
    [LANG.AVAILABLE_LANGUAGE_FR.id]: '1680px',
    [LANG.AVAILABLE_LANGUAGE_IT.id]: '1540px',
    [LANG.AVAILABLE_LANGUAGE_PT.id]: '1600px',
    [LANG.AVAILABLE_LANGUAGE_ZH.id]: '1100px',
    default: '1680px',
  };
  private readonly maxHeightBreakpoints = '940px';

  private readonly dialog = inject(MatDialog);
  private readonly translocoService = inject(TranslocoService);
  private readonly demandValidationService = inject(DemandValidationService);
  protected readonly dialogRef: MatDialogRef<DemandValidationExportModalComponent> =
    inject(MatDialogRef<DemandValidationExportModalComponent>);
  protected readonly data: DemandValidationExportModalProps =
    inject(MAT_DIALOG_DATA);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly breakpointObserver: BreakpointObserver =
    inject(BreakpointObserver);
  private readonly userService: UserService = inject(UserService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  private get breakpoint(): string {
    return (
      this.maxWidthBreakpoints[this.translocoService.getActiveLang()] ||
      this.maxWidthBreakpoints.default
    );
  }

  protected stepperOrientation$: Observable<StepperOrientation> =
    this.breakpointObserver
      .observe(
        `(max-width: ${this.breakpoint}) or (max-height: ${this.maxHeightBreakpoints})`
      )
      .pipe(
        map(({ matches }) => (matches ? 'vertical' : 'horizontal')),
        takeUntilDestroyed()
      );

  protected readonly PlanningView = PlanningView;
  protected readonly AdditionalProps = AdditionalProps;
  protected periodTypeOptions = defaultPeriodTypes;

  protected readonly toggleTypes: {
    type: PlanningView | AdditionalProps;
    data: SelectedKpisAndMetadata[][];
  }[] = [
    {
      type: PlanningView.REQUESTED,
      data: [
        [
          SelectedKpisAndMetadata.Deliveries,
          SelectedKpisAndMetadata.FirmBusiness,
          SelectedKpisAndMetadata.ForecastProposal,
          SelectedKpisAndMetadata.ForecastProposalDemandPlanner,
          SelectedKpisAndMetadata.ValidatedForecast,
          SelectedKpisAndMetadata.DemandRelevantSales,
        ],
        [
          SelectedKpisAndMetadata.OnTopOrder,
          SelectedKpisAndMetadata.OnTopCapacityForecast,
          SelectedKpisAndMetadata.SalesAmbition,
          SelectedKpisAndMetadata.Opportunities,
          SelectedKpisAndMetadata.SalesPlan,
        ],
      ],
    },
    {
      type: PlanningView.CONFIRMED,
      data: [
        [
          SelectedKpisAndMetadata.ConfirmedDeliveries,
          SelectedKpisAndMetadata.ConfirmedFirmBusiness,
          SelectedKpisAndMetadata.ConfirmedDemandRelevantSales,
          SelectedKpisAndMetadata.ConfirmedOnTopOrder,
        ],
        [
          SelectedKpisAndMetadata.ConfirmedOnTopCapacityForecast,
          SelectedKpisAndMetadata.ConfirmedSalesAmbition,
          SelectedKpisAndMetadata.ConfirmedOpportunities,
          SelectedKpisAndMetadata.ConfirmedSalesPlan,
        ],
      ],
    },
    {
      type: AdditionalProps.CustomerInformation,
      data: [
        [
          SelectedKpisAndMetadata.Region,
          SelectedKpisAndMetadata.SalesArea,
          SelectedKpisAndMetadata.SalesOrg,
          SelectedKpisAndMetadata.MainCustomerNumber,
          SelectedKpisAndMetadata.MainCustomerName,
          SelectedKpisAndMetadata.CustomerCountry,
          SelectedKpisAndMetadata.Sector,
        ],
        [
          SelectedKpisAndMetadata.SectorManagement,
          SelectedKpisAndMetadata.CustomerClassification,
          SelectedKpisAndMetadata.GKAMNumber,
          SelectedKpisAndMetadata.GKAMName,
          SelectedKpisAndMetadata.SubKeyAccount,
          SelectedKpisAndMetadata.SubKeyAccountName,
        ],
      ],
    },
    {
      type: AdditionalProps.ContactPerson,
      data: [
        [
          SelectedKpisAndMetadata.AccountOwner,
          SelectedKpisAndMetadata.InternalSales,
          SelectedKpisAndMetadata.DemandPlanner,
        ],
        [SelectedKpisAndMetadata.GKAM, SelectedKpisAndMetadata.KAM],
      ],
    },
    {
      type: AdditionalProps.MaterialInformation,
      data: [
        [
          SelectedKpisAndMetadata.CustomerMaterialNumber,
          SelectedKpisAndMetadata.PackagingSize,
          SelectedKpisAndMetadata.MaterialClassification,
          SelectedKpisAndMetadata.SupplyConcept,
          SelectedKpisAndMetadata.PortfolioStatus,
          SelectedKpisAndMetadata.PortfolioStatusDate,
          SelectedKpisAndMetadata.DemandCharacteristic,
          SelectedKpisAndMetadata.SuccessorMaterialCustomer,
          SelectedKpisAndMetadata.SuccessorCustomerMaterialDescription,
          SelectedKpisAndMetadata.SuccessorCustomerMaterialPackagingSize,
          SelectedKpisAndMetadata.SuccessorSchaefflerMaterial,
          SelectedKpisAndMetadata.SuccessorSchaefflerMaterialDescription,
          SelectedKpisAndMetadata.SuccessorSchaefflerMaterialPackagingSize,
        ],
        [
          SelectedKpisAndMetadata.ProductLine,
          SelectedKpisAndMetadata.ProductLineText,
          SelectedKpisAndMetadata.ProductCluster,
          SelectedKpisAndMetadata.Gpsd,
          SelectedKpisAndMetadata.GpsdName,
          SelectedKpisAndMetadata.MaterialNumberS4,
          SelectedKpisAndMetadata.ForecastMaintained,
          SelectedKpisAndMetadata.ForecastValidatedAt,
          SelectedKpisAndMetadata.ForecastValidatedBy,
          SelectedKpisAndMetadata.ForecastValidatedFrom,
          SelectedKpisAndMetadata.ForecastValidatedTo,
        ],
      ],
    },
    {
      type: AdditionalProps.SupplyChain,
      data: [
        [
          SelectedKpisAndMetadata.ProductionPlant,
          SelectedKpisAndMetadata.ProductionPlantName,
          SelectedKpisAndMetadata.ProductionSegment,
          SelectedKpisAndMetadata.ProductionLine,
          // TODO: uncomment when frozen zone is returned by SAP, see D360-454, will be implemented with https://jira.schaeffler.com/browse/D360-163
          // SelectedKpisAndMetadata.FrozenZone,
        ],
        [
          SelectedKpisAndMetadata.CurrentRLTSchaeffler,
          SelectedKpisAndMetadata.DeliveryPlant,
          SelectedKpisAndMetadata.PlanningPlant,
          SelectedKpisAndMetadata.MrpGroup,
        ],
      ],
    },
  ];

  protected formGroup: FormGroup = this.formBuilder.group<
    SelectedKpis & DateRanges
  >(
    {
      // Column toggles
      [SelectedKpisAndMetadata.ActiveAndPredecessor]: false,
      ...this.getSelectedKpisAndMetadata(),

      // dates
      ...this.getDates(),
    },
    {
      validators: [
        this.crossFieldValidator('startDatePeriod1', 'endDatePeriod1'),
        this.crossFieldValidator('startDatePeriod2', 'endDatePeriod2'),
        (formGroup: AbstractControl) => {
          this.handleActiveAndPredecessor(formGroup);

          return [
            ...this.toggleTypes
              .find((toggle) => toggle.type === PlanningView.REQUESTED)
              .data.flat(),
            ...this.toggleTypes
              .find((toggle) => toggle.type === PlanningView.CONFIRMED)
              .data.flat(),
          ].some((kpi) => formGroup.get(kpi)?.value)
            ? null
            : { atLeastOneKpiRequired: true };
        },
      ],
    }
  );

  private isUpdatingActiveAndPredecessor = false;

  protected initialTemplates: WritableSignal<DemandValidationExport[]> = signal(
    []
  );
  protected templates: WritableSignal<DemandValidationExport[]> = signal([]);

  protected readonly maxAllowedTemplates: number = 5;
  protected readonly newId: string = 'new';

  protected get isNewAllowed(): boolean {
    return (
      this.templates().length < this.maxAllowedTemplates &&
      this.templates().filter((template) => template.id === this.newId)
        .length === 0
    );
  }

  public ngOnInit(): void {
    this.applyInitialTemplate();
  }

  protected deleteTemplate(id: string): void {
    let templates = this.templates().map((template) => ({ ...template }));
    templates = templates.filter((template) => template.id !== id);
    this.templates.set(templates);
    this.handleActiveTemplate();
  }

  protected onTemplateChange(id: string, title: string): void {
    const initials = this.initialTemplates();
    // eslint-disable-next-line unicorn/no-useless-spread
    let templates = [...this.templates().map((template) => ({ ...template }))];

    // delete new templates, if we have an id
    templates = templates.filter((template) => template.id !== this.newId);

    templates.forEach((template) => {
      template.active = false;
      template.title = initials.find((l) => l.id === template.id)?.title || '';

      if (template.id === id) {
        template.title = title;
        template.active = true;
      }
    });

    if (id === this.newId) {
      templates.push({
        id: this.newId,
        title,
        active: true,
        selectedKpisAndMetadata: this.toggleTypes
          .find((toggle) => toggle.type === PlanningView.REQUESTED)
          .data.flat(),
      });
    }

    this.templates.set(templates);
    this.handleActiveTemplate();
  }

  protected handleActiveAndPredecessor(formGroup: AbstractControl): boolean {
    // If we're already updating the control, just return the current state
    if (this.isUpdatingActiveAndPredecessor) {
      return (
        formGroup.get(SelectedKpisAndMetadata.ActiveAndPredecessor)?.enabled ??
        false
      );
    }

    const isAllowed: boolean = [
      SelectedKpisAndMetadata.Deliveries,
      SelectedKpisAndMetadata.FirmBusiness,
      SelectedKpisAndMetadata.ConfirmedDeliveries,
      SelectedKpisAndMetadata.ConfirmedFirmBusiness,
    ].some((kpi) => formGroup.get(kpi)?.value);

    const control = formGroup.get(SelectedKpisAndMetadata.ActiveAndPredecessor);

    try {
      this.isUpdatingActiveAndPredecessor = true;

      if (isAllowed) {
        control?.enable({ emitEvent: false, onlySelf: true });
      } else {
        control?.setValue(false, { emitEvent: false, onlySelf: true });
        control?.disable({ emitEvent: false, onlySelf: true });
      }
    } finally {
      this.isUpdatingActiveAndPredecessor = false;
    }

    return isAllowed;
  }

  private getSelectedKpisAndMetadata(): SelectedKpis {
    const initialState: Partial<SelectedKpis> = {};

    for (const toggle of this.toggleTypes) {
      // Flatten the 2D array and set each KPI to the default value
      toggle.data.flat().forEach((kpiType) => {
        initialState[kpiType] = this.isAllowedToggleSection(
          [PlanningView.REQUESTED],
          toggle
        );
      });
    }

    return initialState as SelectedKpis;
  }

  private getDates(): DateRanges {
    return {
      startDatePeriod1: [
        this.data.dateRanges.range1.from,
        [Validators.required],
      ],
      endDatePeriod1: [this.data.dateRanges.range1.to, [Validators.required]],
      periodType1:
        this.periodTypeOptions.find(
          (periodType) => periodType.id === this.data.dateRanges.range1.period
        ) || defaultMonthlyPeriodTypeOption,
      startDatePeriod2:
        this.data.dateRanges.range2?.from ||
        addMonths(this.data.dateRanges.range1.to, 1),
      endDatePeriod2: this.data.dateRanges?.range2?.to,
      periodType2:
        this.periodTypeOptions.find(
          (periodType) =>
            periodType.id ===
            (this.data.dateRanges?.range2?.period || DateRangePeriod.Monthly)
        ) || defaultMonthlyPeriodTypeOption,
    };
  }

  protected isAllowedToggleSection(
    views: (PlanningView | AdditionalProps)[],
    toggle: { type: PlanningView | AdditionalProps }
  ): boolean {
    return views.includes(toggle.type);
  }

  @ValidateForm('formGroup')
  protected handleExcelExport() {
    if (this.formGroup.invalid) {
      return;
    }

    const selectedKpisAndMetadata: SelectedKpis = this.formGroup.getRawValue();

    const filledRange = fillGapBetweenRanges(
      {
        from: toNativeDate(this.formGroup.controls.startDatePeriod1.value),
        to: toNativeDate(this.formGroup.controls.endDatePeriod1.value),
        period: this.formGroup.controls.periodType1.value
          .id as DateRangePeriodType,
      },
      {
        from: toNativeDate(this.formGroup.controls.startDatePeriod2.value),
        to: toNativeDate(this.formGroup.controls.endDatePeriod2.value),
        period: this.formGroup.controls.periodType2.value
          .id as DateRangePeriodType,
      }
    );

    if (filledRange) {
      const hasNewTemplate = this.templates().some(
        (template) => template.id === this.newId
      );

      this.templates.update((templates) =>
        templates.map((template) => {
          if (template.active && template.id !== this.newId) {
            template.selectedKpisAndMetadata = Object.entries(
              selectedKpisAndMetadata
            )
              .filter(([_, value]) => [true].includes(value))
              .map(([key]) => key) as SelectedKpisAndMetadata[];
          }

          return template;
        })
      );

      if (
        isEqual(this.templates(), this.initialTemplates()) ||
        hasNewTemplate
      ) {
        if (hasNewTemplate) {
          this.saveTemplates(selectedKpisAndMetadata);
        }

        // If the templates have not changed, directly start the export
        this.startExport(selectedKpisAndMetadata, filledRange);
      } else {
        // If the templates have changed, show a confirmation dialog
        this.dialog
          .open(ConfirmationDialogComponent, {
            data: {
              description: translate(
                'validation_of_demand.exportModal.templateChanged'
              ),
            },
            disableClose: true,
            width: '600px',
          })
          .afterClosed()
          .pipe(
            take(1),
            tap((wasConfirmed: boolean) => {
              // If the user confirmed save settings and
              if (wasConfirmed) {
                this.saveTemplates(selectedKpisAndMetadata);
              }

              // start the export
              this.startExport(selectedKpisAndMetadata, filledRange);
            }),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe();
      }
    }
  }

  private saveTemplates(selectedKpisAndMetadata: SelectedKpis): void {
    this.userService.updateDemandValidationUserSettings(
      DemandValidationUserSettingsKey.Exports,
      this.templates().map((template) => ({
        ...template,
        // Remove the newId from the templates, if it exists
        id: template.id === this.newId ? uuid() : template.id,
        selectedKpisAndMetadata: Object.entries(selectedKpisAndMetadata)
          .filter(([_, value]) => [true].includes(value))
          .map(([key]) => key) as SelectedKpisAndMetadata[],
      }))
    );
  }

  private startExport(
    selectedKpisAndMetadata: SelectedKpis,
    filledRange: KpiDateRanges
  ): void {
    this.dialog.open(DemandValidationLoadingModalComponent, {
      data: {
        onInit: () =>
          this.demandValidationService.triggerExport(
            selectedKpisAndMetadata,
            filledRange,
            this.data.demandValidationFilters
          ),
        onClose: () => this.dialogRef.close(),
        textWhileLoading: translate(
          'validation_of_demand.exportModal.inProgress'
        ),
      },
      disableClose: true,
      autoFocus: false,
    });
  }

  private crossFieldValidator(
    startDateControlName: string,
    endDateControlName: string
  ): ValidatorFn {
    return (formGroup: AbstractControl) =>
      ValidationHelper.getStartEndDateValidationErrors(
        formGroup as FormGroup,
        true,
        startDateControlName,
        endDateControlName
      );
  }

  /**
   * Removes the prefix "confirmed" from the input string and transforms the remaining string.
   *
   * @param {string} confirmedToggleType - The input string starting with "confirmed".
   * @returns {string} - The transformed string without the prefix.
   *
   * @example
   *
   * removeConfirmedPrefix("confirmedBusiness"); // returns "business"
   */
  protected translateConfirmedToggleType(
    confirmedToggleType: SelectedKpisAndMetadata
  ): string {
    const prefix = 'confirmed';
    const withoutPrefix = String(confirmedToggleType).slice(prefix.length);

    // Convert the first character of the remaining string to lowercase
    const firstChar = withoutPrefix.charAt(0).toLowerCase();
    const remainingChars = withoutPrefix.slice(1);

    const translationKey = firstChar + remainingChars;

    return translate(`validation_of_demand.menu_item.${translationKey}`);
  }

  private applyInitialTemplate(): void {
    this.userService.settingsLoaded$
      .pipe(
        filter((loaded: boolean) => loaded),
        take(1),
        map(
          () =>
            this.userService.userSettings()?.[
              UserSettingsKey.DemandValidation
            ]?.[DemandValidationUserSettingsKey.Exports] ?? []
        ),
        tap((templates) => {
          // copy the initial templates to avoid mutating the original array
          this.initialTemplates.set(
            [...(templates || [])].map((template) => ({
              ...template,
            }))
          );
          this.templates.set(templates || []);

          this.handleActiveTemplate();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private handleActiveTemplate(): void {
    if (this.templates().length === 0) {
      this.templates.set([
        {
          id: this.newId,
          title: translate('validation_of_demand.exportModal.newTemplate'),
          active: true,
          selectedKpisAndMetadata: this.toggleTypes
            .find((toggle) => toggle.type === PlanningView.REQUESTED)
            .data.flat(),
        },
      ]);
    }

    const templates = this.templates();
    let activeTemplate = templates.find((template) => template.active);

    if (!activeTemplate && templates.length > 0) {
      // If no active template is found, set the first one as active
      activeTemplate = templates[0];
      activeTemplate.active = true;

      this.userService.updateDemandValidationUserSettings(
        DemandValidationUserSettingsKey.Exports,
        templates
      );
    }

    if (activeTemplate) {
      const values: Record<keyof (SelectedKpis & DateRanges), any> =
        {} as Record<keyof (SelectedKpis & DateRanges), any>;

      Object.entries(this.formGroup.getRawValue()).forEach(([key, value]) => {
        values[key as keyof (SelectedKpis & DateRanges)] = [
          false,
          true,
        ].includes(value as boolean)
          ? false
          : value;
      });

      this.formGroup.patchValue({
        ...values,
        // eslint-disable-next-line unicorn/no-array-reduce
        ...activeTemplate?.selectedKpisAndMetadata?.reduce(
          (acc, column) => ({ ...acc, [column]: true }),
          {}
        ),
      });
    }
    this.formGroup.updateValueAndValidity();
    this.formGroup.markAsPristine();
    this.formGroup.markAsUntouched();
  }
}
