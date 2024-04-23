import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';

import { TrackingService } from '@ea/core/services/tracking-service/tracking.service';
import { APP_STATE_MOCK } from '@ea/testing/mocks';
import { translate } from '@jsverse/transloco';
import {
  provideTranslocoLocale,
  TranslocoDecimalPipe,
} from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { sharedTranslocoLocaleConfig } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationResultPreviewComponent } from './calculation-result-preview.component';

const analyticsServiceMock = {
  logShowReport: jest.fn(),
};

class ChangeDetectorRefStub {
  markForCheck(): void {}

  detach(): void {}

  detectChanges(): void {}

  checkNoChanges(): void {}

  reattach(): void {}
}

describe('CalculationResultPreviewComponent', () => {
  let spectator: Spectator<CalculationResultPreviewComponent>;
  let store: MockStore;

  const dialogMock = {
    open: jest.fn(),
  };

  const createComponent = createComponentFactory({
    component: CalculationResultPreviewComponent,
    imports: [
      PushPipe,
      LetDirective,

      // Material Modules
      MockModule(MatButtonModule),
      MatIconTestingModule,
      MockModule(MatTooltipModule),
      MockModule(MatDividerModule),
      MockModule(DialogModule),

      provideTranslocoTestingModule({ en: {} }),
      RouterTestingModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          ...APP_STATE_MOCK,
          calculationParameters: {
            ...APP_STATE_MOCK.calculationParameters,
            isInputInvalid: true,
          },
        },
      }),
      provideTranslocoLocale(sharedTranslocoLocaleConfig),
      TranslocoDecimalPipe,
      {
        provide: ChangeDetectorRef,
        useClass: ChangeDetectorRefStub,
      },
      {
        provide: translate,
        useValue: jest.fn(),
      },
      { provide: Dialog, useValue: dialogMock },
      { provide: MatDialog, useValue: dialogMock },
      {
        provide: TrackingService,
        useValue: analyticsServiceMock,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();

    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  it('should display the "show report" button', () => {
    const button = spectator.queryLast('button');

    expect(button).toBeTruthy();
    // with title
    expect(button.textContent).toContain('calculation.showReport');
  });

  it('should show info if calculation is missing inputs', () => {
    const m = spectator.query('.bg-background-dark').textContent;
    expect(m).toContain('calculation.calculationMissingInput');
  });

  it('should open a dialog if showReport() is called', () => {
    dialogMock.open.mockReset();
    analyticsServiceMock.logShowReport.mockReset();

    spectator.component.showReport();

    expect(dialogMock.open).toHaveBeenCalled();
    expect(analyticsServiceMock.logShowReport).toHaveBeenCalled();
  });
});
