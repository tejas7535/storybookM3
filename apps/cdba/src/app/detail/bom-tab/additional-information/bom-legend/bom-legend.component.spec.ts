import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AgGridModule } from '@ag-grid-community/angular';
import { configureTestSuite } from 'ng-bullet';

import { BomLegendComponent } from './bom-legend.component';
import { MaterialDesignationCellRendererComponent } from './material-designation-cell-renderer/material-designation-cell-renderer.component';

describe('BomLegendComponent', () => {
  let component: BomLegendComponent;
  let fixture: ComponentFixture<BomLegendComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        FlexLayoutModule,
        AgGridModule.withComponents([MaterialDesignationCellRendererComponent]),
      ],
      declarations: [
        BomLegendComponent,
        MaterialDesignationCellRendererComponent,
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BomLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
