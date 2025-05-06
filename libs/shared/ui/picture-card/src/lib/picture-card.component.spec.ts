import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { PictureCardAction } from './models';
import { PictureCardComponent } from './picture-card.component';
import { PictureCardActionComponent } from './picture-card-action/picture-card-action.component';

describe('PictureCardComponent', () => {
  let component: PictureCardComponent;
  let spectator: Spectator<PictureCardComponent>;

  const createComponent = createComponentFactory({
    component: PictureCardComponent,
    declarations: [PictureCardComponent, PictureCardActionComponent],
    imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleFunctions', () => {
    it('should set active to false on deactivate', () => {
      component.active = true;
      component.deactivate();
      expect(component.active).toBe(false);
    });
    it('should set active to true on activate', () => {
      component.active = false;
      component.activate();
      expect(component.active).toBe(true);
    });
    it('should change active on toggle', () => {
      const originalActive = component.active;
      const originalSelected = component.selected;
      component.toggle(!component.active, !component.selected);
      expect(originalActive).toBe(!component.active);
      expect(originalSelected).toBe(!component.selected);
    });
  });
  describe('performAction', () => {
    it('should call the action click function when it exists', () => {
      const mockClick = jest.fn();
      const action: PictureCardAction = {
        click: mockClick,
      } as Partial<PictureCardAction> as PictureCardAction;

      component.performAction(action);

      expect(mockClick).toHaveBeenCalled();
    });

    it('should not throw an error when click function does not exist', () => {
      const action: PictureCardAction =
        {} as Partial<PictureCardAction> as PictureCardAction;

      expect(() => {
        component.performAction(action);
      }).not.toThrow();
    });

    it('should handle null action gracefully', () => {
      expect(() => {
        // eslint-disable-next-line unicorn/no-null
        component.performAction(null as unknown as PictureCardAction);
      }).toThrow();
    });

    it('should handle undefined click property', () => {
      const action: PictureCardAction = {
        click: undefined,
      } as Partial<PictureCardAction> as PictureCardAction;

      expect(() => {
        component.performAction(action);
      }).not.toThrow();
    });
  });
});
