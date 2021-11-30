import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { ICellRendererParams } from '@ag-grid-enterprise/all-modules';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { ActionsCellRendererComponent } from './actions-cell-renderer.component';

describe('ActionsCellRendererComponent', () => {
  let component: ActionsCellRendererComponent;
  let spectator: Spectator<ActionsCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: ActionsCellRendererComponent,
    imports: [MatIconModule],
    providers: [
      mockProvider(ApplicationInsightsService),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should define downloadUrl', () => {
      const params = { value: 'foo/bar' } as unknown as ICellRendererParams;

      component.agInit(params);

      expect(component.downloadUrl).toEqual('foo/bar');
    });
  });

  describe('donwload', () => {
    it('should track download as AI metric', () => {
      const aiService = spectator.inject(ApplicationInsightsService);
      component.downloadUrl = 'foo/bar';

      component.download(component.downloadUrl);

      expect(aiService.logEvent).toHaveBeenCalledWith('Download Drawing', {
        downloadUrl: component.downloadUrl,
      });
    });
  });
});
