/* eslint-disable @typescript-eslint/member-ordering */
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { CalculationResultFacade } from '@mm/core/store/facades/calculation-result.facade';
import { ResultTypeConfig } from '@mm/core/store/models/calculation-result-state.model';
import { LetDirective, PushPipe } from '@ngrx/component';

import { ResultReportComponent } from '@schaeffler/result-report';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AdditionalToolsComponent } from './additional-tools/additional-tools.component';
import { GridResultItemCardComponent } from './grid-result-item-card/grid-result-item-card.component';
import { HydraulicOrLockNutComponent } from './hydraulic-or-lock-nut/hydraulic-or-lock-nut.component';
import { MountingRecommendationComponent } from './mounting-recommendation/mounting-recommendation.component';
import { ReportPumpsComponent } from './report-pumps/report-pumps.component';
import { ReportSelectionComponent } from './report-selection/report-selection.component';
import { SleeveConnectorComponent } from './sleeve-connector/sleeve-connector.component';

@Component({
  selector: 'mm-report-result-page',
  templateUrl: './report-result-page.component.html',
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
    GridResultItemCardComponent,
  ],
})
export class ReportResultPageComponent {
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

  public readonly bearinxVersions$ =
    this.calculationResultFacade.bearinxVersions$;

  public startPositions = toSignal(
    this.calculationResultFacade.startPositions$
  );

  public radialClearance = toSignal(
    this.calculationResultFacade.radialClearance$
  );

  public clearanceClasses = toSignal(
    this.calculationResultFacade.radialClearanceClasses$
  );

  public endPositions = toSignal(this.calculationResultFacade.endPositions$);

  public importantStartPositions = computed(() =>
    this.startPositions().filter((position) => position.isImportant)
  );

  public nonImportantStartPositions = computed(() =>
    this.startPositions().filter((position) => !position.isImportant)
  );

  public importantEndPositions = computed(() =>
    this.endPositions().filter((position) => position.isImportant)
  );

  public nonImportantEndPositions = computed(() =>
    this.endPositions().filter((position) => !position.isImportant)
  );

  constructor(
    private readonly calculationResultFacade: CalculationResultFacade
  ) {}

  scrollIntoView(itemName: ResultTypeConfig['name']) {
    const scrollOptions: ScrollIntoViewOptions = {
      behavior: 'smooth',
      block: 'start',
    };
    document.querySelector(`#${itemName}`)?.scrollIntoView(scrollOptions);
  }
}
