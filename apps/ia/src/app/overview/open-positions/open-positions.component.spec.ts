import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('trackByFn', () => {
    it('should return index', () => {
      const index = 5;

      const result = component.trackByFn(index);

      expect(result).toBe(index);
    });
  });
});
