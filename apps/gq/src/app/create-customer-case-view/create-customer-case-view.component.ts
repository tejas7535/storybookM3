import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

import { ActiveCaseModule } from '@gq/core/store/active-case/active-case.module';
import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { CurrencyModule } from '@gq/core/store/currency/currency.module';
import { CreateCaseHeaderInformationComponent } from '@gq/shared/components/case-header-information/create-case-header-information/create-case-header-information.component';
import { HeaderInformationData } from '@gq/shared/components/case-header-information/models/header-information-data.interface';
import { AdditionalFiltersComponent } from '@gq/shared/components/case-material/additional-filters/additional-filters.component';
import { MaterialSelectionComponent } from '@gq/shared/components/case-material/material-selection/material-selection.component';
import {
  CASE_CREATION_TYPES,
  CaseCreationEventParams,
  EVENT_NAMES,
} from '@gq/shared/models/tracking/gq-events';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { TRANSLOCO_SCOPE } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

type typeAnimation = 'fade-in' | 'fade-out';

@Component({
  standalone: true,
  selector: 'gq-create-customer-case-view',
  templateUrl: './create-customer-case-view.component.html',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    SubheaderModule,
    MatIconModule,
    MatButtonModule,
    CreateCaseHeaderInformationComponent,
    PushPipe,
    CurrencyModule,
    ActiveCaseModule,
    SharedPipesModule,
    MaterialSelectionComponent,
    AdditionalFiltersComponent,
  ],
  providers: [
    { provide: TRANSLOCO_SCOPE, useValue: 'create-customer-case-view' },
  ],
})
export class CreateCustomerCaseViewComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);

  private readonly insightsService: ApplicationInsightsService = inject(
    ApplicationInsightsService
  );

  private readonly createCaseFacade = inject(CreateCaseFacade);
  private readonly headerInformationIsValidSubject$$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private readonly headerInformationHasChangesSubject$$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  animationType: typeAnimation = 'fade-in';
  displayHeader = true;

  headerInformationData: HeaderInformationData;

  headerInformationHasChanges$: Observable<boolean> =
    this.headerInformationHasChangesSubject$$.asObservable();
  headerInformationIsValid$: Observable<boolean> =
    this.headerInformationIsValidSubject$$.asObservable();

  createCaseButtonDisabled$: Observable<boolean> = combineLatest([
    this.headerInformationHasChanges$,
    this.headerInformationIsValid$,
    this.createCaseFacade.getCreateCustomerCaseDisabled$,
  ]).pipe(
    takeUntilDestroyed(this.destroyRef),
    map(
      ([hasChanges, isValid, customerDataInvalid]) =>
        !hasChanges || !isValid || customerDataInvalid
    )
  );

  createCase(): void {
    // fetch the data for case creation
    // and provide it to the create case facade
    this.insightsService.logEvent(EVENT_NAMES.CASE_CREATION_FINISHED, {
      type: CASE_CREATION_TYPES.FROM_CUSTOMER,
    } as CaseCreationEventParams);
    console.log('createCase');
  }

  ngAfterViewInit() {
    this.insightsService.logEvent(EVENT_NAMES.CASE_CREATION_STARTED, {
      type: CASE_CREATION_TYPES.MANUAL,
    } as CaseCreationEventParams);
  }

  toggleHeader() {
    this.displayHeader = !this.displayHeader;
  }

  backToCaseOverView(): void {
    this.animationType = 'fade-out';
    this.insightsService.logEvent(EVENT_NAMES.CASE_CREATION_CANCELLED, {
      type: CASE_CREATION_TYPES.FROM_CUSTOMER,
    } as CaseCreationEventParams);

    this.createCaseFacade.resetCaseCreationInformation();
  }

  handleHeaderInformationHasChanges(
    headerInformationHasChanges: boolean
  ): void {
    this.headerInformationHasChangesSubject$$.next(headerInformationHasChanges);
  }

  handleHeaderInformationIsValid(headerInformationIsValid: boolean): void {
    this.headerInformationIsValidSubject$$.next(headerInformationIsValid);
  }
  handleHeaderInformationData(headerInformation: HeaderInformationData): void {
    this.headerInformationData = headerInformation;
    console.log('headerInformationData', this.headerInformationData);
  }
}
