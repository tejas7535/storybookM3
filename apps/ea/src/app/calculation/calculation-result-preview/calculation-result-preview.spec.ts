import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FormFieldModule } from '@ea/shared/form-field';
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

  const createComponent = createComponentFactory({
    component: CalculationResultPreviewComponent,
    imports: [
      PushModule,
      LetModule,

      // Material Modules
      MockModule(MatButtonModule),
      MatIconTestingModule,
      MockModule(MatTooltipModule),
      MockModule(FormFieldModule),
      MockModule(MatDividerModule),

      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({
        initialState: { ...APP_STATE_MOCK },
      }),
      {
        provide: translate,
        useValue: jest.fn(),
      },
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
    const m = spectator.query('.fixed').textContent;
    expect(m).toContain('calculation.calculationMissingInput');
  });

  // TODO: Skipped until calculation report modul is implemented
  it.skip('should dispatch an action if showReport() is called', () => {
    spectator.component.showReport();
    expect(store.dispatch).toHaveBeenCalled();
  });
});
