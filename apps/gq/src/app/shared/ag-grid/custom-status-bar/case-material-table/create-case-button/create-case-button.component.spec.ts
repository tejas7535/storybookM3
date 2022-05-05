import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CASE_CREATION_TYPES, EVENT_NAMES } from '../../../../models';
import { CreateCaseButtonComponent } from './create-case-button.component';

describe('CreateCaseButtonComponent', () => {
  let component: CreateCaseButtonComponent;
  let spectator: Spectator<CreateCaseButtonComponent>;
  let mockStore: MockStore;
  let applicationInsightsService: ApplicationInsightsService;

  const createComponent = createComponentFactory({
    component: CreateCaseButtonComponent,
    declarations: [CreateCaseButtonComponent],
    imports: [
      CommonModule,
      SharedTranslocoModule,
      MatButtonModule,
      ReactiveComponentModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockStore = spectator.inject(MockStore);
    applicationInsightsService = spectator.inject(ApplicationInsightsService);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('createCase', () => {
    test('should dispatch create case action', () => {
      mockStore.dispatch = jest.fn();

      component.createCase();

      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('tracking', () => {
    test('should track CASE_CREATION_FINISHED on createCase', () => {
      component.createCase();

      expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
        EVENT_NAMES.CASE_CREATION_FINISHED,
        { type: CASE_CREATION_TYPES.MANUAL }
      );
    });
  });
});
