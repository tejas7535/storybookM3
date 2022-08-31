import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { InfoIconModule } from '../../../components/info-icon/info-icon.module';
import {
  HeaderInfoIconComponent,
  HeaderInfoIconComponentParams,
} from './header-info-icon.component';

describe('HeaderInfoIconComponent', () => {
  let component: HeaderInfoIconComponent;
  let spectator: Spectator<HeaderInfoIconComponent>;

  const createComponent = createComponentFactory({
    component: HeaderInfoIconComponent,
    imports: [InfoIconModule, provideTranslocoTestingModule({ en: {} })],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });
  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('tooltip', () => {
    test('should show tooltip if provided', () => {
      component.params = {
        displayName: 'text',
        tooltipText: 'tooltip-text',
      } as HeaderInfoIconComponentParams;

      spectator.detectChanges();

      const infoIcon = spectator.query('gq-info-icon');

      expect(infoIcon).toBeTruthy();
      expect(infoIcon.textContent.trim()).toEqual('info_outline');
    });

    test('should NOT show tooltip if not provided', () => {
      component.params = {
        displayName: 'text',
      } as HeaderInfoIconComponentParams;

      spectator.detectChanges();

      const infoIcon = spectator.query('gq-info-icon');

      expect(infoIcon).toBeFalsy();
    });
  });
});
