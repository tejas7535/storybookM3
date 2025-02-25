import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { AlertService } from '../../feature/alerts/alert.service';
import { TaskPriorityGridComponent } from './components/task-priority-grid/task-priority-grid.component';
import { OverviewComponent } from './overview.component';

describe('OverviewComponent', () => {
  let spectator: Spectator<OverviewComponent>;
  const createComponent = createComponentFactory({
    component: OverviewComponent,
    imports: [MockComponent(TaskPriorityGridComponent)],
    providers: [mockProvider(AlertService, {})],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
