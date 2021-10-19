import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SavingInProgressComponent } from './saving-in-progress.component';

describe('SavingInProgressComponent', () => {
  let component: SavingInProgressComponent;
  let spectator: Spectator<SavingInProgressComponent>;

  const createComponent = createComponentFactory({
    component: SavingInProgressComponent,
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
