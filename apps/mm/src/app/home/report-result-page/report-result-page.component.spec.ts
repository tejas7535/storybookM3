import { waitForAsync } from '@angular/core/testing';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { BehaviorSubject } from 'rxjs';

import { CalculationResultFacade } from '@mm/core/store/facades/calculation-result.facade';
import { CalculationResultReportInput } from '@mm/core/store/models/calculation-result-report-input.model';
import {
  MountingTools,
  ReportMessages,
  ResultTypeConfig,
} from '@mm/core/store/models/calculation-result-state.model';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';

import { ResultReportComponent } from '@schaeffler/result-report';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { APP_STATE_MOCK } from '../../../testing/mocks/store/app-state.mock';
import { AdditionalToolsComponent } from './additional-tools/additional-tools.component';
import { HydraulicOrLockNutComponent } from './hydraulic-or-lock-nut/hydraulic-or-lock-nut.component';
import { MountingRecommendationComponent } from './mounting-recommendation/mounting-recommendation.component';
import { ReportPumpsComponent } from './report-pumps/report-pumps.component';
import { ReportResultPageComponent } from './report-result-page.component';
import { ReportSelectionComponent } from './report-selection/report-selection.component';

describe('ReportResultPageComponent', () => {
  let spectator: Spectator<ReportResultPageComponent>;
  let component: ReportResultPageComponent;

  const inputsSubject = new BehaviorSubject<CalculationResultReportInput[]>([]);
  const messagesSubject = new BehaviorSubject<ReportMessages>({
    notes: ['some note'],
    warnings: [],
    errors: [],
  });

  const mountingRecommendationsSubject = new BehaviorSubject<string[]>([]);
  const mountingToolsSubject = new BehaviorSubject<MountingTools>({
    additionalTools: [],
    hydraulicNut: [],
    pumps: { title: '', items: [] },
    locknut: [],
    sleeveConnectors: [],
  });

  const isResultAvailableSubject = new BehaviorSubject<boolean>(false);

  const selectionTypesSubject = new BehaviorSubject<ResultTypeConfig['name'][]>(
    ['mountingInstructions']
  );

  const createComponent = createComponentFactory({
    component: ReportResultPageComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MockComponent(ResultReportComponent),
      MockComponent(ReportPumpsComponent),
      MockComponent(AdditionalToolsComponent),
      MockComponent(HydraulicOrLockNutComponent),
      MockComponent(MountingRecommendationComponent),
      MockComponent(ReportSelectionComponent),
    ],
    providers: [
      provideMockStore({ initialState: { ...APP_STATE_MOCK } }),
      {
        provide: CalculationResultFacade,
        useValue: {
          getCalculationInputs$: inputsSubject.asObservable(),
          getCalculationMessages$: messagesSubject.asObservable(),
          isResultAvailable$: isResultAvailableSubject.asObservable(),
          mountingRecommendations$:
            mountingRecommendationsSubject.asObservable(),
          mountingTools$: mountingToolsSubject.asObservable(),
          reportSelectionTypes$: selectionTypesSubject.asObservable(),
          fetchCalculationResultResourcesLinks: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show loading spinner before data loads', () => {
    const spinner = spectator.query(MatProgressSpinner);

    expect(spinner).toBeTruthy();
  });

  describe('when data is loaded', () => {
    beforeEach(waitForAsync(() => {
      isResultAvailableSubject.next(true);
      spectator.detectChanges();
    }));

    it('should not show loading spinner', () => {
      const spinner = spectator.query(MatProgressSpinner);

      expect(spinner).toBeFalsy();
    });

    it('should have isResultAvailable$ observable overridden to true', (done) => {
      component.isResultAvailable$.subscribe((isAvailable) => {
        expect(isAvailable).toBe(true);

        const schaefflerResultReport = spectator.query(ResultReportComponent);
        const reportPumps = spectator.query(ReportPumpsComponent);
        const additionalTools = spectator.query(AdditionalToolsComponent);
        const hydraulicNut = spectator.query(HydraulicOrLockNutComponent);
        const mountingRecommendation = spectator.query(
          MountingRecommendationComponent
        );

        expect(schaefflerResultReport).toExist();
        expect(reportPumps).toExist();
        expect(additionalTools).toExist();
        expect(hydraulicNut).toExist();
        expect(mountingRecommendation).toExist();

        done();
      });
    });

    describe('when is loaded', () => {
      describe('should display calculation result report selection component', () => {
        let selectionComponent: ReportSelectionComponent;

        beforeEach(() => {
          selectionComponent = spectator.query(ReportSelectionComponent);
        });

        it('should display component', () => {
          expect(selectionComponent).toBeTruthy();
        });

        describe('when calculation type is clicked', () => {
          let scrollingSpy: any;
          const itemName = 'mountingInstructions';

          beforeEach(() => {
            scrollingSpy = {
              scrollIntoView: jest.fn(),
            } as unknown as any;

            jest
              .spyOn(document, 'querySelector')
              .mockImplementation(() => scrollingSpy);
          });

          afterEach(() => {
            jest.restoreAllMocks();
          });

          it('should scroll to the correct section', () => {
            selectionComponent['calculationTypeClicked'].emit(itemName);

            expect(document.querySelector).toHaveBeenCalledWith(`#${itemName}`);
            expect(scrollingSpy.scrollIntoView).toHaveBeenCalledWith({
              behavior: 'smooth',
              block: 'start',
            });
          });
        });
      });
    });
  });
});
