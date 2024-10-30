import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { IMRSubstitution } from '../../../../feature/internal-material-replacement/model';
import { RowMenuComponent } from './row-menu.component';

describe('RowMenuComponent', () => {
  let spectator: Spectator<RowMenuComponent<IMRSubstitution>>;

  const createComponent = createComponentFactory({
    component: RowMenuComponent<IMRSubstitution>,
    imports: [],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        open: false,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
