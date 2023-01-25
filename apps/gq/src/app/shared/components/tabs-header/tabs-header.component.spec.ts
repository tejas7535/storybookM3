import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';

import { createMouseEvent } from '@ngneat/spectator';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { Tab } from './tab.model';
import { TabsHeaderComponent } from './tabs-header.component';

describe('TabsHeaderComponent', () => {
  let component: TabsHeaderComponent;
  let spectator: Spectator<TabsHeaderComponent>;

  const createComponent = createComponentFactory({
    component: TabsHeaderComponent,
    imports: [
      MatIconModule,
      MatTabsModule,
      MatButtonModule,
      MatTooltipModule,
      RouterTestingModule,
      MatMenuModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
      mockProvider(MouseEvent, {
        preventDefault: jest.fn(),
      }),
    ],
    declarations: [TabsHeaderComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
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
      const tab: Tab = {
        label: 'any',
        link: 'a link',
        parentPath: 'a parent Path',
      };
      component.contextMenu = {
        openMenu: jest.fn(),
      } as unknown as MatMenuTrigger;

      component.showContextMenu(mouseEvent, tab);

      expect(component.contextMenu.openMenu).toHaveBeenCalled();
      expect(mouseSpy).toHaveBeenCalled();
    });

    test('should return correct url', () => {
      const tab: Tab = {
        link: 'link',
        parentPath: 'parentPath',
        label: 'anyLabel',
      };

      const result = component.getUrl(tab);
      expect(result).toEqual('http://localhost/parentPath/link?anyParams');
    });
  });
});
