import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PositionInformationComponent } from './position-information.component';

describe('PositionInformationComponent', () => {
  let component: PositionInformationComponent;
  let spectator: Spectator<PositionInformationComponent>;

  const createComponent = createComponentFactory({
    component: PositionInformationComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
