import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { SelectableOptionsService } from '../../shared/services/selectable-options.service';
import { TestPageComponent } from './test-page.component';

describe('TestPageComponent', () => {
  let spectator: Spectator<TestPageComponent>;

  const createComponent = createComponentFactory({
    component: TestPageComponent,
    providers: [mockProvider(SelectableOptionsService)],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
