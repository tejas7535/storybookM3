import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { UserPanelComponent } from './user-panel.component';

describe('UserPanelComponent', () => {
  let spectator: Spectator<UserPanelComponent>;
  let component: UserPanelComponent;

  const createComponent = createComponentFactory({
    component: UserPanelComponent,
    imports: [MatIconModule],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties and Inputs', () => {
    it('should define the properties', () => {
      expect(component.userName).toBeUndefined();
      expect(component.userImageUrl).toBeUndefined();
    });
  });
});
