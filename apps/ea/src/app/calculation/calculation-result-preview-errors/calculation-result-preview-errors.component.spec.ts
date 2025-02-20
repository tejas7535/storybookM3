import { MatDialog } from '@angular/material/dialog';

import { CalculationResultPreviewItem } from '@ea/core/store/models';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationPreviewErrorsDialogComponent } from '../calculation-preview-errors-dialog/calculation-preview-errors-dialog.component';
import { CalculationResultPreviewErrorsComponent } from './calculation-result-preview-errors.component';

describe('CalculationResultPreviewErrorsComponent', () => {
  let spectator: Spectator<CalculationResultPreviewErrorsComponent>;
  let component: CalculationResultPreviewErrorsComponent;

  const createComponent = createComponentFactory({
    component: CalculationResultPreviewErrorsComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        provide: MatDialog,
        useValue: {
          open: jest.fn(),
        },
      },
    ],
  });

  let mockResizeObserver: jest.Mock;
  let mockMutationObserver: jest.Mock;

  beforeEach(() => {
    mockResizeObserver = jest.fn().mockImplementation((_callback) => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    mockMutationObserver = jest.fn().mockImplementation((_callback) => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }));

    window.ResizeObserver = mockResizeObserver;
    window.MutationObserver = mockMutationObserver;

    spectator = createComponent({
      props: {
        errorTitle: 'Calculation Errors',
        errors: ['Error 1', 'Error 2'],
        downstreamErrors: ['Downstream Error 1'],
        overlayData: [
          {
            title: 'emissions',
          } as Partial<CalculationResultPreviewItem> as CalculationResultPreviewItem,
          {
            title: 'frictionalPowerloss',
          } as Partial<CalculationResultPreviewItem> as CalculationResultPreviewItem,
          {
            title: 'otherItem',
          } as Partial<CalculationResultPreviewItem> as CalculationResultPreviewItem,
        ],
      },
    });

    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute combined errors correctly', () => {
    expect(component.combinedErrors()).toBe(
      'Downstream Error 1 Error 1 Error 2'
    );
  });

  it('should filter catalog calculation data correctly', () => {
    expect(component.catalogCalculationData()).toEqual([
      { title: 'otherItem' },
    ]);
  });

  it('should filter downstream calculation data correctly', () => {
    expect(component.downstreamCalculationData()).toEqual([
      { title: 'emissions' },
      { title: 'frictionalPowerloss' },
    ]);
  });

  it('should compute affected headers correctly', () => {
    expect(component.affectedHeaders()).toEqual([
      { title: 'otherItem' },
      { title: 'emissions' },
      { title: 'frictionalPowerloss' },
    ]);
  });

  it('should set error title correctly', () => {
    expect(component.errorTitle()).toBe('Calculation Errors');
  });

  it('should open the dialog with correct data', () => {
    component.showErrorsDialog();

    expect(component['dialog'].open).toHaveBeenCalledWith(
      CalculationPreviewErrorsDialogComponent,
      {
        hasBackdrop: true,
        autoFocus: true,
        panelClass: 'calculation-errors-dialog',
        maxWidth: '750px',
        data: {
          title: 'Calculation Errors',
          downstreamPreviewItems: [
            { title: 'emissions' },
            { title: 'frictionalPowerloss' },
          ],
          downstreamErrors: ['Downstream Error 1'],
          catalogPreviewItems: [{ title: 'otherItem' }],
          catalogErrors: ['Error 1', 'Error 2'],
        },
      }
    );
  });

  it('should observe errorContainer on ngAfterViewInit', () => {
    const observeSpy = jest.spyOn(
      mockResizeObserver.mock.results[0].value,
      'observe'
    );
    spectator.component.ngAfterViewInit();

    expect(observeSpy).toHaveBeenCalledWith(
      spectator.component.errorContainer.nativeElement
    );
  });

  it('should unobserve errorContainer on ngOnDestroy', () => {
    const unobserveSpy = jest.spyOn(
      mockResizeObserver.mock.results[0].value,
      'unobserve'
    );
    const disconnectMutationSpy = jest.spyOn(
      mockMutationObserver.mock.results[0].value,
      'disconnect'
    );

    spectator.component.ngOnDestroy();
    expect(unobserveSpy).toHaveBeenCalledWith(
      spectator.component.errorContainer.nativeElement
    );
    expect(disconnectMutationSpy).toHaveBeenCalled();
  });

  it('should update isOverflowing correctly in checkOverflow', () => {
    const element = spectator.component.errorContainer.nativeElement;
    jest.spyOn(element, 'scrollHeight', 'get').mockReturnValue(200);
    jest.spyOn(element, 'clientHeight', 'get').mockReturnValue(100);

    spectator.component.checkOverflow();
    expect(spectator.component.isOverflowing).toBe(true);

    jest.spyOn(element, 'scrollHeight', 'get').mockReturnValue(100);
    jest.spyOn(element, 'clientHeight', 'get').mockReturnValue(200);

    spectator.component.checkOverflow();
    expect(spectator.component.isOverflowing).toBe(false);
  });

  it('should handle null element gracefully', () => {
    spectator.component.errorContainer.nativeElement = undefined;

    spectator.component.checkOverflow();
    expect(spectator.component.isOverflowing).toBe(false);
  });

  it('should call checkOverflow when ResizeObserver is triggered', () => {
    const checkOverflowSpy = jest.spyOn(spectator.component, 'checkOverflow');
    const resizeObserverCallback = mockResizeObserver.mock.calls[0][0];
    resizeObserverCallback();
    expect(checkOverflowSpy).toHaveBeenCalled();
  });

  it('should call checkOverflow when MutationObserver is triggered', () => {
    const checkOverflowSpy = jest.spyOn(spectator.component, 'checkOverflow');
    const mutationObserverCallback = mockMutationObserver.mock.calls[0][0];
    mutationObserverCallback();
    expect(checkOverflowSpy).toHaveBeenCalled();
  });
});
