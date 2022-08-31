import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { InfoIconModule } from '../../../components/info-icon/info-icon.module';
import {
  HeaderInfoIconComponent,
  HeaderInfoIconComponentParams,
} from './header-info-icon.component';

describe('HeaderInfoIconComponent', () => {
  let component: HeaderInfoIconComponent;
  let spectator: Spectator<HeaderInfoIconComponent>;

  const DEFAULT_PARAMS = {
    column: {
      addEventListener: jest.fn(),
      isSortAscending: jest.fn(),
      isSortDescending: jest.fn(),
    } as any,
    api: {
      addEventListener: jest.fn(),
    } as any,
    showColumnMenu: jest.fn(),
    setSort: jest.fn(),
  };
  const createComponent = createComponentFactory({
    component: HeaderInfoIconComponent,
    imports: [InfoIconModule, provideTranslocoTestingModule({ en: {} })],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });
  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('tooltip', () => {
    test('should show tooltip if provided', () => {
      component.params = {
        displayName: 'text',
        tooltipText: 'tooltip-text',
      } as HeaderInfoIconComponentParams;

      spectator.detectChanges();

      const infoIcon = spectator.query('gq-info-icon');

      expect(infoIcon).toBeTruthy();
      expect(infoIcon.textContent.trim()).toEqual('info_outline');
    });

    test('should NOT show tooltip if not provided', () => {
      component.params = {
        displayName: 'text',
      } as HeaderInfoIconComponentParams;

      spectator.detectChanges();

      const infoIcon = spectator.query('gq-info-icon');

      expect(infoIcon).toBeFalsy();
    });
  });

  describe('agInit', () => {
    test('should set params and apply sortChanged', () => {
      component.onSortChanged = jest.fn();

      component.agInit(DEFAULT_PARAMS as any);

      expect(component.params.column.addEventListener).toBeCalledTimes(1);
      expect(component.params.column.addEventListener).toHaveBeenCalledWith(
        'sortChanged',
        expect.any(Function)
      );
      expect(component.onSortChanged).toHaveBeenCalledTimes(1);
      expect(component.params).toEqual(DEFAULT_PARAMS);
    });
  });
  describe('onSortChanged', () => {
    it('should set the sort to asc from the params', () => {
      component.params = {
        ...DEFAULT_PARAMS,
        column: {
          isSortAscending: jest.fn().mockReturnValue(true),
          isSortDescending: jest.fn().mockReturnValue(false),
        } as any,
      } as any;

      spectator.detectChanges();
      expect(component.sort).toEqual(undefined);

      component.onSortChanged();
      expect(component.sort).toEqual('asc');
    });

    it('should set the sort to desc from the params', () => {
      component.params = {
        ...DEFAULT_PARAMS,
        column: {
          isSortAscending: jest.fn().mockReturnValue(false),
          isSortDescending: jest.fn().mockReturnValue(true),
        } as any,
      } as any;

      spectator.detectChanges();
      expect(component.sort).toEqual(undefined);

      component.onSortChanged();
      expect(component.sort).toEqual('desc');
    });

    it('should set the sort to none from the params', () => {
      component.params = {
        ...DEFAULT_PARAMS,
        column: {
          isSortAscending: jest.fn().mockReturnValue(false),
          isSortDescending: jest.fn().mockReturnValue(false),
        } as any,
      } as any;

      spectator.detectChanges();
      expect(component.sort).toEqual(undefined);

      component.onSortChanged();
      expect(component.sort).toEqual(undefined);
    });
  });
  describe('onMenuClicked', () => {
    it('should call the showColumnMenu function', () => {
      component.params = DEFAULT_PARAMS as any;
      component.menuButton = { nativeElement: {} } as any;
      component.onMenuClicked({
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
      } as any);

      expect(component.params.showColumnMenu).toHaveBeenCalledWith(
        component.menuButton.nativeElement
      );
    });
  });
  describe('onSortRequested', () => {
    it('should call setSort with undefined if it was desc', () => {
      component.params = DEFAULT_PARAMS as any;

      component.sort = 'desc';
      spectator.detectChanges();

      component.onSortRequested({ shiftKey: false } as MouseEvent);

      expect(component.params.setSort).toHaveBeenCalledWith(undefined, false);
    });

    it('should call setSort with asc if it was none', () => {
      component.params = DEFAULT_PARAMS as any;

      component.sort = undefined;
      spectator.detectChanges();

      component.onSortRequested({ shiftKey: false } as MouseEvent);

      expect(component.params.setSort).toHaveBeenCalledWith('asc', false);
    });

    it('should call setSort with desc if it was asc', () => {
      component.params = DEFAULT_PARAMS as any;

      component.sort = 'asc';
      spectator.detectChanges();

      component.onSortRequested({ shiftKey: false } as MouseEvent);

      expect(component.params.setSort).toHaveBeenCalledWith('desc', false);
    });
  });
  describe('refresh', () => {
    test('should return false', () => {
      expect(component.refresh()).toBeFalsy();
    });
  });
});
