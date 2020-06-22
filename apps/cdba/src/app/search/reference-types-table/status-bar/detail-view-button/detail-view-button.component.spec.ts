import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { IStatusPanelParams } from '@ag-grid-community/core';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { DetailViewButtonComponent } from './detail-view-button.component';

describe('DetailViewButtonComponent', () => {
  let component: DetailViewButtonComponent;
  let fixture: ComponentFixture<DetailViewButtonComponent>;
  let params: IStatusPanelParams;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [DetailViewButtonComponent],
      imports: [
        MatIconModule,
        MatButtonModule,
        RouterTestingModule.withRoutes([]),
        provideTranslocoTestingModule({}),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailViewButtonComponent);

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

  describe('showDetailView', () => {
    test('should navigate', () => {
      component.selections = [{ materialNumber: '', plant: '' }];
      spyOn(router, 'navigate');
      component.showDetailView();
      expect(router.navigate).toHaveBeenCalled();
    });
  });
});
