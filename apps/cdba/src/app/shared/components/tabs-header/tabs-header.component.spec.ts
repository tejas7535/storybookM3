import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

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
      MatButtonModule,
      MatTooltipModule,
      RouterTestingModule,
      BackButtonModule,
      provideTranslocoTestingModule({ en: {} }),
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
