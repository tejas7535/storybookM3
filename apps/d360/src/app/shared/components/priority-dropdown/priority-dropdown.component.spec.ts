import { translate } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { Priority } from '../../../feature/alerts/model';
import { PriorityDropdownComponent } from './priority-dropdown.component';

describe('PriorityDropdownComponent', () => {
  let spectator: Spectator<PriorityDropdownComponent>;
  let priorityDropdown: PriorityDropdownComponent;
  const createComponent = createComponentFactory(PriorityDropdownComponent);

  beforeEach(() => {
    spectator = createComponent();
    priorityDropdown = spectator.component;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should emit the priorities for the SelectableValues', (done) => {
    priorityDropdown.selectionChange.subscribe((value) => {
      expect(value).toEqual([Priority.Priority1, Priority.Priority2]);
      done();
    });
    priorityDropdown['onPrioritySelectionChange']([
      {
        id: '1',
        text: translate('overview.yourTasks.priority1'),
      },
      {
        id: '2',
        text: translate('overview.yourTasks.priority2'),
      },
    ]);
  });
});
