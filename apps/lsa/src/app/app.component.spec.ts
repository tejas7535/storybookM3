import { CdkStepperModule, StepperSelectionEvent } from '@angular/cdk/stepper';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';
import { MockComponent, MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppComponent } from './app.component';
import { LsaStepperComponent } from './core/lsa-stepper/lsa-stepper.component';
import { LsaAppService } from './core/services/lsa-app.service';
import { RestService } from './core/services/rest.service';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  let component: AppComponent;
  let lsaAppService: LsaAppService;
  let restService: RestService;
  let translocoService: TranslocoService;
  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      MockModule(CdkStepperModule),
      MockModule(MatDividerModule),
      MockComponent(LsaStepperComponent),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      {
        provide: RestService,
        useValue: {
          getGreases: jest.fn(),
        },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
    });
    component = spectator.debugElement.componentInstance;
    lsaAppService = spectator.inject(LsaAppService);
    restService = spectator.inject(RestService);
    translocoService = spectator.inject(TranslocoService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    spectator.detectChanges();
    const title = spectator.query('h1').textContent.trim();
    expect(title).toContain('appTitle');
  });

  describe('when initialized', () => {
    let languageSelectionSpy: jest.SpyInstance;
    beforeEach(() => {
      languageSelectionSpy = jest.spyOn(translocoService, 'setActiveLang');
    });

    describe('when language is available', () => {
      beforeEach(() => {
        component.language = 'de';
      });

      it('should set provided language', () => {
        spectator.detectChanges();
        expect(languageSelectionSpy).toHaveBeenCalledWith('de');
      });
    });

    describe('when language is not available', () => {
      it('should set fallback language', () => {
        spectator.detectChanges();
        expect(languageSelectionSpy).toHaveBeenCalledWith('en');
      });
    });

    it('should fetch greases', () => {
      component.fetchGreases = jest.fn();

      component.ngOnInit();

      expect(component.fetchGreases).toHaveBeenCalled();
    });
  });

  describe('when stepper is initialized', () => {
    let stepper: LsaStepperComponent;

    beforeEach(() => {
      spectator.detectChanges();
      stepper = spectator.query(LsaStepperComponent);
    });
    it('should render lsa-stepper', () => {
      expect(stepper).toBeTruthy();
    });

    describe('when selection has been made', () => {
      let selectionChangeSpy: jest.SpyInstance;
      let completedStepSpy: jest.SpyInstance;

      beforeEach(() => {
        selectionChangeSpy = jest.spyOn(lsaAppService, 'setSelectedPage');
        completedStepSpy = jest.spyOn(lsaAppService, 'setCompletedStep');

        stepper.selectionChange.emit({
          selectedIndex: 1,
          previouslySelectedIndex: 0,
          selectedStep: undefined,
          previouslySelectedStep: undefined,
        });
        spectator.detectChanges();
      });

      it('should select page', () => {
        expect(selectionChangeSpy).toHaveBeenCalledWith(1);
      });

      it('should complete previous step', () => {
        expect(completedStepSpy).toHaveBeenCalledWith(0);
      });
    });
  });

  describe('selectionChanged', () => {
    it('should call setSelectedPage and setCompletedStep and emit currentStep', () => {
      component['lsaAppService'].setSelectedPage = jest.fn();
      component['lsaAppService'].setCompletedStep = jest.fn();
      component.currentStep$.next = jest.fn();

      component.selectionChanged({
        selectedIndex: 2,
        previouslySelectedIndex: 1,
      } as StepperSelectionEvent);

      expect(component['lsaAppService'].setSelectedPage).toHaveBeenCalledWith(
        2
      );
      expect(component['lsaAppService'].setCompletedStep).toHaveBeenCalledWith(
        1
      );
      expect(component.currentStep$.next).toHaveBeenCalledWith(2);
    });
  });

  describe('fetchGreases', () => {
    it('should call fetchGreases', () => {
      component.fetchGreases();

      expect(restService.getGreases).toHaveBeenCalled();
    });
  });
});
