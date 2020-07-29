import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { IStatusPanelParams } from '@ag-grid-community/core';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { BomViewButtonComponent } from './bom-view-button.component';

describe('BomViewButtonComponent', () => {
  let component: BomViewButtonComponent;
  let fixture: ComponentFixture<BomViewButtonComponent>;
  let params: IStatusPanelParams;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [BomViewButtonComponent],
      imports: [
        MatButtonModule,
        RouterTestingModule.withRoutes([]),
        provideTranslocoTestingModule({}),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BomViewButtonComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
    params = ({
      api: {
        addEventListener: jest.fn(),
        getSelectedRows: jest.fn(),
      },
    } as unknown) as IStatusPanelParams;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set params and add listeners', () => {
      component.agInit((params as unknown) as IStatusPanelParams);

      expect(component['params']).toEqual(params);

      expect(params.api.addEventListener).toHaveBeenCalledTimes(2);
    });
  });

  describe('onGridReady', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onGridReady();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
    });
  });

  describe('onSelectionChange', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onSelectionChange();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
    });
  });

  describe('showBomView', () => {
    test('should navigate', () => {
      component.selections = [{ materialNumber: '', plant: '' }];
      spyOn(router, 'navigate');
      component.showBomView();
      expect(router.navigate).toHaveBeenCalled();
    });
  });
});
