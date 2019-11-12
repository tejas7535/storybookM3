import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { SpeedDialFabModule } from './speed-dial-fab.module';

describe('SpeedDialFabModule', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [SpeedDialFabModule]
    });
  });

  it('should create', () => {
    expect(SpeedDialFabModule).toBeDefined();
  });
});
