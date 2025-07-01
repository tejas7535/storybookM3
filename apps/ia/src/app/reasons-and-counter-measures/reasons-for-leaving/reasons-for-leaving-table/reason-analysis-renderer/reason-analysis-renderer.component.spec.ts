import { ElementRef } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { GridApi, ICellRendererParams, IRowNode } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AnalysisData } from '../../../models';
import { ReasonAnalysisRendererComponent } from './reason-analysis-renderer.component';

describe('ReasonAnalysisRendererComponent', () => {
  let component: ReasonAnalysisRendererComponent;
  let spectator: Spectator<ReasonAnalysisRendererComponent>;

  const createComponent = createComponentFactory({
    component: ReasonAnalysisRendererComponent,
    detectChanges: false,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct class', () => {
    expect(spectator.element).toHaveClass('block my-1 ml-1 mr-4');
  });

  it('should have the correct class binding when loading is false', () => {
    component.data = { loading: false } as unknown as AnalysisData;

    spectator.detectChanges();

    expect(spectator.element).not.toHaveClass('h-[90%]');
  });

  describe('agInit', () => {
    it('should set the data and api', () => {
      const data = { loading: false } as unknown as AnalysisData;
      const api = {} as unknown as any;
      const node = {} as unknown as IRowNode<AnalysisData>;
      component.redrawRows = jest.fn();

      component.agInit({
        data,
        api,
        node,
      } as unknown as ICellRendererParams<AnalysisData>);

      expect(component.data).toBe(data);
      expect(component.api).toBe(api);
      expect(component.node).toBe(node);
      expect(component.redrawRows).toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('should return false', () => {
      expect(component.refresh()).toBeFalsy();
    });
  });

  describe('toggleExpand', () => {
    it('should toggle the expand', () => {
      component.data = {
        loading: false,
        reasonId: 12,
      } as unknown as AnalysisData;
      component.redrawRows = jest.fn();

      component.toggleExpand(12);

      expect(component.expanded).toBeTruthy();
      expect(component.redrawRows).toHaveBeenCalled();
    });

    it('should not toggle the expand when data is not set', () => {
      component.data = undefined;
      component.redrawRows = jest.fn();

      component.toggleExpand(undefined as number);

      expect(component.expanded).toBeFalsy();
      expect(component.redrawRows).not.toHaveBeenCalled();
    });
  });

  describe('redrawRows', () => {
    it('should set the row height and call onRowHeightChanged', fakeAsync(() => {
      const offsetHeight = 100;
      component.node = {
        setRowHeight: jest.fn(),
      } as unknown as IRowNode<AnalysisData>;
      component.api = { onRowHeightChanged: jest.fn() } as unknown as GridApi;
      component.elRef = {
        nativeElement: { offsetHeight },
      } as unknown as ElementRef;

      component.redrawRows();

      tick(1);
      expect(component.node.setRowHeight).toHaveBeenCalledWith(
        offsetHeight + component.PADDING
      );
      expect(component.api.onRowHeightChanged).toHaveBeenCalled();
    }));
  });
});
