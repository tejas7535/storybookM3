import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BomTableStatusBarComponent } from './bom-table-status-bar.component';

describe('BomTableStatusBarComponent', () => {
  let component: BomTableStatusBarComponent;
  let spectator: Spectator<BomTableStatusBarComponent>;

  const createComponent = createComponentFactory({
    component: BomTableStatusBarComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
