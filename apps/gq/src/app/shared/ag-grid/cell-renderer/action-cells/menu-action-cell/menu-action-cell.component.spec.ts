import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MenuActionCellComponent } from './menu-action-cell.component';
import { MenuItemCellRendererParams } from './model/menu-item-cell-renderer-params.interface';

describe('MenuActionCellComponent', () => {
  let component: MenuActionCellComponent;

  let spectator: Spectator<MenuActionCellComponent>;

  const createComponent = createComponentFactory({
    component: MenuActionCellComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('agInit', () => {
    const cellParams = {
      menuItems: [
        {
          label: 'Test',
          icon: 'test',
          action: () => {},
        },
      ],
      menuDisabled: false,
    } as unknown as MenuItemCellRendererParams;

    test('should set menuItems from Params', () => {
      component.agInit(cellParams);
      expect(component.menuItems).toEqual(cellParams.menuItems);
    });
    test('should set menuDisabled from Params', () => {
      component.agInit(cellParams);
      expect(component.menuDisabled).toEqual(cellParams.menuDisabled);
    });
  });
});
