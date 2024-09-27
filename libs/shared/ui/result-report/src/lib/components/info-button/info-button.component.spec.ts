import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { InfoButtonComponent } from './info-button.component';

describe('InfoButtonComponent', () => {
  let spectator: Spectator<InfoButtonComponent>;

  const createComponent = createComponentFactory({
    component: InfoButtonComponent,
    imports: [MockModule(MatTooltipModule), MatIconTestingModule],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
