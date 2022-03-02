import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockModule } from 'ng-mocks';

import { Breadcrumb } from '../../breadcrumb.model';
import { BreadcrumbsComponent } from './breadcrumbs.component';

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let spectator: Spectator<BreadcrumbsComponent>;

  const breadcrumbs: Breadcrumb[] = [
    { label: 'Home', url: '/url', tooltip: 'More homepage information' },
    { label: 'Page 1', url: '/url', tooltip: 'First page after home' },
    { label: 'Page 2', url: '/url', tooltip: '' },
    { label: 'Page 3', url: '/url', tooltip: '' },
    { label: 'Page 4', url: '/url', tooltip: '' },
    { label: 'Page 5', url: '/url', tooltip: 'What a page' },
    { label: 'Page 6', tooltip: '' },
  ];

  const breadcrumbsLength = breadcrumbs.length;
  const breadcrumbsIndexMax = breadcrumbsLength - 1;

  const createComponent = createComponentFactory({
    component: BreadcrumbsComponent,
    imports: [
      MockModule(MatIconModule),
      MockModule(MatMenuModule),
      RouterTestingModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    component.breadcrumbs = breadcrumbs;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });

  describe('showTruncation', () => {
    test('should return truncation status', () => {
      expect(component.showTruncation()).toEqual(false);

      component.truncateAfter = 2;
      expect(component.showTruncation()).toEqual(true);

      component.truncateAfter = 0;
      expect(component.showTruncation()).toEqual(false);
    });
  });

  describe('showTruncateMenu', () => {
    test('should return truncate menu status', () => {
      expect(component.showTruncateMenu()).toEqual(false);

      component.truncateAfter = breadcrumbsIndexMax - 1;
      expect(component.showTruncateMenu()).toEqual(true);

      component.truncateAfter = breadcrumbsIndexMax;
      expect(component.showTruncateMenu()).toEqual(false);
    });
  });

  describe('showItemBeforeTruncateMenu', () => {
    test('should return status for items before the truncate menu', () => {
      expect(component.showItemBeforeTruncateMenu(0)).toEqual(true);
      expect(component.showItemBeforeTruncateMenu(1)).toEqual(true);
      expect(component.showItemBeforeTruncateMenu(breadcrumbsIndexMax)).toEqual(
        true
      );

      component.truncateAfter = breadcrumbsIndexMax;
      expect(component.showItemBeforeTruncateMenu(0)).toEqual(true);
      expect(component.showItemBeforeTruncateMenu(1)).toEqual(false);
      expect(component.showItemBeforeTruncateMenu(breadcrumbsIndexMax)).toEqual(
        false
      );
    });
  });

  describe('showItemAfterTruncateMenu', () => {
    test('should return status for items after the truncate menu', () => {
      expect(component.showItemAfterTruncateMenu(0)).toEqual(false);
      expect(component.showItemAfterTruncateMenu(1)).toEqual(false);
      expect(component.showItemAfterTruncateMenu(breadcrumbsIndexMax)).toEqual(
        false
      );

      component.truncateAfter = breadcrumbsIndexMax;
      expect(component.showItemAfterTruncateMenu(0)).toEqual(false);
      expect(component.showItemAfterTruncateMenu(1)).toEqual(true);
      expect(component.showItemAfterTruncateMenu(breadcrumbsIndexMax)).toEqual(
        true
      );

      component.truncateAfter = breadcrumbsIndexMax - 1;
      expect(component.showItemAfterTruncateMenu(0)).toEqual(false);
      expect(component.showItemAfterTruncateMenu(1)).toEqual(false);
      expect(component.showItemAfterTruncateMenu(breadcrumbsIndexMax)).toEqual(
        true
      );
    });
  });
});
