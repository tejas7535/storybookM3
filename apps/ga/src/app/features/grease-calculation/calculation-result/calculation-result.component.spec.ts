import { signal } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { translate, TranslocoService } from '@jsverse/transloco';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { CalculationParametersFacade, SettingsFacade } from '@ga/core/store';
import {
  fetchBearinxVersions,
  getCalculation,
} from '@ga/core/store/actions/calculation-result/calculation-result.actions';
import { ENV, getEnv } from '@ga/environments/environments.provider';
import { MediasButtonComponent } from '@ga/shared/components/medias-button';
import { PartnerVersion } from '@ga/shared/models';

import { ApplicationScenario } from '../calculation-parameters/constants/application-scenarios.model';
import { GreaseCalculationPath } from '../grease-calculation-path.enum';
import { CalculationResultComponent } from './calculation-result.component';
import { GreasePDFSelectionService } from './services/grease-pdf-select.service';
import { PdfGenerationService } from './services/pdf/pdf-generation.service';

describe('CalculationResultComponent', () => {
  let component: CalculationResultComponent;
  let spectator: Spectator<CalculationResultComponent>;
  let store: MockStore;
  let translocoService: TranslocoService;

  const createComponent = createComponentFactory({
    component: CalculationResultComponent,
    imports: [
      RouterTestingModule,
      PushPipe,
      LetDirective,
      FormsModule,
      provideTranslocoTestingModule(
        { en: {} },
        { translocoConfig: { defaultLang: 'de' } }
      ),
      MediasButtonComponent,

      // UI Modules
      MockModule(SubheaderModule),
      MockModule(MatIconModule),
      MockModule(MatProgressSpinnerModule),
      MockModule(MatSlideToggleModule),
      MockModule(MatTooltipModule),
    ],
    providers: [
      provideMockStore({
        initialState: {
          calculationResult: {},
        },
      }),
      {
        provide: translate,
        useValue: jest.fn(),
      },

      mockProvider(SettingsFacade),
      mockProvider(PdfGenerationService),
      { provide: ENV, useValue: { ...getEnv(), production: false } },
      {
        provide: CalculationParametersFacade,
        useValue: {
          selectedGreaseApplication$: of(ApplicationScenario.All),
        },
      },
      mockProvider(GreasePDFSelectionService, {
        selectionMode: jest.fn(() => false),
        selectedSet: signal(new Set()),
        isSelected: jest.fn(() => true),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    translocoService = spectator.inject(TranslocoService);
    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when partner version is available', () => {
    beforeEach(() => {
      component.partnerVersion$ = of(PartnerVersion.Schmeckthal);
    });

    it('should provide value to medias button component', () => {
      spectator.detectChanges();
      expect(spectator.query(MediasButtonComponent).partnerVersion).toBe(
        PartnerVersion.Schmeckthal
      );
    });
  });

  describe('ngOnInit', () => {
    it('should dispatch action', () => {
      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith(fetchBearinxVersions());
      expect(store.dispatch).toHaveBeenCalledWith(getCalculation());
    });

    it('should reset the report urls and dispatch fetch action on language change', (done) => {
      translocoService.getActiveLang = jest.fn(() => 'es');

      component.ngOnInit();

      translocoService.langChanges$.subscribe(() => {
        expect(component.reportUrls).toBe(undefined);
        expect(store.dispatch).toHaveBeenCalledWith(getCalculation());

        done();
      });
    });
  });

  describe('navigateBack', () => {
    it('should navigate to bearing selection', () => {
      component['router'].navigate = jest.fn();

      component.navigateBack();

      expect(component['router'].navigate).toHaveBeenCalledWith([
        `${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ParametersPath}`,
      ]);
    });
  });

  describe('when generate pdf report', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      Object.defineProperty(component, 'greaseReport', {
        value: signal({
          subordinates: signal([{ indentifier: 'text' }]),
          legalNote: signal('some legal note'),
          greaseResultReport: () => ({
            greaseResult: [] as any,
            inputs: { subordinates: [] as any },
            errorWarningsAndNotes: {},
          }),
          automaticLubrication: signal(true),
        }),
        writable: false,
      });

      spy = jest.spyOn(component['pdfGenerationService'], 'generatePdf');
    });

    it('should generate pdf report with all contents', waitForAsync(async () => {
      await component.generateReport('bearing 123');
      expect(spy).toHaveBeenCalledWith({
        data: [{ subordinates: [] }, {}],
        legalNote: 'some legal note',
        reportTitle: 'de.calculationResult.title.main bearing 123',
        results: [],
        sectionSubTitle: 'de.calculationResult.title.247hint',
        versions: undefined,
      });
    }));
  });
});
