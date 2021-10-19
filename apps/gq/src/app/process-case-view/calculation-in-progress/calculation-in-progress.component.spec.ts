import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationInProgressComponent } from './calculation-in-progress.component';

describe('CalculationInProgressComponent', () => {
  let component: CalculationInProgressComponent;
  let spectator: Spectator<CalculationInProgressComponent>;

  const createComponent = createComponentFactory({
    component: CalculationInProgressComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('reload', () => {
    test('should reload page', () => {
      delete window.location;
      window.location = { reload: jest.fn() } as any;

      component.reload();

      expect(window.location.reload).toHaveBeenCalledTimes(1);
    });
  });
});
