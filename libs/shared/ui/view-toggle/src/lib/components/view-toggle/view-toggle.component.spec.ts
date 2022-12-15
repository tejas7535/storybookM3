import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { ViewToggle } from '../../view-toggle.model';
import { ViewToggleComponent } from './view-toggle.component';

describe('ViewToggleComponent', () => {
  let component: ViewToggleComponent;
  let spectator: Spectator<ViewToggleComponent>;
  const view: ViewToggle = { id: 0, title: 'test title' };

  const createComponent = createComponentFactory({
    component: ViewToggleComponent,
    imports: [MatButtonToggleModule],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });
  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set component vars according to input', () => {
    test('should set vars on inital input', () => {
      const views = [view];
      spectator.setInput('views', views);

      expect(component.active).toEqual(view);
      expect(component.items).toEqual(views);
    });
    test('should set vars on input change', () => {
      component.items = [view];
      const updatedView = { ...view, title: 'title changed' };
      const views = [updatedView];
      spectator.setInput('views', views);

      expect(component.active).toEqual(views[0]);
      expect(component.items).toEqual(views);
    });
    test('should not set vars', () => {
      const views: any[] = [];
      spectator.setInput('views', views);

      expect(component.active).toBeUndefined();
      expect(component.items).toEqual([]);
    });
  });
  describe('onViewSelect', () => {
    test('should emit selectionChange', () => {
      const event = { value: view } as MatButtonToggleChange;

      component.selectionChange.emit = jest.fn();

      component.onViewSelect(event);

      expect(component.selectionChange.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('onIconClicked', () => {
    test('should emit iconClicked', () => {
      const event = {
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
      } as unknown as MouseEvent;
      component.iconClicked.emit = jest.fn();

      component.onIconClicked(event, 0, 'test-icon');

      expect(component.iconClicked.emit).toHaveBeenCalledTimes(1);
      expect(component.iconClicked.emit).toHaveBeenCalledWith({
        iconName: 'test-icon',
        viewId: 0,
      });
      expect(event.stopPropagation).toHaveBeenCalledTimes(1);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });
  });
});
