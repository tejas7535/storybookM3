import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { initialState } from '../store/reducers/sidebar.reducer';
import { SidebarElementsComponent } from './sidebar-elements.component';

describe('SidebarElementsComponent', () => {
  let spectator: Spectator<SidebarElementsComponent>;
  let component: SidebarElementsComponent;

  const createComponent = createComponentFactory({
    component: SidebarElementsComponent,
    imports: [
      MatTooltipModule,
      MatIconModule,
      RouterTestingModule,
      ReactiveComponentModule,
    ],
    providers: [
      provideMockStore({ initialState }),
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

  describe('trackByFn', () => {
    test('should return index', () => {
      const idx = 5;

      const result = component.trackByFn(idx, {});

      expect(result).toEqual(idx);
    });
  });
});
