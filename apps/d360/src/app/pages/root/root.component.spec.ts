import { of } from 'rxjs';

import { AppRoutePath } from '../../app.routes.enum';
import { Stub } from '../../shared/test/stub.class';
import { RootComponent } from './root.component';

describe('RootComponent', () => {
  let component: RootComponent;

  beforeEach(() => {
    component = Stub.get<RootComponent>({
      component: RootComponent,
      providers: [
        Stub.getAuthServiceProvider(),
        Stub.getUserServiceProvider(),
        Stub.getRouterProvider(),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should navigate to start page on settings loaded', () => {
      const startPage = AppRoutePath.OverviewPage;
      component['userService'].settingsLoaded$.next(true);
      jest
        .spyOn(component['userService'], 'getStartPage')
        .mockReturnValue(of(startPage));
      jest
        .spyOn(component['router'], 'navigate')
        .mockImplementation(() => Promise.resolve(true));

      component.ngOnInit();

      expect(component['userService'].settingsLoaded$).toBeTruthy();
      expect(component['userService'].getStartPage).toHaveBeenCalled();
      expect(component['router'].navigate).toHaveBeenCalledWith([startPage]);
    });

    it('should not navigate if settings are not loaded', () => {
      jest
        .spyOn(component['userService'], 'getStartPage')
        .mockReturnValue(of(AppRoutePath.OverviewPage));
      jest
        .spyOn(component['router'], 'navigate')
        .mockImplementation(() => Promise.resolve(true));

      component['userService'].settingsLoaded$.next(false);
      component.ngOnInit();

      expect(component['userService'].getStartPage).not.toHaveBeenCalled();
      expect(component['router'].navigate).not.toHaveBeenCalled();
    });
  });
});
