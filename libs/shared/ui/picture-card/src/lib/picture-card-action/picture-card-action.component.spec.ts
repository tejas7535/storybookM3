import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { PictureCardActionComponent } from './picture-card-action.component';

describe('PictureCardActionComponent', () => {
  let component: PictureCardActionComponent;
  let spectator: Spectator<PictureCardActionComponent>;

  const createComponent = createComponentFactory({
    component: PictureCardActionComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
