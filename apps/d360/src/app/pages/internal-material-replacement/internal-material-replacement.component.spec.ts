import { GridApi } from 'ag-grid-enterprise';

import { Stub } from '../../shared/test/stub.class';
import { InternalMaterialReplacementMultiSubstitutionModalComponent } from './components/modals/internal-material-replacement-multi-substitution-modal/internal-material-replacement-multi-substitution-modal.component';
import { InternalMaterialReplacementSingleSubstitutionModalComponent } from './components/modals/internal-material-replacement-single-substitution-modal/internal-material-replacement-single-substitution-modal.component';
import { InternalMaterialReplacementComponent } from './internal-material-replacement.component';

describe('InternalMaterialReplacementComponent', () => {
  let component: InternalMaterialReplacementComponent;

  beforeEach(() => {
    component = Stub.get<InternalMaterialReplacementComponent>({
      component: InternalMaterialReplacementComponent,
      providers: [Stub.getMatDialogProvider()],
    });
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set regionControl value on loading$ completion', () => {
      jest.spyOn(component['selectableOptionsService'], 'get').mockReturnValue({
        options: [{ id: 'region1', text: 'Region 1' }],
      });

      component.ngOnInit();

      expect(component['regionControl'].value).toEqual({
        id: 'region1',
        text: 'Region 1',
      });
    });
  });

  describe('getApi', () => {
    it('should set gridApi property with the provided GridApi instance', () => {
      const mockGridApi: GridApi = {
        refreshServerSide: jest.fn(),
      } as any;
      component['gridApi'] = null;
      expect(component['gridApi']).toBeNull();

      component['getApi'](mockGridApi);

      expect(component['gridApi']).toBe(mockGridApi);
    });
  });

  describe('handleCreateSingleIMR', () => {
    it('should open the dialog and refresh the gridApi on success', () => {
      const mockGridApi = {
        refreshServerSide: jest.fn(),
      };
      component['gridApi'] = mockGridApi as any;
      component['regionControl'].setValue({ id: 'region1', text: 'Region 1' });
      component['handleCreateSingleIMR']();
      expect(component['dialog'].open).toHaveBeenCalledWith(
        InternalMaterialReplacementSingleSubstitutionModalComponent,
        {
          data: {
            substitution: expect.any(Object),
            isNewSubstitution: true,
            gridApi: mockGridApi,
          },
          panelClass: ['form-dialog', 'internal-material-replacement'],
          autoFocus: false,
          disableClose: true,
        }
      );
    });
  });

  describe('handleCreateMultiIMR', () => {
    it('should open the dialog and refresh the gridApi on success', () => {
      const mockGridApi = {
        refreshServerSide: jest.fn(),
      };
      component['gridApi'] = mockGridApi as any;
      component['handleCreateMultiIMR']();
      expect(component['dialog'].open).toHaveBeenCalledWith(
        InternalMaterialReplacementMultiSubstitutionModalComponent,
        {
          disableClose: true,
          panelClass: ['table-dialog', 'internal-material-replacement'],
          autoFocus: false,
          maxHeight: 'calc(100% - 64px)',
          maxWidth: 'none',
          width: 'calc(100% - 64px)',
        }
      );
    });
  });
});
