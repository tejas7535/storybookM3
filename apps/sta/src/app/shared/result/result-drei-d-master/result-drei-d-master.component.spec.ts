import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { APP_STATE_MOCK } from '../../../../testing/mocks/shared/app-state.mock';
import { GhostLineElementsModule } from '../../ghost-elements/ghost-line-elements.module';
import { ResultDreiDMasterComponent } from './result-drei-d-master.component';

describe('ResultAutoTaggingComponent', () => {
  let component: ResultDreiDMasterComponent;
  let fixture: ComponentFixture<ResultDreiDMasterComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        GhostLineElementsModule,
        HttpClientTestingModule,
        MatChipsModule,
        MatExpansionModule,
        MatDividerModule,
      ],
      declarations: [ResultDreiDMasterComponent],
      providers: [provideMockStore({ initialState: APP_STATE_MOCK })],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultDreiDMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOniInit', () => {
    test('should set observable', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.classificationResult$).toBeDefined();
    });
  });
});
