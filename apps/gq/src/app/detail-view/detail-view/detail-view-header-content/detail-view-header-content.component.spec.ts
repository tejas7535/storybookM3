import { MatChipsModule } from '@angular/material/chips';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DetailViewHeaderContentComponent } from './detail-view-header-content.component';

describe('DetailViewHeaderContentComponent', () => {
  let component: DetailViewHeaderContentComponent;
  let spectator: Spectator<DetailViewHeaderContentComponent>;

  const createComponent = createComponentFactory({
    component: DetailViewHeaderContentComponent,
    imports: [MatChipsModule, provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
