import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

import { BackButtonModule } from '@cdba/shared/directives';

import { TabsHeaderComponent } from './tabs-header.component';

describe('TabsHeaderComponent', () => {
  let component: TabsHeaderComponent;
  let spectator: Spectator<TabsHeaderComponent>;

  const createComponent = createComponentFactory({
    component: TabsHeaderComponent,
    imports: [
      MatIconModule,
      MatTabsModule,
      ReactiveComponentModule,
      RouterTestingModule,
      BackButtonModule,
    ],
    declarations: [TabsHeaderComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });
});
