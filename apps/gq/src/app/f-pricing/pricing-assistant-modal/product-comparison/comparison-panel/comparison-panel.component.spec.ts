import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { ComparisonPanelComponent } from './comparison-panel.component';

describe('CollapsablePanelComponent', () => {
  let component: ComparisonPanelComponent;
  let spectator: Spectator<ComparisonPanelComponent>;

  const createComponent = createComponentFactory({
    component: ComparisonPanelComponent,

    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    test('should set expand state true', () => {
      component.numberOfDeltas = 1;

      component.ngOnChanges({
        numberOfDeltas: {
          currentValue: 1,
        } as any,
      });
      expect(component.expanded).toBe(true);
    });
    test('should set expand state false', () => {
      component.numberOfDeltas = 0;
      component.ngOnChanges({
        numberOfDeltas: {
          currentValue: 0,
        } as any,
      });
      expect(component.expanded).toBe(false);
    });
  });

  describe('toggleExpandedWhenCollapsing', () => {
    test('should call method with false', () => {
      component['toggleExpand'] = jest.fn();
      component.toggleExpandedWhenCollapsing(false);
      expect(component['toggleExpand']).toHaveBeenCalledWith(false);
    });
    test('should not call method', () => {
      component['toggleExpand'] = jest.fn();
      component.toggleExpandedWhenCollapsing(true);
      expect(component['toggleExpand']).not.toHaveBeenCalled();
    });
  });

  describe('toggleExpand', () => {
    test('should set expanded to true', () => {
      component.togglePanelExpanded.emit = jest.fn();
      component['toggleExpand'](true);
      expect(component.expanded).toBe(true);
      expect(component.togglePanelExpanded.emit).toHaveBeenCalledWith(true);
    });
    test('should set expanded to false', () => {
      component.togglePanelExpanded.emit = jest.fn();
      component['toggleExpand'](false);
      expect(component.expanded).toBe(false);
      expect(component.togglePanelExpanded.emit).toHaveBeenCalledWith(false);
    });
  });
});
