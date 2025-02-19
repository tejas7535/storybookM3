import {
  ChangeDetectorRef,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideRouter } from '@angular/router';

import { MeaningfulRoundPipe } from '@ea/shared/pipes/meaningful-round.pipe';
import { APP_STATE_MOCK } from '@ea/testing/mocks';
import {
  provideTranslocoLocale,
  TranslocoDecimalPipe,
} from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent, MockModule } from 'ng-mocks';

import { sharedTranslocoLocaleConfig } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationResultPreviewComponent } from '../calculation-result-preview/calculation-result-preview.component';
import { CalculationContainerComponent } from './calculation-container.component';

class ChangeDetectorRefStub {
  markForCheck(): void {}

  detach(): void {}

  detectChanges(): void {}

  checkNoChanges(): void {}

  reattach(): void {}
}

describe('CalculationContainerComponent', () => {
  let component: CalculationContainerComponent;
  let spectator: Spectator<CalculationContainerComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: CalculationContainerComponent,
    imports: [
      MockModule(MatDividerModule),
      provideTranslocoTestingModule({ en: {} }),
      MatIconTestingModule,
      MockComponent(CalculationResultPreviewComponent),
    ],
    providers: [
      provideMockStore({
        initialState: {
          ...APP_STATE_MOCK,
        },
      }),
      TranslocoDecimalPipe,
      { provide: ChangeDetectorRef, useClass: ChangeDetectorRefStub },
      provideTranslocoLocale(sharedTranslocoLocaleConfig),
      MeaningfulRoundPipe,
      provideRouter([]),
    ],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ResultOverlay', () => {
    it('should show the result overlay', () => {
      expect(spectator.query(CalculationResultPreviewComponent)).toBeTruthy();
    });
  });
});
