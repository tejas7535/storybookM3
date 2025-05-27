import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { BehaviorSubject } from 'rxjs';

import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockProvider } from 'ng-mocks';

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
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
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
