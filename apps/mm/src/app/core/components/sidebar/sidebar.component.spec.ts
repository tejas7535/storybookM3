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
import { SidebarComponent } from './sidebar.component';

const availableLangs: AvailableLangs = [
  { id: 'de', label: 'Deutsch' },
  { id: 'en', label: 'English' },
];
describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let spectator: Spectator<SidebarComponent>;
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
    component: SidebarComponent,
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
    declarations: [SidebarComponent],
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
      component['sidenav'].close = jest.fn();
      component.setLanguage('en');

      dialogClose.next(true);

      expect(localeService.setLocale).toHaveBeenCalledWith('en' as MMLocales);
      expect(component['sidenav'].close).toHaveBeenCalled();
    });
    it('should setValue on cancel', () => {
      component['sidenav'].close = jest.fn();
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

  describe('#toggle', () => {
    it('should call toggle the sidebar', () => {
      component['sidenav'].toggle = jest.fn();

      component.toggle();

      expect(component['sidenav'].toggle).toHaveBeenCalled();
    });
  });
});
