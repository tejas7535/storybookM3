import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PmgmPerformanceRatingComponent } from './pmgm-performance-rating.component';

describe('PmgmPerformanceRatingComponent', () => {
  let component: PmgmPerformanceRatingComponent;
  let spectator: Spectator<PmgmPerformanceRatingComponent>;

  const createComponent = createComponentFactory({
    component: PmgmPerformanceRatingComponent,
    detectChanges: false,
    imports: [provideTranslocoTestingModule({ en: {} })],
    declarations: [PmgmPerformanceRatingComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set rating', () => {
      component.agInit({ value: 'rating' } as ICellRendererParams);
      expect(component.rating).toBe('rating');
    });
  });

  describe('refresh', () => {
    test('should return false', () => {
      expect(component.refresh()).toBeFalsy();
    });
  });
});
