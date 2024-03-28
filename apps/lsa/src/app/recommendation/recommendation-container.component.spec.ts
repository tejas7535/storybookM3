import { CdkStepperModule, StepperSelectionEvent } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { waitForAsync } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';

import { LsaStepperComponent } from '@lsa/core/lsa-stepper/lsa-stepper.component';
import { LsaAppService } from '@lsa/core/services/lsa-app.service';
import { LsaFormService } from '@lsa/core/services/lsa-form.service';
import { RestService } from '@lsa/core/services/rest.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { RecommendationContainerComponent } from './recommendation-container.component';

jest.mock('@lsa/core/services/form-helper', () => ({
  transformFormValue: jest.fn(),
}));

describe('RecommendationContainerComponent', () => {
  let spectator: Spectator<RecommendationContainerComponent>;
  let component: RecommendationContainerComponent;
  let lsaAppService: LsaAppService;
  let restService: RestService;

  const createComponent = createComponentFactory({
    component: RecommendationContainerComponent,
    imports: [
      LetDirective,
      PushPipe,
      provideTranslocoTestingModule({ en: {} }),
      CommonModule,
      MockModule(CdkStepperModule),
    ],
    providers: [
      {
        provide: RestService,
        useValue: {
          getLubricatorRecommendation: jest.fn(),
        },
      },
      {
        provide: LsaFormService,
        useValue: {
          getRecommendationForm: jest.fn(
            () =>
              ({
                getRawValue: jest.fn(),
              }) as unknown as FormGroup
          ),
          getLubricationPointsForm: jest.fn(() => ({}) as unknown as FormGroup),
          getLubricantForm: jest.fn(() => ({}) as unknown as FormGroup),
          getApplicationForm: jest.fn(() => ({}) as unknown as FormGroup),
        },
      },
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    lsaAppService = spectator.inject(LsaAppService);
    restService = spectator.inject(RestService);

    spectator.detectChanges();
  });

  it('should create', waitForAsync(() => {
    spectator.detectChanges();
    expect(component).toBeTruthy();
  }));

  describe('ngOnDestroy', () => {
    it('should complete the observable', () => {
      component['destroy$'].next = jest.fn();
      component['destroy$'].complete = jest.fn();

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });

  describe('fetchResult', () => {
    it('should call getLubricatorRecommendation', () => {
      component.form.getRawValue = jest.fn();
      component.fetchResult();

      expect(component.form.getRawValue).toHaveBeenCalled();
      expect(restService.getLubricatorRecommendation).toHaveBeenCalledWith(
        component.form.getRawValue()
      );
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
});
