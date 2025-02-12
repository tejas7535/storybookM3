import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { IHeaderParams } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PmgmAssessmentHeaderComponent } from './pmgm-assessment-header.component';

describe('PmgmAssessmentHeaderComponent', () => {
  let component: PmgmAssessmentHeaderComponent;
  let spectator: Spectator<PmgmAssessmentHeaderComponent>;

  const createComponent = createComponentFactory({
    component: PmgmAssessmentHeaderComponent,
    detectChanges: false,
    imports: [provideTranslocoTestingModule({ en: {} })],
    declarations: [PmgmAssessmentHeaderComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set header name, add event listener and set sort', () => {
      const params = {
        displayName: 'some name',
        column: {
          addEventListener: jest.fn(),
          getSort: jest.fn(() => 'desc'),
        },
      } as unknown as IHeaderParams;

      component.agInit(params);

      expect(component.displayName).toBe('some name');
      expect(params.column.addEventListener).toHaveBeenCalled();
      expect(component.sort).toBe('desc');
    });
  });

  describe('refresh', () => {
    test('should return false', () => {
      expect(component.refresh()).toBeFalsy();
    });
  });

  describe('onSortChanged', () => {
    test('should set sort to asc', () => {
      component.params = {
        column: {
          getSort: jest.fn(() => 'asc'),
        },
      } as unknown as IHeaderParams;

      component.onSortChanged();

      expect(component.sort).toBe('asc');
    });
  });

  describe('onSortRequested', () => {
    beforeEach(() => {
      component.params = {
        setSort: jest.fn(),
      } as unknown as IHeaderParams;
    });

    test('should set sort to asc when sorting off', () => {
      const event = { shiftKey: false } as MouseEvent;
      component.sort = undefined;

      component.onSortRequested(event);

      expect(component.params.setSort).toHaveBeenCalledWith('asc', false);
    });

    test('should set sort to desc', () => {
      const event = { shiftKey: false } as MouseEvent;
      component.sort = 'asc';

      component.onSortRequested(event);

      expect(component.params.setSort).toHaveBeenCalledWith('desc', false);
    });

    test('should set sort to asc', () => {
      const event = { shiftKey: false } as MouseEvent;
      component.sort = undefined;

      component.onSortRequested(event);

      expect(component.params.setSort).toHaveBeenCalledWith('asc', false);
    });

    test('should set sort to asc with shift key', () => {
      const event = { shiftKey: true } as MouseEvent;
      component.sort = undefined;

      component.onSortRequested(event);

      expect(component.params.setSort).toHaveBeenCalledWith('asc', true);
    });
  });
});
