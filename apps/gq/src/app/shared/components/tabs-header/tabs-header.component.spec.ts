import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

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
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
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
});
