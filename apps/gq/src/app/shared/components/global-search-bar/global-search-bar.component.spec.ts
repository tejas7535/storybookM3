import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { of } from 'rxjs';

import { Spectator, SpyObject } from '@ngneat/spectator';
import { createComponentFactory } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SharedDirectivesModule } from '../../directives/shared-directives.module';
import { GlobalSearchBarComponent } from './global-search-bar.component';
import { GlobalSearchModalComponent } from './global-search-modal/global-search-modal.component';

describe('GlobalSearchBarComponent', () => {
  let component: GlobalSearchBarComponent;
  let spectator: Spectator<GlobalSearchBarComponent>;
  let matDialogSpyObject: SpyObject<MatDialog>;

  const createComponent = createComponentFactory({
    component: GlobalSearchBarComponent,
    imports: [
      SharedDirectivesModule,
      provideTranslocoTestingModule({ en: {} }),
      MatIconModule,
      MatDialogModule,
    ],
    declarations: [GlobalSearchBarComponent],
    mocks: [MatDialog],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    matDialogSpyObject = spectator.inject(MatDialog);
    matDialogSpyObject.open.andReturn({
      afterClosed: jest.fn(() => of(true)),
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openGlobalSearchModal', () => {
    test('should open matDialog', () => {
      component.openGlobalSearchModal();

      expect(matDialogSpyObject.open).toHaveBeenCalledTimes(1);
      expect(matDialogSpyObject.open).toHaveBeenCalledWith(
        GlobalSearchModalComponent,
        {
          panelClass: 'global-search-modal',
          width: '880px',
          position: {
            top: '20vh',
          },
        }
      );
    });
  });
});
