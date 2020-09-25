import { MatCardModule } from '@angular/material/card';

import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { GreaseMonitorComponent } from './grease-monitor.component';

describe('GreaseStatusComponent', () => {
  let component: GreaseMonitorComponent;
  let spectator: Spectator<GreaseMonitorComponent>;

  const createComponent = createComponentFactory({
    component: GreaseMonitorComponent,
    imports: [MatCardModule, AgGridModule.withComponents([])],
    declarations: [GreaseMonitorComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
