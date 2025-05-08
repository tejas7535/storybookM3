import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { HeaderInformationComponent } from './header-information/header-information.component';
import { InformationComponent } from './information.component';
import { PositionInformationComponent } from './position-information/position-information.component';

describe('InformationComponent', () => {
  let component: InformationComponent;
  let spectator: Spectator<InformationComponent>;

  const createComponent = createComponentFactory({
    component: InformationComponent,
    imports: [
      PositionInformationComponent,
      HeaderInformationComponent,
      provideTranslocoTestingModule({ en: {} }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
