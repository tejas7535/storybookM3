import { CdkStepperModule, StepperSelectionEvent } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';

import { debounceTime, map } from 'rxjs';

import { CalculationOptionsFacade } from '@mm/core/store/facades/calculation-options/calculation-options.facade';
import { CalculationSelectionFacade } from '@mm/core/store/facades/calculation-selection/calculation-selection.facade';
import { GlobalFacade } from '@mm/core/store/facades/global/global.facade';
import { BearingSearchComponent } from '@mm/home/bearing-search/bearing-search.component';
import { AppStoreButtonsComponent } from '@mm/shared/components/app-store-buttons/app-store-buttons.component';
import { QualtricsInfoBannerComponent } from '@mm/shared/components/qualtrics-info-banner/qualtrics-info-banner.component';
import { BearingSeatStepComponent } from '@mm/steps/bearing-seat-step/bearing-seat-step.component';
import { CalculationOptionsStepComponent } from '@mm/steps/calculation-options-step/calculation-options-step.component';
import { ThermalHeatingCalculationOptionsComponent } from '@mm/steps/calculation-options-step/thermal-heating-calculation-options/thermal-heating-calculation-options.component';
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
    ThermalHeatingCalculationOptionsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mm-home',
})
export class HomeComponent {
  private readonly selectionFacade = inject(CalculationSelectionFacade);
  private readonly optionsFacade = inject(CalculationOptionsFacade);
  private readonly globalFacade = inject(GlobalFacade);

  public readonly DEBOUNCE_TIME_DEFAULT = 0; // debounce time required for slider in Application to render properly at the first load.
  public isAppDeliveryEmbedded = toSignal(
    this.globalFacade.appDeliveryEmbedded$
  );
  selectedBearing = toSignal(this.selectionFacade.getBearing$());
  bearingSeats = toSignal(this.selectionFacade.bearingSeats$);
  selectedBearingOption = this.selectionFacade.selectedBearingOption;
  measurementMethods = toSignal(this.selectionFacade.measurementMethods$);
  mountingMethods = toSignal(this.selectionFacade.mountingMethods$);
  preflightData = toSignal(this.optionsFacade.getOptions$());
  isAxialBearing = toSignal(this.selectionFacade.isAxialDisplacement$());
  isLoading = toSignal(this.selectionFacade.isLoading$());

  steps = toSignal(
    this.selectionFacade
      .getStepConfiguration$()
      .pipe(map((config) => config.steps))
  );
  currentStep = toSignal(
    this.selectionFacade
      .getCurrentStep$()
      .pipe(debounceTime(this.DEBOUNCE_TIME_DEFAULT))
  );

  bearingStepIndex = this.selectionFacade.bearingStepIndex;
  bearingSeatStepIndex = this.selectionFacade.bearingSeatStepIndex;
  measuringMountingStepIndex = this.selectionFacade.measuringMountingStepIndex;
  calculationOptionsStepIndex =
    this.selectionFacade.calculationOptionsStepIndex;
  resultStepIndex = this.selectionFacade.resultStepIndex;

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

    const nextStepIndex = this.measuringMountingStepIndex();
    if (nextStepIndex !== undefined) {
      this.selectCurrentStep(nextStepIndex);
    }
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
