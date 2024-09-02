import { UntypedFormGroup } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { BehaviorSubject } from 'rxjs';

import { CalculationResultFacade } from '@mm/core/store/facades/calculation-result.facade';
import { CalculationResultReportInput } from '@mm/core/store/models/calculation-result-report-input.model';
import { ReportMessages } from '@mm/core/store/models/calculation-result-state.model';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';

import { ResultReportComponent } from '@schaeffler/result-report';

import { APP_STATE_MOCK } from '../../../testing/mocks/store/app-state.mock';
import { ReportResultPageComponent } from './report-result-page.component';

describe('ReportResultPageComponent', () => {
  let spectator: Spectator<ReportResultPageComponent>;
  let component: ReportResultPageComponent;
  let calculationResultFacade: CalculationResultFacade;

  const inputsSubject = new BehaviorSubject<CalculationResultReportInput[]>([]);
  const messagesSubject = new BehaviorSubject<ReportMessages>({
    notes: ['some note'],
    warnings: [],
    errors: [],
  });
  const isResultAvailableSubject = new BehaviorSubject<boolean>(false);

  const createComponent = createComponentFactory({
    component: ReportResultPageComponent,
    imports: [MockComponent(ResultReportComponent)],
    providers: [
      provideMockStore({ initialState: { ...APP_STATE_MOCK } }),
      {
        provide: CalculationResultFacade,
        useValue: {
          getCalculationInputs$: inputsSubject.asObservable(),
          getCalculationMessages$: messagesSubject.asObservable(),
          isResultAvailable$: isResultAvailableSubject.asObservable(),
          fetchCalculationResultResourcesLinks: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    calculationResultFacade = spectator.inject(CalculationResultFacade);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show loading spinner before data loads', () => {
    const spinner = spectator.query(MatProgressSpinner);

    expect(spinner).toBeTruthy();
  });

  describe('when data is loaded', () => {
    beforeEach(() => {
      isResultAvailableSubject.next(true);
      spectator.detectChanges();
    });

    it('should not show loading spinner', () => {
      const spinner = spectator.query(MatProgressSpinner);

      expect(spinner).toBeFalsy();
    });

    it('should have isResultAvailable$ observable overridden to true', (done) => {
      component.isResultAvailable$.subscribe((isAvailable) => {
        expect(isAvailable).toBe(true);

        const schaefflerResultReport = spectator.query(ResultReportComponent);

        expect(schaefflerResultReport).toBeTruthy();
        done();
      });
    });
  });

  describe('when onChanges is called', () => {
    it('should call fetchCalculationResultLinks', () => {
      const form: UntypedFormGroup = {
        getRawValue: jest.fn().mockReturnValue({
          objects: [
            {
              properties: [
                {
                  name: 'RSY_BEARING',
                  value: 'some series',
                },
                {
                  name: 'SOME_OTHER_NAME',
                  value: 'some other value',
                },
              ],
            },
          ],
        }),
      } as Partial<UntypedFormGroup> as UntypedFormGroup;

      spectator.setInput({
        form,
      });

      spectator.component.ngOnChanges({});

      expect(
        calculationResultFacade.fetchCalculationResultResourcesLinks
      ).toHaveBeenCalledWith({
        IDCO_DESIGNATION: 'some series',
        SOME_OTHER_NAME: 'some other value',
      });
    });
  });
});
