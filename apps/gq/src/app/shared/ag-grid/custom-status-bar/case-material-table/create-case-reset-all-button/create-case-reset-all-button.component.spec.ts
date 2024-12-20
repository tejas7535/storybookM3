import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { BehaviorSubject } from 'rxjs';

import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { SharedTranslocoModule } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CreateCaseResetAllButtonComponent } from './create-case-reset-all-button.component';

describe('ResetAllButtonComponent', () => {
  let component: CreateCaseResetAllButtonComponent;
  let spectator: Spectator<CreateCaseResetAllButtonComponent>;
  const customerId$$: BehaviorSubject<string> = new BehaviorSubject<string>(
    'id'
  );
  const createComponent = createComponentFactory({
    component: CreateCaseResetAllButtonComponent,
    declarations: [CreateCaseResetAllButtonComponent],
    imports: [
      CommonModule,
      SharedTranslocoModule,
      MatButtonModule,
      MatIconModule,
      PushPipe,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      MockProvider(CreateCaseFacade, {
        customerIdForCaseCreation$: customerId$$.asObservable(),
        clearCreateCaseRowData: jest.fn(),
      }),
      MockProvider(FeatureToggleConfigService, {
        isEnabled: jest.fn(() => true),
      }),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should set buttonDisabled$', () => {
    test(
      'should set disabled to false if createManualCaseAsView is enabled and customerId is set',
      marbles((m) => {
        m.expect(component.buttonDisabled$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );

    test(
      'should set disabled to false if createManualCaseAsView is disabled and customerId is set',
      marbles((m) => {
        component['featureToggleConfig'].isEnabled = jest.fn(() => false);
        customerId$$.next('anyId');

        m.expect(component.buttonDisabled$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );
    test(
      'should set disabled to true if createManualCaseAsView is enabled and customerId is undefined',
      marbles((m) => {
        component['featureToggleConfig'].isEnabled = jest.fn(() => true);
        customerId$$.next(undefined as any);

        m.expect(component.buttonDisabled$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });
  describe('resetAll', () => {
    test('should dispatch action', () => {
      component.resetAll();
      expect(
        component['createCaseFacade'].clearCreateCaseRowData
      ).toHaveBeenCalled();
    });
  });
});
