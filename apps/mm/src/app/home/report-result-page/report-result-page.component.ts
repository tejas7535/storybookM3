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
import { RawValue, RawValueContent } from '@mm/shared/models';
import { PushPipe } from '@ngrx/component';

import { ResultReportComponent } from '@schaeffler/result-report';

@Component({
  selector: 'mm-report-result-page',
  templateUrl: './report-result-page.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PushPipe, ResultReportComponent, MatProgressSpinner],
})
export class ReportResultPageComponent implements OnChanges {
  @Input() public form: UntypedFormGroup;

  public readonly inputs$ = this.calculationResultFacade.getCalculationInputs$;

  public readonly messages$ =
    this.calculationResultFacade.getCalulationMessages$;

  public readonly isResultAvailable$ =
    this.calculationResultFacade.isResultAvailable$;

  constructor(
    private readonly calculationResultFacade: CalculationResultFacade
  ) {}

  ngOnChanges(_changes: SimpleChanges): void {
    this.fetchCalculationResultLinks(this.form);
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
