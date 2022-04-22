import { ENV, getEnv } from '@cdba/environments/environment.provider';
import { MaterialNumberModule } from '@cdba/shared/pipes';
import { BOM_ODATA_MOCK } from '@cdba/testing/mocks';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { COST_SHARE_CATEGORY_COLORS } from '../../../constants/colors';
import { MaterialDesignationCellRendererComponent } from './material-designation-cell-renderer.component';

describe('MaterialDesignationCellRendererComponent', () => {
  let spectator: Spectator<MaterialDesignationCellRendererComponent>;
  let component: MaterialDesignationCellRendererComponent;

  const params = { value: 'F-2312', rowIndex: 2, data: BOM_ODATA_MOCK[1] };

  const createComponent = createComponentFactory({
    component: MaterialDesignationCellRendererComponent,
    imports: [MaterialNumberModule],
    providers: [{ provide: ENV, useValue: { ...getEnv() } }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should set color and material designation', () => {
      component.agInit(params);

      expect(component.materialDesignation).toEqual('F-2312');
      expect(component.color).toEqual(
        COST_SHARE_CATEGORY_COLORS.get('highest')
      );
    });
  });

  describe('refresh', () => {
    it('should refresh variables correctly', () => {
      const result = component.refresh(params);

      expect(component.materialDesignation).toEqual('F-2312');
      expect(component.color).toEqual(
        COST_SHARE_CATEGORY_COLORS.get('highest')
      );
      expect(result).toBeTruthy();
    });
  });
});
