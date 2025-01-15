/* tslint:disable:no-unused-variable */

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ShowMoreRowsComponent } from './show-more-rows.component';

describe('ShowMoreRowsComponent', () => {
  let component: ShowMoreRowsComponent;
  let spectator: Spectator<ShowMoreRowsComponent>;

  const DEFAULT_PARAMS = {
    data: {
      parentMaterialDescription: 'test',
    },
    amountToAdd: 2,
    context: {
      componentParent: {
        showMoreRowsClicked: jest.fn(),
      },
    },
  } as unknown as ICellRendererParams & { amountToAdd: number };

  const createComponent = createComponentFactory({
    component: ShowMoreRowsComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set params', () => {
      component.agInit(DEFAULT_PARAMS);
      expect(component.params).toEqual(DEFAULT_PARAMS);
      expect(component.value).toEqual('test');
      expect(component.amountToAdd).toEqual(2);
    });
  });

  describe('clickShowMoreRows', () => {
    test('should call showMoreRowsClicked on parent component', () => {
      const mouseEvent: MouseEvent = {
        preventDefault: jest.fn(),
      } as unknown as MouseEvent;
      const mouseSpy = jest.spyOn(mouseEvent, 'preventDefault');
      component.agInit(DEFAULT_PARAMS);

      component.clickShowMoreRows(mouseEvent);

      expect(
        component.params.context.componentParent.showMoreRowsClicked
      ).toHaveBeenCalledWith('test');
      expect(mouseSpy).toHaveBeenCalledTimes(1);
    });
  });
});
