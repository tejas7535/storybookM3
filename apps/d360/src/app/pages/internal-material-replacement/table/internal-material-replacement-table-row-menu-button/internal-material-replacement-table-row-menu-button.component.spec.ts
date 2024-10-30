import { MatDialog } from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { InternalMaterialReplacementTableRowMenuButtonComponent } from './internal-material-replacement-table-row-menu-button.component';

describe('InternalMaterialReplacementTableRowMenuButtonComponent', () => {
  let spectator: Spectator<InternalMaterialReplacementTableRowMenuButtonComponent>;

  const createComponent = createComponentFactory({
    component: InternalMaterialReplacementTableRowMenuButtonComponent,
    providers: [mockProvider(MatDialog)],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
