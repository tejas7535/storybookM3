import { MatIconTestingModule } from '@angular/material/icon/testing';

import { translate } from '@jsverse/transloco';
import {
  provideTranslocoLocale,
  TranslocoDecimalPipe,
} from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { sharedTranslocoLocaleConfig } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationResultPreviewItemComponent } from './calculation-result-preview-item.component';

describe('CalculationResultPreviewItemComponent', () => {
  let spectator: Spectator<CalculationResultPreviewItemComponent>;

  const createComponent = createComponentFactory({
    component: CalculationResultPreviewItemComponent,
    imports: [MatIconTestingModule, provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        provide: translate,
        useValue: jest.fn(),
      },
      provideTranslocoLocale(sharedTranslocoLocaleConfig),
      TranslocoDecimalPipe,
    ],
  });

  beforeEach(() => {
    spectator = createComponent({ detectChanges: false });
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  describe('data display', () => {
    beforeEach(() => {
      spectator.setInput('item', {
        icon: 'abc',
        title: 'abc',
        values: [
          { unit: 'abc', title: 'abc', value: 1, isLoading: false },
          { unit: 'abc', title: 'abc', value: 2, isLoading: false },
        ],
      });
    });

    it('should show the main icon', () => {
      spectator.detectChanges();
      expect(spectator.queryAll('mat-icon').length).toBe(1);
    });

    it('should show two values and one title', () => {
      spectator.detectChanges();
      expect(spectator.queryAll('.text-body-small').length).toBe(3);
    });
  });
});
