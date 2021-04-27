import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { UserMenuComponent } from './user-menu.component';

describe('UserMenuComponent', () => {
  let spectator: Spectator<UserMenuComponent>;
  let component: UserMenuComponent;

  const createComponent = createComponentFactory({
    component: UserMenuComponent,
    imports: [MatIconModule, MatMenuModule, FlexLayoutModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clickItem', () => {
    it('should emit the clicked key', () => {
      const key = 'key';
      const spy = spyOn(component.clicked, 'emit');

      component.clickItem(key);

      expect(spy).toHaveBeenCalledWith(key);
    });
  });

  describe('trackByFn', () => {
    it('should return index', () => {
      const idx = 5;

      const result = component.trackByFn(idx);

      expect(result).toEqual(idx);
    });
  });
});
