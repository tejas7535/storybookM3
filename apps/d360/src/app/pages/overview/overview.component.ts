import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatSlideToggle } from '@angular/material/slide-toggle';

import { take } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { translate, TranslocoDirective } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { OpenFunction, Priority } from '../../feature/alerts/model';
import { ForecastChartComponent } from '../../feature/forecast-chart/components/forecast-chart/forecast-chart.component';
import { PeriodType } from '../../feature/forecast-chart/model';
import { CurrencyService } from '../../feature/info/currency.service';
import { GlobalSelectionState } from '../../shared/components/global-selection-criteria/global-selection-state.service';
import { SelectableValue } from '../../shared/components/inputs/autocomplete/selectable-values.utils';
import { DisplayFunctions } from '../../shared/components/inputs/display-functions.utils';
import { FilterDropdownComponent } from '../../shared/components/inputs/filter-dropdown/filter-dropdown.component';
import { PriorityDropdownComponent } from '../../shared/components/priority-dropdown/priority-dropdown.component';
import { StyledSectionComponent } from '../../shared/components/styled-section/styled-section.component';
import {
  OverviewPageSettingsKey,
  UserSettingsKey,
} from '../../shared/models/user-settings.model';
import { SelectableOptionsService } from '../../shared/services/selectable-options.service';
import { UserService } from '../../shared/services/user.service';
import { CustomerSalesPlanningGridComponent } from './components/customer-sales-planning-grid/customer-sales-planning-grid.component';
import {
  OverviewFilterComponent,
  OverviewFilterValue,
} from './components/overview-filter/overview-filter.component';
import { TaskPriorityGridComponent } from './components/task-priority-grid/task-priority-grid.component';

export enum CustomerSalesPlanningLayout {
  PreviousToCurrent = 'PreviousToCurrent',
  CurrentToNext = 'CurrentToNext',
}

@Component({
  selector: 'd360-overview',
  imports: [
    TranslocoDirective,
    TaskPriorityGridComponent,
    PriorityDropdownComponent,
    OverviewFilterComponent,
    PushPipe,
    LoadingSpinnerModule,
    FilterDropdownComponent,
    CustomerSalesPlanningGridComponent,
    MatSlideToggle,
    FormsModule,
    ReactiveFormsModule,
    ForecastChartComponent,
    MatDivider,
    StyledSectionComponent,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent implements OnInit {
  private readonly customerSalesPlanningGrid = viewChild(
    CustomerSalesPlanningGridComponent
  );
  protected readonly selectableOptionsService: SelectableOptionsService =
    inject(SelectableOptionsService);
  protected readonly DisplayFunctions = DisplayFunctions;
  protected readonly PeriodType = PeriodType;
  protected readonly OpenFunction = OpenFunction;
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected readonly currencyService: CurrencyService = inject(CurrencyService);
  protected readonly selectedCustomer: WritableSignal<SelectableValue> =
    signal<SelectableValue>(null);

  private readonly userService: UserService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);

  protected layouts = [
    {
      id: CustomerSalesPlanningLayout.PreviousToCurrent,
      text: translate('overview.yourCustomer.layout.previousToCurrent'),
    },
    {
      id: CustomerSalesPlanningLayout.CurrentToNext,
      text: translate('overview.yourCustomer.layout.currentToNext'),
    },
  ];
  protected yourCustomerForm = this.formBuilder.group<{
    layout: SelectableValue;
  }>({
    layout: this.layouts[0],
  });

  protected selectedPriorities = signal<Priority[]>(null);
  protected selectedLayout = signal<CustomerSalesPlanningLayout>(
    CustomerSalesPlanningLayout.PreviousToCurrent
  );
  protected isAssignedToMe = signal<boolean>(true);
  protected overviewFilterValue = signal<OverviewFilterValue>(null);
  protected gkamFilterIds: Signal<string[]> = computed(() =>
    this.overviewFilterValue()?.gkams?.map(
      (selectableGkam) => selectableGkam.id
    )
  );
  protected readonly globalSelection: Signal<GlobalSelectionState> =
    computed<GlobalSelectionState>(() => ({
      region: [],
      salesArea: [],
      sectorManagement: [],
      salesOrg: [],
      gkamNumber: this.overviewFilterValue()?.gkams || [],
      customerNumber: this.overviewFilterValue()?.customers || [],
      materialClassification: [],
      sector: [],
      materialNumber: [],
      productionPlant: [],
      productionSegment: [],
      alertType: [],
    }));

  protected customerFilterIds: Signal<string[]> = computed(() =>
    this.overviewFilterValue()?.customers?.map(
      (selectableCustomer) => selectableCustomer.id
    )
  );

  protected onLayoutSelectionChange(value: any) {
    this.selectedLayout.set(value?.id);
  }

  protected onOverviewFilterReset() {
    this.customerSalesPlanningGrid().resetSelection();
  }

  public ngOnInit(): void {
    this.userService.settingsLoaded$
      .pipe(
        filter((loaded: boolean) => loaded),
        take(1),
        tap(() => {
          const backendValue =
            this.userService.userSettings()[UserSettingsKey.OverviewPage]?.[
              OverviewPageSettingsKey.OnlyAssignedToMe
            ];

          // If user has no default settings, we configure true
          this.isAssignedToMe.set(backendValue ?? true);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected onAssignedToggleChange(newValue: boolean): void {
    this.isAssignedToMe.set(newValue);
    this.userService.updateUserSettings(UserSettingsKey.OverviewPage, {
      [OverviewPageSettingsKey.OnlyAssignedToMe]: newValue,
    });
  }
}
