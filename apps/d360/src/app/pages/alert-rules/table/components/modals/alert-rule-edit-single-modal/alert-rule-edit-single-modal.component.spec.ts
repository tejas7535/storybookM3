import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
  provideMomentDateAdapter,
} from '@angular/material-moment-adapter';

import { of } from 'rxjs';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { AlertRulesService } from '../../../../../../feature/alert-rules/alert-rules.service';
import { CurrencyService } from '../../../../../../feature/info/currency.service';
import { SelectableOptionsService } from '../../../../../../shared/services/selectable-options.service';
import { SnackbarService } from '../../../../../../shared/utils/service/snackbar.service';
import { AlertRuleEditSingleModalComponent } from './alert-rule-edit-single-modal.component';

describe('AlertRuleEditSingleModalComponent', () => {
  let spectator: Spectator<AlertRuleEditSingleModalComponent>;
  const createComponent = createComponentFactory({
    component: AlertRuleEditSingleModalComponent,
    providers: [
      mockProvider(SnackbarService),
      mockProvider(CurrencyService, {
        getCurrentCurrency: jest.fn().mockReturnValue(of('EUR')),
      }),
      provideMomentDateAdapter(),
      mockProvider(TranslocoLocaleService, {}),
      {
        provide: MomentDateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
      },
      mockProvider(TranslocoLocaleService, {
        getLocale: () => 'DE-de',
      }),
      mockProvider(AlertRulesService, {
        getRuleTypeData: jest.fn().mockReturnValue(of([])),
      }),
      mockProvider(SelectableOptionsService, {
        get: jest.fn().mockReturnValue({
          options: [],
          loading: false,
          loadingError: null,
        }),
      }),
      MockProvider(MAT_DIALOG_DATA, {
        open: false,
        gridApi: {},
        alertRule: {},
        title: 'edit',
      }),
      mockProvider(MatDialogRef<AlertRuleEditSingleModalComponent>),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
