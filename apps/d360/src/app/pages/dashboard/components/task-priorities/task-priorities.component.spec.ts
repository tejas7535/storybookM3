import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { TaskPrioritiesComponent } from './task-priorities.component';

describe('TaskPrioritiesComponent', () => {
  let spectator: Spectator<TaskPrioritiesComponent>;
  const createComponent = createComponentFactory(TaskPrioritiesComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
