import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatTooltipModule } from '@angular/material/tooltip';

import { APP_STATE_MOCK } from '@ea/testing/mocks';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { translate } from '@ngneat/transloco';
import { LetModule, PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationResultPreviewComponent } from './calculation-result-preview';

describe('CalculationResultPreviewComponent', () => {
  let spectator: Spectator<CalculationResultPreviewComponent>;
  let store: MockStore;

  const dialogMock = {
    open: jest.fn(),
  };

  const createComponent = createComponentFactory({
    component: CalculationResultPreviewComponent,
    imports: [
      PushModule,
      LetModule,

      // Material Modules
      MockModule(MatButtonModule),
      MatIconTestingModule,
      MockModule(MatTooltipModule),
      MockModule(MatDividerModule),
      MockModule(MatDialogModule),

      provideTranslocoTestingModule({ en: {} }),
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
      {
        provide: translate,
        useValue: jest.fn(),
      },
      { provide: MatDialog, useValue: dialogMock },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();

    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  it('should display the "show report" button', () => {
    expect(spectator.query('button')).toBeTruthy();
    // with title
    expect(spectator.query('button').textContent).toContain(
      'calculation.showReport'
    );
  });

  it('should show info if calculation is missing inputs', () => {
    const m = spectator.query('.ea-bg-background-dark').textContent;
    expect(m).toContain('calculation.calculationMissingInput');
  });

  it('should open a dialog if showReport() is called', () => {
    dialogMock.open.mockReset();

    spectator.component.showReport();

    expect(dialogMock.open).toHaveBeenCalled();
  });
});
