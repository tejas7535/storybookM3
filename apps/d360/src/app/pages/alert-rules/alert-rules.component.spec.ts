import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { SelectableOptionsService } from '../../shared/services/selectable-options.service';
import { AlertRulesComponent } from './alert-rules.component';
import { AlertRuleTableComponent } from './table/components/alert-rule-table/alert-rule-table.component';

describe('AlertRulesComponent', () => {
  let spectator: Spectator<AlertRulesComponent>;
  const createComponent = createComponentFactory({
    component: AlertRulesComponent,
    componentMocks: [AlertRuleTableComponent],
    imports: [],
    providers: [
      mockProvider(SelectableOptionsService, {
        loading$: jest.fn().mockReturnValue(of(true)),
      }),
      mockProvider(HttpClient, { get: () => of({}) }),
      mockProvider(MatDialog),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
