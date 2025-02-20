import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { MaterialSelectionComponent } from '@gq/case-view/case-creation/create-customer-case/material-selection/material-selection.component';
import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { CreateCaseHeaderInformationComponent } from '@gq/shared/components/case-header-information/create-case-header-information/create-case-header-information.component';
import { HeaderInformationData } from '@gq/shared/components/case-header-information/models/header-information-data.interface';
import { AdditionalFiltersComponent } from '@gq/shared/components/case-material/additional-filters/additional-filters.component';
import { EVENT_NAMES } from '@gq/shared/models';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent, MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CreateCustomerCaseViewComponent } from './create-customer-case-view.component';

describe('CreateCustomerCaseViewComponent', () => {
  let component: CreateCustomerCaseViewComponent;

  let spectator: Spectator<CreateCustomerCaseViewComponent>;
  const getCreateCustomerCaseDisabled$$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  const customerIdForCaseCreation$$: BehaviorSubject<string> =
    new BehaviorSubject<string>('custId');
  const createComponent = createComponentFactory({
    component: CreateCustomerCaseViewComponent,
    imports: [
      StoreModule.forRoot({}),
      EffectsModule.forRoot([]),
      PushPipe,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      MockProvider(TranslocoLocaleService),
      provideMockStore({}),
      provideHttpClient(),
      provideHttpClientTesting(),
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
      MockProvider(CreateCaseFacade, {
        getCreateCustomerCaseDisabled$:
          getCreateCustomerCaseDisabled$$.asObservable(),
        resetCaseCreationInformation: jest.fn(),
        customerIdForCaseCreation$: customerIdForCaseCreation$$.asObservable(),
      }),
    ],
    declarations: [
      MockComponent(CreateCaseHeaderInformationComponent),
      MockComponent(MaterialSelectionComponent),
      MockComponent(AdditionalFiltersComponent),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('resetButtonDisabled', () => {
    test(
      'should return false if featureToggleConfig.isEnabled is false',
      marbles((m) => {
        m.expect(component.resetButtonDisabled$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );

    test(
      'should return false if featureToggleConfig.isEnabled is true and customer set',
      marbles((m) => {
        component['featureToggleConfig'].isEnabled = jest
          .fn()
          .mockReturnValue(true);
        customerIdForCaseCreation$$.next('id');

        m.expect(component.resetButtonDisabled$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );

    test(
      'should return true if featureToggleConfig.isEnabled is true and no customer',
      marbles((m) => {
        component['featureToggleConfig'].isEnabled = jest
          .fn()
          .mockReturnValue(true);
        customerIdForCaseCreation$$.next(undefined as any);

        m.expect(component.resetButtonDisabled$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });

  describe('createCaseButtonDisabled$', () => {
    test(
      'should return true if headerInformationHasChanges$ is false',
      marbles((m) => {
        component['headerInformationHasChangesSubject$$'].next(false);
        component['headerInformationIsValidSubject$$'].next(true);

        const expected = m.cold('a', { a: true });
        m.expect(component.createCaseButtonDisabled$).toBeObservable(expected);
      })
    );
    test(
      'should return true if headerInformationIsValid$ is false',
      marbles((m) => {
        component['headerInformationHasChangesSubject$$'].next(true);
        component['headerInformationIsValidSubject$$'].next(false);
        const expected = m.cold('a', { a: true });
        m.expect(component.createCaseButtonDisabled$).toBeObservable(expected);
      })
    );

    test(
      'should return true if getCreateCustomerCaseDisabled$ is true',
      marbles((m) => {
        component['headerInformationHasChangesSubject$$'].next(true);
        component['headerInformationIsValidSubject$$'].next(true);
        getCreateCustomerCaseDisabled$$.next(true);
        const expected = m.cold('a', { a: true });
        m.expect(component.createCaseButtonDisabled$).toBeObservable(expected);
      })
    );

    test(
      'should return false if getCreateCustomerCaseDisabled$ is false',
      marbles((m) => {
        component['headerInformationHasChangesSubject$$'].next(true);
        component['headerInformationIsValidSubject$$'].next(true);
        getCreateCustomerCaseDisabled$$.next(false);
        const expected = m.cold('a', { a: false });
        m.expect(component.createCaseButtonDisabled$).toBeObservable(expected);
      })
    );
  });

  describe('createCase', () => {
    test('should call createCaseFacade.createCase and insightService.logEvent', () => {
      component['insightsService'].logEvent = jest.fn();
      component['createCaseFacade'].createNewCustomerOgpCase = jest.fn();
      component.headerInformationData = { test: 'test' } as any;
      component.createCase();
      expect(component['insightsService'].logEvent).toHaveBeenCalledWith(
        EVENT_NAMES.CASE_CREATION_FINISHED,
        expect.any(Object)
      );
      expect(
        component['createCaseFacade'].createNewCustomerOgpCase
      ).toHaveBeenCalledWith(component.headerInformationData);
    });
  });
  describe('ngAfterViewInit', () => {
    test('should call insightsService.logEvent', () => {
      component['insightsService'].logEvent = jest.fn();
      component.ngAfterViewInit();
      expect(component['insightsService'].logEvent).toHaveBeenCalledWith(
        EVENT_NAMES.CASE_CREATION_STARTED,
        expect.any(Object)
      );
    });
  });

  describe('toggleHeader', () => {
    test('should toggle displayHeader', () => {
      component.displayHeader = true;
      component.toggleHeader();
      expect(component.displayHeader).toBe(false);
    });
  });

  describe('backToCaseOverview', () => {
    test('should navigate to case view', () => {
      component.backToCaseOverView();

      expect(
        component['createCaseFacade'].resetCaseCreationInformation
      ).toHaveBeenCalled();
    });
  });

  describe('handleHeaderInformationHasChanges', () => {
    test('should set headerInformationHasChangesSubject$$ to true', () => {
      component['headerInformationHasChangesSubject$$'].next(false);
      component.handleHeaderInformationHasChanges(true);
      expect(component['headerInformationHasChangesSubject$$'].value).toBe(
        true
      );
    });
  });

  describe('handleHeaderInformationIsValid', () => {
    test('should set headerInformationIsValidSubject$$ to true', () => {
      component['headerInformationIsValidSubject$$'].next(false);
      component.handleHeaderInformationIsValid(true);
      expect(component['headerInformationIsValidSubject$$'].value).toBe(true);
    });
  });

  describe('handleHeaderInformationData', () => {
    test('should set headerInformationData', () => {
      const data = { test: 'test' } as HeaderInformationData;
      component.handleHeaderInformationData(data);
      expect(component.headerInformationData).toEqual(data);
    });
  });

  describe('resetAll', () => {
    test('should trigger reset', () => {
      component.materialSelection = {
        resetAll: jest.fn(),
      } as any;

      component.resetAll();

      expect(component.materialSelection.resetAll).toHaveBeenCalledTimes(1);
    });
  });
});
