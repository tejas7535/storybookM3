import { SimpleChange } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { Icon } from '@schaeffler/icons';

import { SpeedDialFabComponent } from './speed-dial-fab.component';

describe('SpeedDialFabComponent', () => {
  let spectator: Spectator<SpeedDialFabComponent>;
  let component: SpeedDialFabComponent;

  const createComponent = createComponentFactory({
    component: SpeedDialFabComponent,
    imports: [NoopAnimationsModule, MatButtonModule, MatIconModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#clickItem', () => {
    it('should emit the clicked event', () => {
      const key = 'hallo';

      const spy = jest.spyOn(component.clicked, 'emit');

      const expected = key;

      component.clickItem(key);

      expect(spy).toHaveBeenCalledWith(expected);
    });

    it('should prevent default if mouse event', () => {
      const evt = {
        preventDefault: jest.fn(),
      };

      component.clickItem('test', (evt as unknown) as MouseEvent);

      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
    });
  });

  describe('#ngOnChanges', () => {
    it('should set secondaryButtons to fabButtons if open is true', () => {
      const openState = true;
      component.open = openState;
      component.secondaryButtons = [
        {
          key: 'save',
          icon: new Icon('matrix', false),
          color: 'green',
          label: true,
          title: 'test',
        },
      ];
      expect(component.fabButtons.length).toBe(0);

      component.ngOnChanges({
        open: new SimpleChange(false, openState, false),
      });
      expect(component.fabButtons).toBe(component.secondaryButtons);
    });

    it('should clear fabButtons if open is false', () => {
      const openState = false;
      component.open = openState;
      component.secondaryButtons = [
        {
          key: 'save',
          icon: new Icon('matrix', false),
          color: 'green',
          label: true,
          title: 'test',
        },
      ];
      expect(component.fabButtons.length).toBe(0);

      component.ngOnChanges({
        open: new SimpleChange(false, openState, false),
      });
      expect(component.fabButtons).toEqual([]);
    });
  });

  it('secondary button should have text', fakeAsync(() => {
    const openState = true;

    spectator.setInput('secondaryButtons', [
      {
        key: 'save',
        icon: new Icon('patronus', false),
        color: 'green',
        label: true,
        title: 'Patronum!',
      },
    ]);
    spectator.setInput('open', openState);

    component.ngOnChanges({
      open: new SimpleChange(false, openState, false),
    });

    spectator.detectChanges();

    const spanElem = spectator.query('.btn-title');
    expect(spanElem.innerHTML).toContain('Patronum!');
  }));

  describe('trackByFn()', () => {
    it('should return the loop index to track usersArray', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });
});
