import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { LetModule, PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { setNavigation } from '@mac/msd/store/actions/data';
import { DataFacade } from '@mac/msd/store/facades/data';
import { initialState } from '@mac/msd/store/reducers/data/data.reducer';

import * as en from '../../../../../assets/i18n/en.json';
import { MsdNavigationComponent } from './msd-navigation.component';

describe('MsdNavigationComponent', () => {
  let component: MsdNavigationComponent;
  let spectator: Spectator<MsdNavigationComponent>;
  let dataFacade: DataFacade;

  const createComponent = createComponentFactory({
    component: MsdNavigationComponent,
    imports: [
      CommonModule,
      MatListModule,
      MatExpansionModule,
      MatButtonModule,
      MatIconModule,
      PushModule,
      LetModule,
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          msd: {
            data: initialState,
          },
        },
      }),
      DataFacade,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    dataFacade = spectator.inject(DataFacade);

    dataFacade.dispatch = jest.fn();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should dispatch the initial navigation', () => {
      component.ngOnInit();

      expect(dataFacade.dispatch).toHaveBeenCalledWith(
        setNavigation({
          materialClass: MaterialClass.STEEL,
          navigationLevel: NavigationLevel.MATERIAL,
        })
      );
    });
  });

  describe('setActive', () => {
    it('should dispatch the action with the given values', () => {
      component.setActive(MaterialClass.ALUMINUM, NavigationLevel.SUPPLIER);

      expect(dataFacade.dispatch).toHaveBeenCalledWith(
        setNavigation({
          materialClass: MaterialClass.ALUMINUM,
          navigationLevel: NavigationLevel.SUPPLIER,
        })
      );
    });
  });

  describe('toggleSideBar', () => {
    it('should change the minimized value', () => {
      expect(component.minimized).toBe(false);

      component.toggleSideBar();

      expect(component.minimized).toBe(true);
    });
  });
});
