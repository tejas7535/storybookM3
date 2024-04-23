import {
  ChangeDetectorRef,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MeaningfulRoundPipe } from '@ea/shared/pipes/meaningful-round.pipe';
import { APP_STATE_MOCK } from '@ea/testing/mocks';
import {
  provideTranslocoLocale,
  TranslocoDecimalPipe,
} from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { sharedTranslocoLocaleConfig } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

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
      // Material Modules
      MockModule(MatDividerModule),
      provideTranslocoTestingModule({ en: {} }),
      MatIconTestingModule,
      RouterTestingModule,
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
    ],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ResultOverlay', () => {
    it('should show the result overlay', () => {
      expect(spectator.query('ea-calculation-result-preview')).toBeTruthy();
    });
  });
});
