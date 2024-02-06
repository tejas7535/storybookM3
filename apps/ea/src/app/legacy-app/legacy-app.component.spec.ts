import { CommonModule } from '@angular/common';
import { SafeResourceUrl } from '@angular/platform-browser';

import { of } from 'rxjs';

import { LegacyAppService } from '@ea/core/services/legacy-app/legacy-app.service';
import { QualtricsInfoBannerComponent } from '@ea/shared/qualtrics-info-banner/qualtrics-info-banner.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent, MockModule } from 'ng-mocks';

import { BannerModule } from '@schaeffler/banner';

import { LegacyAppComponent } from './legacy-app.component';

describe('LegacyAppComponent', () => {
  let component: LegacyAppComponent;
  let spectator: Spectator<LegacyAppComponent>;

  const createComponent = createComponentFactory({
    component: LegacyAppComponent,
    imports: [
      CommonModule,
      MockModule(BannerModule),
      MockComponent(QualtricsInfoBannerComponent),
    ],
    providers: [
      {
        provide: LegacyAppService,
        useValue: {
          legacyAppUrl$: of<SafeResourceUrl>('legacyAppUrl'),
        },
      },
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain QualtricsInfoBannerComponent', () => {
    expect(spectator.query(QualtricsInfoBannerComponent)).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set safeLegacyAppUrl', () => {
      component.ngOnInit();

      expect(component.safeLegacyAppUrl).toEqual({
        changingThisBreaksApplicationSecurity: 'legacyAppUrl',
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroyed$', () => {
      component['destroyed$'].complete = jest.fn();

      component.ngOnDestroy();

      expect(component['destroyed$'].complete).toHaveBeenCalled();
    });
  });
});
