import { ENV, getEnv } from '@cdba/environments/environment.provider';
import { MaterialNumberModule } from '@cdba/shared/pipes';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { COLOR_PLATTE } from '../../bom-chart/bom-chart.constants';
import { MaterialDesignationCellRendererComponent } from './material-designation-cell-renderer.component';

describe('MaterialDesignationCellRendererComponent', () => {
  let spectator: Spectator<MaterialDesignationCellRendererComponent>;
  let component: MaterialDesignationCellRendererComponent;

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
      const params = { value: 'F-2312', rowIndex: 2 };

      component.agInit(params);

      expect(component.materialDesignation).toEqual('F-2312');
      expect(component.color).toEqual(COLOR_PLATTE[2]);
    });
  });

  describe('refresh', () => {
    it('should refresh variables correctly', () => {
      const params = { value: 'F-2312', rowIndex: 2 };

      const result = component.refresh(params);

      expect(component.materialDesignation).toEqual('F-2312');
      expect(component.color).toEqual(COLOR_PLATTE[2]);
      expect(result).toBeTruthy();
    });
  });
});
