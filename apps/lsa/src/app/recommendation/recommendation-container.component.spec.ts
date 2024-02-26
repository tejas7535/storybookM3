import { FormGroup } from '@angular/forms';

import { of } from 'rxjs';

import { LsaFormService } from '@lsa/core/services/lsa-form.service';
import { RestService } from '@lsa/core/services/rest.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { RecommendationContainerComponent } from './recommendation-container.component';

jest.mock('@lsa/core/services/form-helper', () => ({
  transformFormValue: jest.fn(),
}));

describe('RecommendationContainerComponent', () => {
  let spectator: Spectator<RecommendationContainerComponent>;
  let component: RecommendationContainerComponent;
  let restService: RestService;

  const createComponent = createComponentFactory({
    component: RecommendationContainerComponent,
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
              } as unknown as FormGroup)
          ),
          getLubricationPointsForm: jest.fn(() => ({} as unknown as FormGroup)),
          getLubricantForm: jest.fn(() => ({} as unknown as FormGroup)),
        },
      },
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    component.currentStep$ = of(3);

    spectator.detectChanges();

    restService = spectator.inject(RestService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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
});
