import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationInProgressComponent } from './calculation-in-progress.component';

describe('CalculationInProgressComponent', () => {
  let spectator: Spectator<CalculationInProgressComponent>;

  const createComponent = createComponentFactory({
    component: CalculationInProgressComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  test('should create', () => {
    spectator.detectChanges();
    expect(spectator.debugElement.componentInstance).toBeTruthy();
  });

  describe('reload', () => {
    test('should reload page', () => {
      delete window.location;
      window.location = { reload: jest.fn() } as any;

      spectator.detectChanges();
      spectator.debugElement.componentInstance.reload();

      expect(window.location.reload).toHaveBeenCalledTimes(1);
    });
  });

  describe('imagePath', () => {
    it('should load the calc image as fallback', () => {
      spectator.setInput(
        'isSapRefreshInProgress',
        undefined as unknown as boolean
      );
      spectator.detectChanges();

      expect(spectator.debugElement.componentInstance.imagePath).toEqual(
        'assets/png/calc_in_progress.png'
      );
    });

    it('should load the calc image if there is NO SAP call in progress', () => {
      spectator.setInput('isSapRefreshInProgress', false);
      spectator.detectChanges();

      expect(spectator.debugElement.componentInstance.imagePath).toEqual(
        'assets/png/calc_in_progress.png'
      );
    });

    it('should load the sap image if there is a SAP call in progress', () => {
      spectator.setInput('isSapRefreshInProgress', true);
      spectator.detectChanges();

      expect(spectator.debugElement.componentInstance.imagePath).toEqual(
        'assets/png/sap_refresh_in_progress.png'
      );
    });
  });
});
