import { Stub } from '../../../../test/stub.class';
import { DeleteButtonCellRendererComponent } from './delete-button-cell-renderer.component';

describe('DeleteButtonCellRendererComponent', () => {
  let component: DeleteButtonCellRendererComponent;

  beforeEach(() => {
    component = Stub.get<DeleteButtonCellRendererComponent>({
      component: DeleteButtonCellRendererComponent,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should set params property', () => {
      const mockParams = { value: 'test' } as any;

      component.agInit(mockParams);

      expect((component as any).params).toBe(mockParams);
    });
  });

  describe('refresh', () => {
    it('should update params and return true', () => {
      const mockParams = { value: 'refreshed' } as any;

      const result = component.refresh(mockParams);

      expect((component as any).params).toBe(mockParams);
      expect(result).toBe(true);
    });
  });

  describe('onDeleteRow', () => {
    it('should call applyTransaction with remove operation', () => {
      const mockData = { id: '123' };
      const mockNode = { data: mockData };
      const mockApi = { applyTransaction: jest.fn() };

      (component as any).params = {
        api: mockApi,
        node: mockNode,
      };

      component.onDeleteRow();

      expect(mockApi.applyTransaction).toHaveBeenCalledWith({
        remove: [mockData],
      });
    });

    it('should call onClickCallback when provided', () => {
      const mockData = { id: '123' };
      const mockNode = { data: mockData };
      const mockApi = { applyTransaction: jest.fn() };
      const mockCallback = jest.fn();

      const mockParams = {
        api: mockApi,
        node: mockNode,
        onClickCallback: mockCallback,
      };

      (component as any).params = mockParams;

      component.onDeleteRow();

      expect(mockCallback).toHaveBeenCalledWith(mockParams);
      expect(mockApi.applyTransaction).toHaveBeenCalledWith({
        remove: [mockData],
      });
    });
  });
});
