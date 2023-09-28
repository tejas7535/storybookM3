import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-community';

import { ChipClass, FluctuationType } from '../models';
import { FluctuationTypeCellRendererComponent } from './fluctuation-type-cell-renderer.component';

describe('FluctuationTypeCellRendererComponent', () => {
  let component: FluctuationTypeCellRendererComponent;
  let spectator: Spectator<FluctuationTypeCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: FluctuationTypeCellRendererComponent,
    detectChanges: false,
    imports: [],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set chip class for unforced type', () => {
      const params = {
        value: FluctuationType.UNFORCED,
      } as ICellRendererParams;

      component.agInit(params);

      expect(component.chipClass).toEqual(ChipClass.UNFORCED);
    });

    test('should set chip class for forced type', () => {
      const params = {
        value: FluctuationType.FORCED,
      } as ICellRendererParams;

      component.agInit(params);

      expect(component.chipClass).toEqual(ChipClass.FORCED);
    });

    test('should set chip class for remaining type', () => {
      const params = {
        value: FluctuationType.REMAINING,
      } as ICellRendererParams;

      component.agInit(params);

      expect(component.chipClass).toEqual(ChipClass.REMAINING);
    });

    test('should set chip class for internal change type', () => {
      const params = {
        value: FluctuationType.INTERNAL,
        data: {
          exitDate: '2020-02-12',
        },
      } as ICellRendererParams;

      component.agInit(params);

      expect(component.chipClass).toEqual(ChipClass.INTERNAL);
    });

    test('should translate fluctuation type', () => {
      const params = {
        value: FluctuationType.INTERNAL,
        data: {
          exitDate: '2020-02-12',
        },
      } as ICellRendererParams;

      component.agInit(params);

      expect(component.translatedType).toEqual('translate it');
    });
  });
});
