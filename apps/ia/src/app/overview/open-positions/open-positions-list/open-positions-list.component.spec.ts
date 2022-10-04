import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SharedModule } from '../../../shared/shared.module';
import { OpenPositionsListComponent } from './open-positions-list.component';

describe('OpenPositionsListComponent', () => {
  let component: OpenPositionsListComponent;
  let spectator: Spectator<OpenPositionsListComponent>;

  const createComponent = createComponentFactory({
    component: OpenPositionsListComponent,
    detectChanges: false,
    imports: [
      SharedModule,
      provideTranslocoTestingModule({ en: {} }),
      MatListModule,
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const index = 5;

      const result = component.trackByFn(index);

      expect(result).toBe(index);
    });
  });
});
