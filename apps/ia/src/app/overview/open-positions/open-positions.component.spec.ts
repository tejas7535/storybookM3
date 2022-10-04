import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SharedModule } from '../../shared/shared.module';
import { OpenApplication } from '../models';
import { OpenPositionsComponent } from './open-positions.component';

describe('OpenPositionsComponent', () => {
  let component: OpenPositionsComponent;
  let spectator: Spectator<OpenPositionsComponent>;

  const createComponent = createComponentFactory({
    component: OpenPositionsComponent,
    detectChanges: false,
    imports: [SharedModule, provideTranslocoTestingModule({ en: {} })],
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

  describe('countAllOpenApplications', () => {
    test('should return undefined when no open applications set', () => {
      const result = component.countOpenPositions();

      expect(result).toBeUndefined();
    });

    test('should return count of open positions', () => {
      component.openApplications = [
        { count: 2 },
        { count: 4 },
        { count: 1 },
        { count: 0 },
      ] as OpenApplication[];

      const result = component.countOpenPositions();

      expect(result).toEqual(7);
    });

    test('should return 0 when open applications empty', () => {
      component.openApplications = [];

      const result = component.countOpenPositions();

      expect(result).toEqual(0);
    });
  });

  describe('onButtonClick', () => {
    test('should emit event', () => {
      component.openApplicationsRequested.emit = jest.fn();

      component.onButtonClick();

      expect(component.openApplicationsRequested.emit).toHaveBeenCalled();
    });
  });
});
