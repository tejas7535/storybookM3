import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ProcessHistoryComponent } from './process-history.component';
import { RecalculationDataComponent } from './recalculation-data/recalculation-data.component';
import { RecalculationProgressComponent } from './recalculation-progress/recalculation-progress.component';

describe('ProcessHistoryComponent', () => {
  let component: ProcessHistoryComponent;
  let spectator: Spectator<ProcessHistoryComponent>;

  const createComponent = createComponentFactory({
    component: ProcessHistoryComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MockComponent(RecalculationProgressComponent),
      MockComponent(RecalculationDataComponent),
    ],
    detectChanges: false,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('activeStep', () => {
    test('should return 1 when in progress without assignee', () => {
      component.rfq4Status.set(Rfq4Status.IN_PROGRESS);
      component.hasAssignee.set(false);
      expect(component.activeStep()).toBe(1);
    });
    test('should return 2 when in progress with assignee', () => {
      component.rfq4Status.set(Rfq4Status.IN_PROGRESS);
      component.hasAssignee.set(true);
      expect(component.activeStep()).toBe(2);
    });

    test('should return 3 when confirmed', () => {
      component.rfq4Status.set(Rfq4Status.CONFIRMED);
      expect(component.activeStep()).toBe(3);
    });
    test('should return 1 when cancelled without assignee', () => {
      component.rfq4Status.set(Rfq4Status.CANCELLED);
      component.hasAssignee.set(false);
      expect(component.activeStep()).toBe(1);
    });
    test('should return 2 when cancelled with assignee', () => {
      component.rfq4Status.set(Rfq4Status.CANCELLED);
      component.hasAssignee.set(true);
      expect(component.activeStep()).toBe(2);
    });
  });
});
