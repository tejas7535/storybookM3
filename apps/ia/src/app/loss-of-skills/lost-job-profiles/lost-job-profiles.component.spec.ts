import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { UnderConstructionModule } from '@schaeffler/empty-states';

import { LostJobProfilesComponent } from './lost-job-profiles.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('LostJobProfilesComponent', () => {
  let component: LostJobProfilesComponent;
  let spectator: Spectator<LostJobProfilesComponent>;

  const createComponent = createComponentFactory({
    component: LostJobProfilesComponent,
    detectChanges: false,
    imports: [UnderConstructionModule, AgGridModule],
    declarations: [LostJobProfilesComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
