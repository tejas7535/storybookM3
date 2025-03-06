import { SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideRouter, Router } from '@angular/router';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { IRowNode } from 'ag-grid-community';
import { MockDirective, MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DETAIL_STATE_MOCK } from '@cdba/testing/mocks';

import { CompareButtonComponent } from './compare-button.component';

describe('CompareButtonComponent', () => {
  let spectator: Spectator<CompareButtonComponent>;
  let component: CompareButtonComponent;
  let router: Router;

  const createComponent = createComponentFactory({
    component: CompareButtonComponent,
    detectChanges: false,
    imports: [
      MockDirective(LetDirective),
      MockModule(MatButtonModule),
      MockModule(MatTooltipModule),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideRouter([]),
      provideMockStore({
        initialState: {
          search: {
            referenceTypes: {
              selectedNodeIds: ['2', '4'],
            },
          },
          detail: DETAIL_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    router = spectator.inject(Router);

    router.navigate = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should update row nodes', () => {
      spectator.setInput('selectedNodes', []);

      component.ngOnChanges({
        selectedNodes: { currentValue: [{ id: '0' } as IRowNode] },
      } as unknown as SimpleChanges);

      expect(component.selectedNodes).toEqual([{ id: '0' } as IRowNode]);
    });
  });

  describe('getTooltip', () => {
    it('should get min count tooltip', () => {
      const translocoSpy = jest.spyOn(component['transloco'], 'translate');
      component.selectedNodes = [{}] as IRowNode[];

      expect(component.getTooltip()).toBe('shared.statusBar.hints.minCount');
      expect(translocoSpy).toHaveBeenCalledWith(
        'shared.statusBar.hints.minCount',
        {
          count: 2,
        }
      );
    });

    it('should get max count tooltip', () => {
      const translocoSpy = jest.spyOn(component['transloco'], 'translate');
      component.selectedNodes = [{}, {}, {}] as IRowNode[];

      expect(component.getTooltip()).toBe('shared.statusBar.hints.maxCount');
      expect(translocoSpy).toHaveBeenCalledWith(
        'shared.statusBar.hints.maxCount',
        {
          count: 2,
        }
      );
    });
  });

  describe('showCompareView', () => {
    beforeEach(() => {
      component.selectedNodes = [
        {
          id: '0',
          data: { materialNumber: '1234', plant: '0060' },
        } as unknown as IRowNode,
        {
          id: '1',
          data: { materialNumber: '5678', plant: '0076' },
        } as unknown as IRowNode,
      ] as IRowNode[];
    });

    it('should add node id and should route to compare screen if coming from detail page', () => {
      router.routerState.snapshot.url = '/detail/detail';

      component.showCompareView();

      expect(router.navigate).toHaveBeenCalledWith(['compare'], {
        queryParams: {
          material_number_item_1: '1234',
          plant_item_1: '0060',
          node_id_item_1: '0',
          material_number_item_2: '5678',
          plant_item_2: '0076',
          node_id_item_2: '1',
        },
      });
    });

    it('should not add node id and should route to compare screen if coming from results page', () => {
      router.routerState.snapshot.url = '/results';

      component.showCompareView();

      expect(router.navigate).toHaveBeenCalledWith(['compare'], {
        queryParams: {
          material_number_item_1: '1234',
          plant_item_1: '0060',
          material_number_item_2: '5678',
          plant_item_2: '0076',
        },
      });
    });
  });
});
