import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './overview.component';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let spectator: Spectator<OverviewComponent>;

  const createComponent = createComponentFactory({
    component: OverviewComponent,
    imports: [
      OverviewRoutingModule,
      MatCardModule,
      MatIconModule,
      FlexLayoutModule,
      RouterTestingModule,
    ],
    declarations: [OverviewComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('trackByFn', () => {
    it('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });
});
