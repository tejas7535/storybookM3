import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BehaviorSubject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { AvailableLangs, TranslocoTestingModule } from '@ngneat/transloco';

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

  const createComponent = createComponentFactory({
    component: SidebarComponent,
    imports: [
      NoopAnimationsModule,
      TranslocoTestingModule,
      ReactiveFormsModule,
      MatSidenavModule,
      MatSelectModule,
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
    ],
    declarations: [SidebarComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    localeService = spectator.inject(LocaleService);
  });

  test('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set the separator', () => {
    component.setSeparator(MMSeparator.Point);

    expect(localeService.setSeparator).toHaveBeenCalledWith(MMSeparator.Point);
  });

  it('it should set the language', () => {
    component.setLanguage('en');

    expect(localeService.setLocale).toHaveBeenCalledWith('en' as MMLocales);
  });

  it('should unsubscribe on destroy', () => {
    component['subscription'].unsubscribe = jest.fn();

    component.ngOnDestroy();

    expect(component['subscription'].unsubscribe).toHaveBeenCalled();
  });

  it('should call toggle the sidebar', () => {
    component['sidenav'].toggle = jest.fn();

    component.toggle();

    expect(component['sidenav'].toggle).toHaveBeenCalled();
  });
});
