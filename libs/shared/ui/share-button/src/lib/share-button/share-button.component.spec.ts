import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ShareButtonComponent } from './share-button.component';
import { ShareButtonDirective } from './share-button.directive';

describe('ShareButtonComponent', () => {
  let component: ShareButtonComponent;
  let spectator: Spectator<ShareButtonComponent>;

  const createComponent = createComponentFactory({
    component: ShareButtonComponent,
    declarations: [ShareButtonDirective],
    imports: [
      CommonModule,
      MatButtonModule,
      MatTooltipModule,
      MatIconModule,
      provideTranslocoTestingModule({}),
    ],
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
});
