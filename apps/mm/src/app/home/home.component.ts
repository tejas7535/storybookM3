import { CdkStepperModule, StepperSelectionEvent } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
    CommonModule,
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
})
export class HomeComponent {
  public readonly DEBOUNCE_TIME_DEFAULT = 0; // debounce time required for slider in Application to render properly at the first load.
  public isAppDeliveryEmbedded = detectAppDelivery() === AppDelivery.Embedded;
  selectedBearing = toSignal(this.selectionFacade.getBearing$());
  bearingSeats = toSignal(this.selectionFacade.bearingSeats$);
  selectedBearingOption = toSignal(this.selectionFacade.selectedBearingOption$);
  measurementMethods = toSignal(this.selectionFacade.measurementMethods$);
  mountingMethds = toSignal(this.selectionFacade.mountingMethods$);
  preflighData = toSignal(this.optionsFacade.getOptions$());

  steps = toSignal(this.selectionFacade.steps$);
  currentStep = toSignal(
    this.selectionFacade.currentStep$.pipe(
      debounceTime(this.DEBOUNCE_TIME_DEFAULT)
    )
  );

  public readonly preflighData$ = this.optionsFacade.getOptions$();

  public constructor(
    private readonly selectionFacade: CalculationSelectionFacade,
    private readonly optionsFacade: CalculationOptionsFacade
  ) {}

  async selectStep(_event: StepperSelectionEvent): Promise<void> {
    const items = this.steps();

    const targetRoute = items.find(
      ({ index }) => index === _event.selectedIndex
    );

    if (!targetRoute.enabled) {
      return;
    }

    this.selectionFacade.setCurrentStep(targetRoute.index);
  }

  public selectBearing(id: string): void {
    this.selectionFacade.fetchBearingData(id);
  }

  public selectBearingSeatOption(bearingSeatId: string): void {
    if (this.bearingSeats().selectedValueId !== bearingSeatId) {
      this.selectionFacade.setBearingSeat(bearingSeatId);
    }

    this.selectionFacade.setCurrentStep(2);
  }

  public selectMountingMethod(mountingMethod: string): void {
    this.selectionFacade.updateMountingMethodAndCurrentStep(mountingMethod);
  }

  public selectMeasurementMethod(measurementMethod: string): void {
    this.selectionFacade.setMeasurementMethod(measurementMethod);
  }
}
