import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BehaviorSubject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { AvailableLangs, TranslocoTestingModule } from '@ngneat/transloco';

import { MaterialModule } from '../../../shared/material.module';
import { MMLocales } from '../../services/locale/locale.enum';
import { LocaleService } from '../../services/locale/locale.service';
import { MMSeparator } from '../../services/locale/separator.enum';
import { SettingsComponent } from './settings.component';

const availableLangs: AvailableLangs = [
  { id: 'de', label: 'Deutsch' },
  { id: 'en', label: 'English' },
];
describe('SidebarComponent', () => {
  let component: SettingsComponent;
  let spectator: Spectator<SettingsComponent>;
  const language: BehaviorSubject<MMLocales> = new BehaviorSubject<MMLocales>(
    MMLocales.de
  );
  const separator: BehaviorSubject<MMSeparator> =
    new BehaviorSubject<MMSeparator>(MMSeparator.Comma);

  let localeService: LocaleService;

  const dialogClose = new BehaviorSubject<boolean>(undefined);
  const mockDialogRef = {
    afterClosed: () => dialogClose,
  };

  const createComponent = createComponentFactory({
    component: SettingsComponent,
    imports: [
      NoopAnimationsModule,
      TranslocoTestingModule,
      ReactiveFormsModule,
      MaterialModule,
    ],
    providers: [
      {
        provide: LocaleService,
        useValue: {
          getAvailableLangs: jest.fn(() => availableLangs),
          language$: language.asObservable(),
          separator$: separator.asObservable(),
          setSeparator: jest.fn(),
          setLocale: jest.fn(),
        },
      },
      {
        provide: MatDialog,
        useValue: {
          open: jest.fn(() => mockDialogRef),
        },
      },
    ],
    declarations: [SettingsComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    localeService = spectator.inject(LocaleService);
  });

  it('should create the app', () => {
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

  describe('#setLanguage', () => {
    it('should open the language dialog', () => {
      component.setLanguage('en');

      expect(component['dialog'].open).toHaveBeenCalled();
    });
    it('should setLocale and close sidenav on confirmation', () => {
      component.setLanguage('en');

      dialogClose.next(true);

      expect(localeService.setLocale).toHaveBeenCalledWith('en' as MMLocales);
    });
    it('should setValue on cancel', () => {
      component.languageSelectControl.setValue = jest.fn();
      component.setLanguage('en');

      dialogClose.next(false);

      expect(component.languageSelectControl.setValue).toHaveBeenCalled();
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
