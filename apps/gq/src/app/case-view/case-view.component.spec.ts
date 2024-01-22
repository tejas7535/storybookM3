import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';

import { OverviewCasesFacade } from '@gq/core/store/overview-cases/overview-cases.facade';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CaseViewComponent } from './case-view.component';

describe('CaseViewComponent', () => {
  let component: CaseViewComponent;
  let spectator: Spectator<CaseViewComponent>;

  const createComponent = createComponentFactory({
    component: CaseViewComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    providers: [
      provideMockStore(),
      MockProvider(OverviewCasesFacade, {
        viewToggles$: of([]),
        getCasesCount: jest.fn(),
        loadCasesForView: jest.fn(),
      }),
    ],

    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onViewToggle', () => {
    test('should call setDisplayedQuotations', () => {
      const overviewCasesFacadeMock: OverviewCasesFacade = {
        loadCasesForView: jest.fn(),
      } as unknown as OverviewCasesFacade;
      Object.defineProperty(component, 'overviewCasesFacade', {
        value: overviewCasesFacadeMock,
      });

      component.onViewToggle({
        id: 0,
        title: 'title',
        active: false,
      });
      expect(
        component['overviewCasesFacade'].loadCasesForView
      ).toHaveBeenCalledWith(0);
    });
  });
});
