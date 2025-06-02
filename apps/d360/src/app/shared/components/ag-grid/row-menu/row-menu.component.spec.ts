import { IMRSubstitution } from '../../../../feature/internal-material-replacement/model';
import { Stub } from '../../../test/stub.class';
import { RowMenuComponent } from './row-menu.component';

describe('RowMenuComponent', () => {
  let component: RowMenuComponent<IMRSubstitution>;

  beforeEach(() => {
    component = Stub.get<RowMenuComponent<IMRSubstitution>>({
      component: RowMenuComponent,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleOpen', () => {
    it('should emit true when handleOpen is called', () => {
      const spy = jest.spyOn(component['openChange'], 'emit');

      component['handleOpen']();

      expect(spy).toHaveBeenCalledWith(true);
    });
  });

  describe('handleClose', () => {
    it('should emit false when handleClose is called', () => {
      const spy = jest.spyOn(component['openChange'], 'emit');

      component['handleClose']();

      expect(spy).toHaveBeenCalledWith(false);
    });
  });

  describe('agInit', () => {
    it('should initialize data and params', () => {
      const mockData = { id: '123' } as unknown as IMRSubstitution;
      const mockParams = {
        data: mockData,
        someOtherProp: 'test',
      } as any;

      component.agInit(mockParams);

      expect(component['data']).toBe(mockData);
      expect(component['params']).toBe(mockParams);
    });
  });

  describe('refresh', () => {
    it('should return false', () => {
      const mockParams = {} as any;

      const result = component.refresh(mockParams);

      expect(result).toBe(false);
    });
  });

  describe('updateData', () => {
    it('should update data and call API to update node data', () => {
      const mockData = { id: '123' } as unknown as IMRSubstitution;
      const mockNode = { id: 'node-id' };
      const mockApi = {
        getRowNode: jest.fn().mockReturnValue({
          updateData: jest.fn(),
        }),
      };

      component['params'] = {
        node: mockNode,
        api: mockApi,
      } as any;

      component['updateData'](mockData);

      expect(component['data']).toBe(mockData);
      expect(component['params'].data).toBe(mockData);
      expect(mockApi.getRowNode).toHaveBeenCalledWith(mockNode.id);
      expect(mockApi.getRowNode(mockNode.id).updateData).toHaveBeenCalledWith(
        mockData
      );
    });
  });
});
