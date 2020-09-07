import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';

import { configureTestSuite } from 'ng-bullet';

import { COLOR_PLATTE } from '../../bom-chart/bom-chart.config';
import { MaterialDesignationCellRendererComponent } from './material-designation-cell-renderer.component';

describe('MaterialDesignationCellRendererComponent', () => {
  let component: MaterialDesignationCellRendererComponent;
  let fixture: ComponentFixture<MaterialDesignationCellRendererComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [FlexLayoutModule],
      declarations: [MaterialDesignationCellRendererComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDesignationCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
