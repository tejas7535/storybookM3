import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { BreadcrumbsService } from '@cdba/shared/services';
import {
  createDirectiveFactory,
  SpectatorDirective,
} from '@ngneat/spectator/jest';

import { BackButtonDirective } from './back-button.directive';

describe('BackButtonDirective', () => {
  let spectator: SpectatorDirective<BackButtonDirective>;
  let instance: BackButtonDirective;

  const createDirective = createDirectiveFactory({
    directive: BackButtonDirective,
    imports: [RouterTestingModule],
    providers: [
      {
        provide: BreadcrumbsService,
        useValue: {
          breadcrumbs$: of([]),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createDirective(
      `<div cdbaBackButton>Testing Back Button</div>`
    );

    instance = spectator.directive;
  });

  it('should get the instance', () => {
    expect(instance).toBeDefined();
  });

  it('should trigger navigateBack', () => {
    instance.navigateBack = jest.fn();

    spectator.dispatchMouseEvent(spectator.element, 'click');

    expect(instance.navigateBack).toHaveBeenCalled();
  });

  describe('ngOnInit', () => {
    test('should add subscription', () => {
      instance['subscription'].add = jest.fn();

      instance.ngOnInit();

      expect(instance['subscription'].add).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    test('should unsubscribe from components subscription', () => {
      instance['subscription'].unsubscribe = jest.fn();

      instance.ngOnDestroy();

      expect(instance['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });

  describe('navigateBack', () => {
    it('should route to the next-to-last breadcrumb', () => {
      instance['router'].navigate = jest.fn();
      instance['breadcrumbs'] = [
        {
          label: 'Search',
          url: '/search',
        },
        {
          label: 'Results',
          url: '/results',
          queryParams: {
            foo: 'bar',
          },
        },
        {
          label: 'Detail Bar',
        },
      ];

      instance.navigateBack();

      expect(instance['router'].navigate).toHaveBeenCalledWith(['/results'], {
        queryParams: {
          foo: 'bar',
        },
      });
    });

    it('should locate back as a fallback', () => {
      const spy = jest.spyOn(instance['location'], 'back');
      instance['breadcrumbs'] = undefined;

      instance.navigateBack();

      expect(spy).toHaveBeenCalled();
    });

    it('should locate back if breadcrumbs length  < 2', () => {
      const spy = jest.spyOn(instance['location'], 'back');
      instance['breadcrumbs'] = [
        {
          label: 'Search',
          url: '/search',
        },
      ];

      instance.navigateBack();

      expect(spy).toHaveBeenCalled();
    });
  });
});
