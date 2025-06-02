import { Stub } from '../../../../test/stub.class';
import {
  ActionsMenuCellRendererComponent,
  MenuItem,
} from './actions-menu-cell-renderer.component';

describe('ActionsMenuCellRendererComponent', () => {
  let component: ActionsMenuCellRendererComponent;

  beforeEach(() => {
    component = Stub.get<ActionsMenuCellRendererComponent>({
      component: ActionsMenuCellRendererComponent,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set menu items correctly', () => {
    const mockMenuItems: MenuItem[] = [
      { text: 'Item 1', onClick: jest.fn() },
      { text: 'Item 2', onClick: jest.fn(), showDivider: true },
    ];

    component['parameters'] = {
      context: { getMenu: () => mockMenuItems },
    } as any;
    component['setValue']();

    expect(component['value']).toEqual(mockMenuItems);
  });

  it('should disable the menu when isDisabled is true', () => {
    component['parameters'] = { context: { isDisabled: () => true } } as any;
    component['setValue']();

    expect(component['isDisabled']()).toBe(true);
  });

  it('should enable the menu when isDisabled is false', () => {
    component['parameters'] = { context: { isDisabled: () => false } } as any;
    component['setValue']();

    expect(component['isDisabled']()).toBe(false);
  });
});
