import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SpyObject } from '@ngneat/spectator/jest/lib/mock.js';
import { marbles } from 'rxjs-marbles';

import { BrowserDetectionService } from '@cdba/shared/services';

import { BrowserSupportDetectorComponent } from './browser-support-detector.component';

describe('BrowserSupportDetectorComponent', () => {
  let component: BrowserSupportDetectorComponent;
  let spectator: Spectator<BrowserSupportDetectorComponent>;
  let browserSupportDialog: SpyObject<MatDialog>;
  let browserDetectionService: SpyObject<BrowserDetectionService>;

  const createComponent = createComponentFactory({
    component: BrowserSupportDetectorComponent,
    mocks: [BrowserDetectionService, MatDialog],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    browserSupportDialog = spectator.inject(MatDialog);
    browserDetectionService = spectator.inject(BrowserDetectionService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test(
    'should display browser support dialog using an unsupported browser',
    marbles(() => {
      browserDetectionService.isUnsupportedBrowser.andReturn(true);

      component.ngOnInit();

      expect(browserSupportDialog.open).toHaveBeenCalled();
    })
  );

  test(
    'should not display browser support dialog using a supported browser',
    marbles(() => {
      browserDetectionService.isUnsupportedBrowser.andReturn(false);

      component.ngOnInit();
      expect(browserSupportDialog.open).not.toHaveBeenCalled();
    })
  );
});
