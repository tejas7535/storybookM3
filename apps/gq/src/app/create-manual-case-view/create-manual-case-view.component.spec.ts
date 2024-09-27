import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { CreateCaseHeaderInformationComponent } from '@gq/shared/components/case-header-information/create-case-header-information/create-case-header-information.component';
import { HeaderInformationData } from '@gq/shared/components/case-header-information/models/header-information-data.interface';
import { AddEntryComponent } from '@gq/shared/components/case-material/add-entry/add-entry.component';
import { InputTableComponent } from '@gq/shared/components/case-material/input-table/input-table.component';
import { EVENT_NAMES } from '@gq/shared/models';
import { MaterialTableItem } from '@gq/shared/models/table/material-table-item-model';
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

import { CreateManualCaseViewComponent } from './create-manual-case-view.component';

describe('manualCaseViewComponent', () => {
  let component: CreateManualCaseViewComponent;
  let spectator: Spectator<CreateManualCaseViewComponent>;
  let router: Router;
  const customerConditionsValid$$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  const rowData$$: BehaviorSubject<MaterialTableItem[]> = new BehaviorSubject<
    MaterialTableItem[]
  >([]);

  const createComponent = createComponentFactory({
    component: CreateManualCaseViewComponent,
    imports: [
      RouterModule.forRoot([]),
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
        customerConditionsValid$: customerConditionsValid$$.asObservable(),
        newCaseRowData$: rowData$$.asObservable(),
        resetCaseCreationInformation: jest.fn(),
      }),
    ],
    declarations: [
      MockComponent(CreateCaseHeaderInformationComponent),
      MockComponent(AddEntryComponent),
      MockComponent(InputTableComponent),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    router = spectator.inject(Router);
    router.navigate = jest.fn();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
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
      'should return true if customerConditionsValid$ is false',
      marbles((m) => {
        component['headerInformationHasChangesSubject$$'].next(true);
        component['headerInformationIsValidSubject$$'].next(true);
        customerConditionsValid$$.next(false);
        const expected = m.cold('a', { a: true });
        m.expect(component.createCaseButtonDisabled$).toBeObservable(expected);
      })
    );

    test(
      'should return true when rowData.length === 0',
      marbles((m) => {
        component['headerInformationHasChangesSubject$$'].next(true);
        component['headerInformationIsValidSubject$$'].next(true);
        customerConditionsValid$$.next(true);
        rowData$$.next([]);

        const expected = m.cold('a', { a: true });
        m.expect(component.createCaseButtonDisabled$).toBeObservable(expected);
      })
    );
    test(
      'should return false if headerInformationHasChanges$ and headerInformationIsValid$, customerConditionsValid$ are true, and rowData.length > 0',
      marbles((m) => {
        component['headerInformationHasChangesSubject$$'].next(true);
        component['headerInformationIsValidSubject$$'].next(true);
        customerConditionsValid$$.next(true);
        rowData$$.next([{ materialNumber: '123' }]);
        const expected = m.cold('a', { a: false });
        m.expect(component.createCaseButtonDisabled$).toBeObservable(expected);
      })
    );
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
      jest.useFakeTimers();
      component.backToCaseOverView();
      jest.advanceTimersByTime(200);
      jest.runAllTimers();
      expect(router.navigate).toHaveBeenCalledWith([AppRoutePath.CaseViewPath]);
      expect(
        component['createCaseFacade'].resetCaseCreationInformation
      ).toHaveBeenCalled();
      jest.clearAllTimers();
      jest.useRealTimers();
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
});
