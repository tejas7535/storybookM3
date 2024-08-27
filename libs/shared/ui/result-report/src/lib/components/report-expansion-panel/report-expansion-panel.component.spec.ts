import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { ReportExpansionPanelComponent } from './report-expansion-panel.component';

describe('ReportExpansionPanelComponent', () => {
  let spectator: Spectator<ReportExpansionPanelComponent>;

  const createComponent = createComponentFactory({
    component: ReportExpansionPanelComponent,
    imports: [MatIconTestingModule, MatExpansionModule, NoopAnimationsModule],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
