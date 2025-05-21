import { of } from 'rxjs';

import { MockProvider } from 'ng-mocks';

import { IMRService } from '../../../../feature/internal-material-replacement/imr.service';
import { Stub } from '../../../../shared/test/stub.class';
import { InternalMaterialReplacementTableComponent } from './internal-material-replacement-table.component';

describe('InternalMaterialReplacementTableComponent', () => {
  let component: InternalMaterialReplacementTableComponent;

  beforeEach(() => {
    component = Stub.getForEffect<InternalMaterialReplacementTableComponent>({
      component: InternalMaterialReplacementTableComponent,
      providers: [
        Stub.getMatDialogProvider(),
        // we need it here, can't be removed!
        MockProvider(IMRService, Stub.getIMRService(), 'useValue'),
      ],
    });

    // Mock the selectedRegion input
    Stub.setInput('selectedRegion', 'region1');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('getData', () => {
    it('should call imrService.getIMRData with correct parameters', () => {
      const mockParams = { page: 1, pageSize: 10 };
      const imrServiceSpy = jest.spyOn(component['imrService'], 'getIMRData');

      component['getData$'](mockParams as any).subscribe();

      expect(imrServiceSpy).toHaveBeenCalledWith(
        { region: ['region1'] },
        mockParams
      );
    });
  });

  describe('setColumnDefinitions', () => {
    it('should set column definitions when loading$ emits false', () => {
      const setConfigSpy = jest.spyOn<any, any>(component, 'setConfig');
      const selectableOptionsService = component['selectableOptionsService'];
      selectableOptionsService.loading$.next(false);

      component['setColumnDefinitions']();

      expect(setConfigSpy).toHaveBeenCalled();
    });
  });

  describe('edit', () => {
    it('should open the substitution modal and update data if reloadData is true', () => {
      component['gridApi'] = Stub.getGridApi();
      const mockParams = { data: {}, api: component['gridApi'] } as any;
      const dialogSpy = jest
        .spyOn(component['dialog'], 'open')
        .mockReturnValue({
          afterClosed: () =>
            of({ reloadData: true, redefinedSubstitution: {} }),
        } as any);
      const applyTransactionSpy = jest.spyOn(
        component['gridApi'],
        'applyServerSideTransaction'
      );

      component['edit'](mockParams);

      expect(dialogSpy).toHaveBeenCalled();
      expect(applyTransactionSpy).toHaveBeenCalledWith({
        update: [{}],
      });
    });
  });

  describe('delete', () => {
    it('should open the delete modal and remove data if reloadData is true', () => {
      const mockParams = { data: {}, api: Stub.getGridApi() } as any;
      const dialogSpy = jest
        .spyOn(component['dialog'], 'open')
        .mockReturnValue({
          afterClosed: () => of(true),
        } as any);
      const applyTransactionSpy = jest.spyOn(
        mockParams.api,
        'applyServerSideTransaction'
      );
      const dataFetchedEventSpy = jest.spyOn(
        component['dataFetchedEvent$'],
        'next'
      );

      component['delete'](mockParams);

      expect(dialogSpy).toHaveBeenCalled();
      expect(applyTransactionSpy).toHaveBeenCalledWith({
        remove: [{}],
      });
      expect(dataFetchedEventSpy).toHaveBeenCalled();
    });
  });

  describe('constructor', () => {
    it('should call setColumnDefinitions when selectedRegion changes', () => {
      const setColumnDefinitionsSpy = jest.spyOn<any, any>(
        component,
        'setColumnDefinitions'
      );

      Stub.setInput('selectedRegion', 'region2');
      Stub.detectChanges();

      expect(setColumnDefinitionsSpy).toHaveBeenCalled();
    });
  });
});
