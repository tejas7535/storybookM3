import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { TabsHeaderComponent } from './tabs-header.component';

describe('TabsHeaderComponent', () => {
  let component: TabsHeaderComponent;
  let spectator: Spectator<TabsHeaderComponent>;

  const createComponent = createComponentFactory({
    component: TabsHeaderComponent,
    imports: [
      RouterModule.forRoot([]),
      MatIconModule,
      MatTabsModule,
      MatButtonModule,
      MatTooltipModule,
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
});
