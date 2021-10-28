import { CommonModule } from '@angular/common';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { Breadcrumb, BreadcrumbsModule } from '@schaeffler/breadcrumbs';

import { SubheaderComponent } from './subheader.component';

describe('SubheaderComponent', () => {
  let component: SubheaderComponent;
  let spectator: Spectator<SubheaderComponent>;
  let router: Router;
  const createComponent = createComponentFactory({
    component: SubheaderComponent,
    imports: [
      CommonModule,
      MatIconModule,
      BreadcrumbsModule,
      RouterTestingModule,
    ],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    declarations: [SubheaderComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    router = spectator.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clickBackButton', () => {
    test('should emit backButtonClicked if no breadcrumbs provided', () => {
      component.backButtonClicked.emit = jest.fn();

      component.clickBackButton();

      expect(component.backButtonClicked.emit).toHaveBeenCalledTimes(1);
    });
    test('should navigate to second last breadcrumb', () => {
      router.navigate = jest.fn();
      const breadcrumbs: Breadcrumb[] = [
        { label: '1', url: '/1', queryParams: { param: 1 } },
        { label: '2', url: '/2', queryParams: { param: 2 } },
      ];
      component.breadcrumbs = breadcrumbs;
      component.backButtonClicked.emit = jest.fn();

      component.clickBackButton();

      expect(router.navigate).toHaveBeenCalledWith([breadcrumbs[0].url], {
        queryParams: breadcrumbs[0].queryParams,
      });
    });
  });
});
