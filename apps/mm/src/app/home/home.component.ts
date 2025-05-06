/* eslint-disable @typescript-eslint/member-ordering */
import { CdkStepperModule, StepperSelectionEvent } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';

import { debounceTime } from 'rxjs';

import { detectAppDelivery } from '@mm/core/helpers/settings-helpers';
import { CalculationOptionsFacade } from '@mm/core/store/facades/calculation-options/calculation-options.facade';
import { CalculationSelectionFacade } from '@mm/core/store/facades/calculation-selection/calculation-selection.facade';
import { BearingSearchComponent } from '@mm/home/bearing-search/bearing-search.component';
import { AppStoreButtonsComponent } from '@mm/shared/components/app-store-buttons/app-store-buttons.component';
import { QualtricsInfoBannerComponent } from '@mm/shared/components/qualtrics-info-banner/qualtrics-info-banner.component';
import {
  AXIAL_BEARINGS_RESULT_STEP,
  BEARING_SEAT_STEP,
  BEARING_STEP,
  CALCULATION_OPTIONS_STEP,
  MEASURING_MOUNTING_STEP,
} from '@mm/shared/constants/steps';
import { AppDelivery } from '@mm/shared/models';
import { BearingSeatStepComponent } from '@mm/steps/bearing-seat-step/bearing-seat-step.component';
import { CalculationOptionsStepComponent } from '@mm/steps/calculation-options-step/calculation-options-step.component';
import { MeasuringAndMountingStepComponent } from '@mm/steps/measuring-and-mounting-step/measuring-and-mounting-step.component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ReportResultPageComponent } from './report-result-page/report-result-page.component';

@Component({
  templateUrl: './home.component.html',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    CdkStepperModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    BearingSearchComponent,
    BearingSeatStepComponent,
    MeasuringAndMountingStepComponent,
    CalculationOptionsStepComponent,
    QualtricsInfoBannerComponent,
    AppStoreButtonsComponent,
    ReportResultPageComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly selectionFacade = inject(CalculationSelectionFacade);
  private readonly optionsFacade = inject(CalculationOptionsFacade);

  readonly BEARING_STEP = BEARING_STEP;
  readonly BEARING_SEAT_STEP = BEARING_SEAT_STEP;
  readonly MEASURING_MOUNTING_STEP = MEASURING_MOUNTING_STEP;
  readonly CALCULATION_OPTIONS_STEP = CALCULATION_OPTIONS_STEP;
  readonly AXIAL_BEARINGS_RESULT_STEP = AXIAL_BEARINGS_RESULT_STEP;

  public readonly DEBOUNCE_TIME_DEFAULT = 0; // debounce time required for slider in Application to render properly at the first load.
  public isAppDeliveryEmbedded = detectAppDelivery() === AppDelivery.Embedded;
  selectedBearing = toSignal(this.selectionFacade.getBearing$());
  bearingSeats = toSignal(this.selectionFacade.bearingSeats$);
  selectedBearingOption = toSignal(this.selectionFacade.selectedBearingOption$);
  measurementMethods = toSignal(this.selectionFacade.measurementMethods$);
  mountingMethods = toSignal(this.selectionFacade.mountingMethods$);
  preflightData = toSignal(this.optionsFacade.getOptions$());
  isAxialBearing = toSignal(this.selectionFacade.isAxialDisplacement$());
  isLoading = toSignal(this.selectionFacade.isLoading$());

  steps = toSignal(this.selectionFacade.steps$);
  currentStep = toSignal(
    this.selectionFacade
      .getCurrentStep$()
      .pipe(debounceTime(this.DEBOUNCE_TIME_DEFAULT))
  );

  selectStep(_event: StepperSelectionEvent): void {
    const selectedIndex = _event.selectedIndex;
    this.selectCurrentStep(selectedIndex);
  }

  public selectBearing(id: string): void {
    this.selectionFacade.fetchBearingData(id);
  }

  public selectBearingSeatOption(bearingSeatId: string): void {
    if (this.bearingSeats().selectedValueId !== bearingSeatId) {
      this.selectionFacade.setBearingSeat(bearingSeatId);
    }

    this.selectCurrentStep(MEASURING_MOUNTING_STEP);
  }

  public selectMountingMethod(mountingMethod: string): void {
    this.selectionFacade.updateMountingMethodAndCurrentStep(mountingMethod);
  }

  public selectMeasurementMethod(measurementMethod: string): void {
    this.selectionFacade.setMeasurementMethod(measurementMethod);
  }

  private selectCurrentStep(step: number): void {
    this.selectionFacade.setCurrentStep(step);
  }
}
