import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { ProductComparisonModalComponent } from './product-comparison.component';

describe('ProductComparisonModalComponent', () => {
  let component: ProductComparisonModalComponent;
  let spectator: Spectator<ProductComparisonModalComponent>;

  const createComponent = createComponentFactory({
    component: ProductComparisonModalComponent,
    providers: [provideMockStore()],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleIconVisibility', () => {
    it('should toggle showDelta', () => {
      component.showDelta = true;
      component.toggleIconVisibility();
      expect(component.showDelta).toBe(false);
    });
  });

  describe('onTogglePanelExpanded', () => {
    test('should set panel state', () => {
      component.onTogglePanelExpanded('testId', true);
      expect(component.showDeltasByKey.get('testId')).toBe(true);
    });
  });
});
