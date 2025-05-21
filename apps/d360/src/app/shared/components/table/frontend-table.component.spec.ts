import { of, throwError } from 'rxjs';

import { Stub } from '../../test/stub.class';
import { FrontendTableComponent } from './frontend-table.component';
import { FrontendTableResponse } from './interfaces';

describe('FrontendTableComponent', () => {
  let component: FrontendTableComponent;

  beforeEach(() => {
    component = Stub.getForEffect<FrontendTableComponent>({
      component: FrontendTableComponent,
    });

    // Mock gridApi
    component['gridApi'] = Stub.getGridApi();
  });

  describe('getDataSource', () => {
    it('should throw an error when called', () => {
      expect(() => component['getDataSource']()).toThrow(
        '[TableWrapper] Not available for frontend tables'
      );
    });
  });

  describe('loadData', () => {
    it('should load data and update the grid when data is fetched successfully', (done) => {
      const mockResponse: FrontendTableResponse = {
        content: [{ id: '1', name: 'Test Row' }],
      };

      const getDataSpy = jest.fn().mockReturnValue(of(mockResponse));
      const showLoaderSpy = jest.spyOn<any, any>(component, 'showLoader');
      const hideOverlaysSpy = jest.spyOn<any, any>(component, 'hideOverlays');
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );
      jest
        .spyOn(component['gridApi'], 'getDisplayedRowCount')
        .mockReturnValue(mockResponse.content.length);
      const dataFetchedEventSpy = jest.spyOn(
        component['dataFetchedEvent$'](),
        'next'
      );

      Stub.setInput('config', {});
      Stub.setInput('getData', getDataSpy);
      Stub.detectChanges();

      component['loadData']();

      setTimeout(() => {
        expect(showLoaderSpy).toHaveBeenCalled();
        expect(hideOverlaysSpy).toHaveBeenCalled();
        expect(setGridOptionSpy).toHaveBeenCalledWith(
          'rowData',
          mockResponse.content
        );
        expect(dataFetchedEventSpy).toHaveBeenCalledWith({
          rowCount: 1,
        });
        done();
      });
    });

    it('should show a no rows message when the response content is empty', (done) => {
      const mockResponse: FrontendTableResponse = {} as any;

      const getDataSpy = jest.fn().mockReturnValue(of(mockResponse));
      const showMessageSpy = jest.spyOn<any, any>(component, 'showMessage');

      Stub.setInput('config', {});
      Stub.setInput('getData', getDataSpy);
      Stub.detectChanges();

      component['loadData']();

      setTimeout(() => {
        expect(showMessageSpy).toHaveBeenCalledWith('');
        done();
      });
    });

    it('should handle fetch errors gracefully', (done) => {
      const getDataSpy = jest
        .fn()
        .mockReturnValue(throwError(() => new Error('Fetch error')));
      const handleFetchErrorSpy = jest.spyOn<any, any>(
        component,
        'handleFetchError$'
      );

      Stub.setInput('config', {});
      Stub.setInput('getData', getDataSpy);
      Stub.detectChanges();

      component['loadData']();

      setTimeout(() => {
        expect(handleFetchErrorSpy).toHaveBeenCalledWith(
          new Error('Fetch error'),
          null
        );
        done();
      });
    });

    it('should not load data if gridApi is not set', () => {
      component['gridApi'] = undefined;

      const showLoaderSpy = jest.spyOn<any, any>(component, 'showLoader');
      component['loadData']();

      expect(showLoaderSpy).not.toHaveBeenCalled();
    });
  });
});
