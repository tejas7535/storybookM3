import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BehaviorSubject } from 'rxjs';

import { OneTrustModule } from '@altack/ngx-onetrust';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { MockModule } from 'ng-mocks';

import { COOKIE_GROUPS } from '@schaeffler/application-insights';
import { LanguageSelectModule } from '@schaeffler/transloco/components';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { LocaleService } from '../../services/locale/locale.service';
import { MMSeparator } from '../../services/locale/separator.enum';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let spectator: Spectator<SettingsComponent>;
  const separator: BehaviorSubject<MMSeparator> =
    new BehaviorSubject<MMSeparator>(MMSeparator.Comma);

  let localeService: LocaleService;

  const createComponent = createComponentFactory({
    component: SettingsComponent,
    imports: [
      NoopAnimationsModule,
      TranslocoTestingModule,
      ReactiveFormsModule,
      MockModule(MatFormFieldModule),
      MockModule(MatSelectModule),
      MockModule(LanguageSelectModule),
      provideTranslocoTestingModule({ en: {} }),
      OneTrustModule.forRoot({
        cookiesGroups: COOKIE_GROUPS,
        domainScript: 'mockOneTrustId',
      }),
    ],
    providers: [
      {
        provide: LocaleService,
        useValue: {
          separator$: separator.asObservable(),
          setSeparator: jest.fn(),
          setLocale: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    localeService = spectator.inject(LocaleService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('#setSeperator', () => {
    it('should set the separator', () => {
      component.setSeparator(MMSeparator.Point);

      expect(localeService.setSeparator).toHaveBeenCalledWith(
        MMSeparator.Point
      );
    });
  });

  describe('#ngOnDestroy', () => {
    it('should unsubscribe on destroy', () => {
      component['subscription'].unsubscribe = jest.fn();

      component.ngOnDestroy();

      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });

  describe('#trackByFn', () => {
    it('should return index', () => {
      const index = 5;
      const result = component.trackByFn(index);

      expect(result).toBe(index);
    });
  });
});
