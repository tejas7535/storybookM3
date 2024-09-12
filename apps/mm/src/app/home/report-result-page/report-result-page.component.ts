import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { CalculationResultFacade } from '@mm/core/store/facades/calculation-result.facade';
import { CalculationParameters } from '@mm/core/store/models/calculation-parameters-state.model';
import { ResultTypeConfig } from '@mm/core/store/models/calculation-result-state.model';
import { RawValue, RawValueContent } from '@mm/shared/models';
import { LetDirective, PushPipe } from '@ngrx/component';

import { ResultReportComponent } from '@schaeffler/result-report';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AdditionalToolsComponent } from './additional-tools/additional-tools.component';
import { HydraulicOrLockNutComponent } from './hydraulic-or-lock-nut/hydraulic-or-lock-nut.component';
import { MountingRecommendationComponent } from './mounting-recommendation/mounting-recommendation.component';
import { ReportPumpsComponent } from './report-pumps/report-pumps.component';
import { ReportSelectionComponent } from './report-selection/report-selection.component';
import { SleeveConnectorComponent } from './sleeve-connector/sleeve-connector.component';

@Component({
  selector: 'mm-report-result-page',
  templateUrl: './report-result-page.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PushPipe,
    LetDirective,
    SharedTranslocoModule,
    MatProgressSpinner,
    ResultReportComponent,
    ReportPumpsComponent,
    AdditionalToolsComponent,
    HydraulicOrLockNutComponent,
    MountingRecommendationComponent,
    SleeveConnectorComponent,
    ReportSelectionComponent,
  ],
})
export class ReportResultPageComponent implements OnChanges {
  @Input() public form: UntypedFormGroup;

  public readonly inputs$ = this.calculationResultFacade.getCalculationInputs$;
  public readonly mountingRecommendations$ =
    this.calculationResultFacade.mountingRecommendations$;

  public readonly mountingTools$ = this.calculationResultFacade.mountingTools$;

  public readonly messages$ =
    this.calculationResultFacade.getCalulationMessages$;

  public readonly isResultAvailable$ =
    this.calculationResultFacade.isResultAvailable$;

  public readonly hasMountingTools$ =
    this.calculationResultFacade.hasMountingTools$;

  public readonly reportSelectionTypes$ =
    this.calculationResultFacade.reportSelectionTypes$;

  constructor(
    private readonly calculationResultFacade: CalculationResultFacade
  ) {}

  ngOnChanges(_changes: SimpleChanges): void {
    this.fetchCalculationResultLinks(this.form);
  }

  scrollIntoView(itemName: ResultTypeConfig['name']) {
    const scrollOptions: ScrollIntoViewOptions = {
      behavior: 'smooth',
      block: 'start',
    };
    document.querySelector(`#${itemName}`)?.scrollIntoView(scrollOptions);
  }

  private fetchCalculationResultLinks(form: UntypedFormGroup): void {
    const formProperties = form
      .getRawValue()
      // eslint-disable-next-line unicorn/no-array-reduce
      .objects[0].properties.reduce(
        (
          {
            dimension1: _dimension1,
            initialValue: _initialValue,
            ...prevEntry
          }: RawValue,
          { name, value }: RawValueContent
        ) => {
          const key = name === 'RSY_BEARING' ? 'IDCO_DESIGNATION' : name;

          return {
            ...prevEntry,
            [key]: value,
          };
        },
        {}
      );

    this.calculationResultFacade.fetchCalculationResultResourcesLinks(
      formProperties as CalculationParameters
    );
  }
}
