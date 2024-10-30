import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { TableToolbarComponent } from './table-toolbar.component';

describe('TableToolbarComponent', () => {
  let spectator: Spectator<TableToolbarComponent>;
  const createComponent = createComponentFactory({
    component: TableToolbarComponent,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        rowCount: 0,
        grid: null,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
