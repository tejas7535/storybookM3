import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
// eslint-disable-next-line no-restricted-imports
import { createMouseEvent } from '@ngneat/spectator';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FilterPricingCardComponent } from '../filter-pricing-card/filter-pricing-card.component';
import { QuantityDisplayComponent } from '../quantity/quantity-display/quantity-display.component';
import { AppRoutePath } from './../../../../app-route-path.enum';
import { DetailButtonComponent } from './detail-button.component';

describe('DetailButtonComponent', () => {
  let component: DetailButtonComponent;
  let spectator: Spectator<DetailButtonComponent>;
  let router: Router;

  const createComponent = createComponentFactory({
    component: DetailButtonComponent,
    detectChanges: false,
    imports: [
      MatCardModule,
      MatIconModule,
      PushPipe,
      RouterTestingModule,
      SharedPipesModule,
      MatMenuModule,

      provideTranslocoTestingModule({ en: {} }),
    ],
    declarations: [
      DetailButtonComponent,
      FilterPricingCardComponent,
      QuantityDisplayComponent,
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    router = spectator.inject(Router);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navigateClick', () => {
    test('should navigate to the given path', () => {
      router.navigate = jest.fn();
      component.path = 'path';

      component.navigateClick();

      expect(router.navigate).toHaveBeenCalledWith(['detail-view/path'], {
        queryParamsHandling: 'preserve',
      });
    });
  });

  describe('contextMenu', () => {
    delete global.window.location;
    global.window = Object.create(window);
    global.window.location = {
      origin: 'http://localhost',
      search: '?anyParams',
    } as Location;

    test('should call contextMenu', () => {
      const mouseEvent: MouseEvent = createMouseEvent('click', 100, 200);
      const mouseSpy = jest.spyOn(mouseEvent, 'preventDefault');

      component.contextMenu = {
        openMenu: jest.fn(),
      } as unknown as MatMenuTrigger;

      component.showContextMenu(mouseEvent);

      expect(component.contextMenu.openMenu).toHaveBeenCalled();
      expect(mouseSpy).toHaveBeenCalled();
    });

    test('should return correct url', () => {
      component.path = 'path';
      const result = component.getUrl();
      expect(result).toEqual(
        `http://localhost/${AppRoutePath.DetailViewPath}/${component.path}?anyParams`
      );
    });
  });
});
