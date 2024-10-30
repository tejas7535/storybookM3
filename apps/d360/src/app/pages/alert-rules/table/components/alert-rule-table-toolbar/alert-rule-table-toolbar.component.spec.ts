import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { AlertRuleTableToolbarComponent } from './alert-rule-table-toolbar.component';

describe('AlertRuleTableToolbarComponent', () => {
  let spectator: Spectator<AlertRuleTableToolbarComponent>;
  const createComponent = createComponentFactory({
    component: AlertRuleTableToolbarComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
