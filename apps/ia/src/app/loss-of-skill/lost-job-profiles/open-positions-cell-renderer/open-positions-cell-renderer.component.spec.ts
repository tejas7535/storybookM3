import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { OpenPositionsCellRendererComponent } from './open-positions-cell-renderer.component';

describe('OpenPositionsCellRendererComponent', () => {
  let component: OpenPositionsCellRendererComponent;
  let spectator: Spectator<OpenPositionsCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: OpenPositionsCellRendererComponent,
    imports: [
      MatIconModule,
      MatTooltipModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    declarations: [OpenPositionsCellRendererComponent],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set count and availability when data available', () => {
      const params = {
        value: { count: 43, available: true },
      } as ICellRendererParams;

      component.agInit(params);

      expect(component.count).toEqual(43);
      expect(component.available).toBeTruthy();
    });

    test('should set count and availability when data unavailable', () => {
      const params = {
        value: { count: 0, available: false },
      } as ICellRendererParams;

      component.agInit(params);

      expect(component.count).toEqual(0);
      expect(component.available).toBeFalsy();
    });
  });

  describe('refresh', () => {
    test('should return false', () => {
      expect(component.refresh({} as ICellRendererParams)).toBeFalsy();
    });
  });
});
